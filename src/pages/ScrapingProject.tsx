import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Checkbox } from '../components/ui/checkbox'
import { Badge } from '../components/ui/badge'
import { 
  Globe, 
  Play, 
  Settings, 
  Target,
  Image,
  Link as LinkIcon,
  DollarSign,
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface DataType {
  id: string
  label: string
  icon: any
  description: string
  enabled: boolean
}

export function ScrapingProject() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetUrl: '',
    maxPages: 10,
    delay: 1000
  })

  const [dataTypes, setDataTypes] = useState<DataType[]>([
    {
      id: 'text',
      label: 'Text Content',
      icon: FileText,
      description: 'Extract headings, paragraphs, and text content',
      enabled: true
    },
    {
      id: 'links',
      label: 'Links',
      icon: LinkIcon,
      description: 'Extract all internal and external links',
      enabled: true
    },
    {
      id: 'images',
      label: 'Images',
      icon: Image,
      description: 'Extract image URLs and alt text',
      enabled: false
    },
    {
      id: 'prices',
      label: 'Prices',
      icon: DollarSign,
      description: 'Detect and extract price information',
      enabled: false
    },
    {
      id: 'emails',
      label: 'Email Addresses',
      icon: Mail,
      description: 'Find and extract email addresses',
      enabled: false
    },
    {
      id: 'phones',
      label: 'Phone Numbers',
      icon: Phone,
      description: 'Detect and extract phone numbers',
      enabled: false
    }
  ])

  const handleDataTypeToggle = (id: string) => {
    setDataTypes(prev => prev.map(type => 
      type.id === id ? { ...type, enabled: !type.enabled } : type
    ))
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to create a project')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a project name')
      return
    }

    if (!formData.targetUrl.trim()) {
      toast.error('Please enter a target URL')
      return
    }

    if (!validateUrl(formData.targetUrl)) {
      toast.error('Please enter a valid URL')
      return
    }

    const enabledDataTypes = dataTypes.filter(type => type.enabled)
    if (enabledDataTypes.length === 0) {
      toast.error('Please select at least one data type to extract')
      return
    }

    setLoading(true)

    try {
      // Create the scraping project
      const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await blink.db.scrapingProjects.create({
        id: projectId,
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        target_url: formData.targetUrl,
        status: 'pending',
        total_items: 0,
        scraped_items: 0
      })

      // Start the actual scraping process
      await performActualScraping(projectId, formData.targetUrl, enabledDataTypes)

      toast.success('Scraping project created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const performActualScraping = async (projectId: string, url: string, dataTypes: DataType[]) => {
    try {
      // Update project status to running
      await blink.db.scrapingProjects.update(projectId, {
        status: 'running',
        total_items: 0
      })

      toast.info('Starting web scraping...', { duration: 2000 })

      // Perform actual web scraping using Blink's data extraction
      const scrapedResult = await blink.data.scrape(url)
      
      console.log('Scraped data:', scrapedResult)
      
      // Extract different types of data based on user selection
      const extractedItems = []
      
      // Process the scraped content
      const { markdown, metadata, links, extract } = scrapedResult
      
      // Extract text content if selected
      if (dataTypes.find(dt => dt.id === 'text' && dt.enabled)) {
        // Extract headings and paragraphs from markdown
        const headings = extract?.headings || []
        const textContent = markdown || ''
        
        headings.forEach((heading, index) => {
          if (heading && heading.trim()) {
            extractedItems.push({
              id: `text_${Date.now()}_${index}`,
              project_id: projectId,
              user_id: user!.id,
              url: url,
              title: heading.replace(/^#+\s*/, ''), // Remove markdown heading syntax
              description: 'Text content extracted from webpage',
              image_url: null,
              price: null,
              email: null,
              phone: null,
              links: null,
              custom_data: JSON.stringify({
                type: 'text',
                content: heading,
                source: 'heading'
              })
            })
          }
        })
        
        // Extract paragraphs from markdown
        const paragraphs = textContent.split('\n\n').filter(p => p.trim() && !p.startsWith('#'))
        paragraphs.slice(0, 10).forEach((paragraph, index) => {
          if (paragraph.trim()) {
            extractedItems.push({
              id: `para_${Date.now()}_${index}`,
              project_id: projectId,
              user_id: user!.id,
              url: url,
              title: paragraph.substring(0, 100) + (paragraph.length > 100 ? '...' : ''),
              description: 'Paragraph content extracted from webpage',
              image_url: null,
              price: null,
              email: null,
              phone: null,
              links: null,
              custom_data: JSON.stringify({
                type: 'text',
                content: paragraph,
                source: 'paragraph'
              })
            })
          }
        })
      }
      
      // Extract links if selected
      if (dataTypes.find(dt => dt.id === 'links' && dt.enabled) && links) {
        links.slice(0, 20).forEach((link, index) => {
          if (link.url && link.text) {
            extractedItems.push({
              id: `link_${Date.now()}_${index}`,
              project_id: projectId,
              user_id: user!.id,
              url: url,
              title: link.text || 'Untitled Link',
              description: `Link to: ${link.url}`,
              image_url: null,
              price: null,
              email: null,
              phone: null,
              links: JSON.stringify([link]),
              custom_data: JSON.stringify({
                type: 'link',
                href: link.url,
                text: link.text
              })
            })
          }
        })
      }
      
      // Extract emails if selected
      if (dataTypes.find(dt => dt.id === 'emails' && dt.enabled)) {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        const emails = (markdown || '').match(emailRegex) || []
        const uniqueEmails = [...new Set(emails)]
        
        uniqueEmails.slice(0, 10).forEach((email, index) => {
          extractedItems.push({
            id: `email_${Date.now()}_${index}`,
            project_id: projectId,
            user_id: user!.id,
            url: url,
            title: email,
            description: 'Email address found on webpage',
            image_url: null,
            price: null,
            email: email,
            phone: null,
            links: null,
            custom_data: JSON.stringify({
              type: 'email',
              email: email
            })
          })
        })
      }
      
      // Extract phone numbers if selected
      if (dataTypes.find(dt => dt.id === 'phones' && dt.enabled)) {
        const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
        const phones = (markdown || '').match(phoneRegex) || []
        const uniquePhones = [...new Set(phones)].filter(phone => phone.length >= 10)
        
        uniquePhones.slice(0, 10).forEach((phone, index) => {
          extractedItems.push({
            id: `phone_${Date.now()}_${index}`,
            project_id: projectId,
            user_id: user!.id,
            url: url,
            title: phone,
            description: 'Phone number found on webpage',
            image_url: null,
            price: null,
            email: null,
            phone: phone,
            links: null,
            custom_data: JSON.stringify({
              type: 'phone',
              phone: phone
            })
          })
        })
      }
      
      // Extract prices if selected
      if (dataTypes.find(dt => dt.id === 'prices' && dt.enabled)) {
        const priceRegex = /\$\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|EUR|GBP|\$)/g
        const prices = (markdown || '').match(priceRegex) || []
        const uniquePrices = [...new Set(prices)]
        
        uniquePrices.slice(0, 10).forEach((price, index) => {
          extractedItems.push({
            id: `price_${Date.now()}_${index}`,
            project_id: projectId,
            user_id: user!.id,
            url: url,
            title: price,
            description: 'Price information found on webpage',
            image_url: null,
            price: price,
            email: null,
            phone: null,
            links: null,
            custom_data: JSON.stringify({
              type: 'price',
              price: price
            })
          })
        })
      }
      
      // Add general metadata
      if (metadata) {
        extractedItems.push({
          id: `meta_${Date.now()}`,
          project_id: projectId,
          user_id: user!.id,
          url: url,
          title: metadata.title || 'Page Metadata',
          description: metadata.description || 'Page metadata information',
          image_url: null,
          price: null,
          email: null,
          phone: null,
          links: null,
          custom_data: JSON.stringify({
            type: 'metadata',
            metadata: metadata
          })
        })
      }

      // Insert all extracted data
      if (extractedItems.length > 0) {
        await blink.db.scrapedData.createMany(extractedItems)
        toast.success(`Successfully extracted ${extractedItems.length} items!`)
      } else {
        toast.warning('No data found matching your selected criteria')
      }

      // Update project as completed
      await blink.db.scrapingProjects.update(projectId, {
        status: 'completed',
        scraped_items: extractedItems.length,
        total_items: extractedItems.length
      })

    } catch (error) {
      console.error('Web scraping failed:', error)
      toast.error('Failed to scrape website: ' + (error as Error).message)
      
      // Update project as failed
      await blink.db.scrapingProjects.update(projectId, {
        status: 'failed'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Scraping Project
          </h1>
          <p className="text-gray-600">
            Set up a new web scraping project to extract data from any website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., E-commerce Product Data"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what data you want to extract..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Target URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Target Website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">Website URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the URL of the website you want to scrape data from
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxPages">Max Pages</Label>
                  <Input
                    id="maxPages"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.maxPages}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxPages: parseInt(e.target.value) || 10 }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum number of pages to scrape
                  </p>
                </div>

                <div>
                  <Label htmlFor="delay">Delay (ms)</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="500"
                    max="10000"
                    value={formData.delay}
                    onChange={(e) => setFormData(prev => ({ ...prev, delay: parseInt(e.target.value) || 1000 }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Delay between requests (ethical scraping)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Data to Extract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataTypes.map((dataType) => {
                  const Icon = dataType.icon
                  return (
                    <div
                      key={dataType.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        dataType.enabled
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleDataTypeToggle(dataType.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={dataType.enabled}
                          onChange={() => handleDataTypeToggle(dataType.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="font-medium">{dataType.label}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {dataType.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Selected Data Types</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dataTypes.filter(dt => dt.enabled).map(dt => (
                    <Badge key={dt.id} variant="secondary">
                      {dt.label}
                    </Badge>
                  ))}
                  {dataTypes.filter(dt => dt.enabled).length === 0 && (
                    <span className="text-sm text-gray-500">No data types selected</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}