import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { 
  ArrowLeft, 
  Download, 
  Search, 
  ExternalLink,
  Globe,
  Calendar,
  Database
} from 'lucide-react'
import { toast } from 'sonner'

interface ScrapedItem {
  id: string
  url: string
  title: string
  description: string
  image_url: string | null
  price: string | null
  email: string | null
  phone: string | null
  links: string
  custom_data: string
  scraped_at: string
}

interface Project {
  id: string
  name: string
  target_url: string
  status: string
  scraped_items: number
  total_items: number
}

export function DataPreview() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [scrapedData, setScrapedData] = useState<ScrapedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user && projectId) {
      loadProjectData()
    }
  }, [user, projectId, loadProjectData])

  const loadProjectData = useCallback(async () => {
    try {
      // Load project details
      const projectData = await blink.db.scrapingProjects.list({
        where: { id: projectId, user_id: user?.id }
      })
      
      if (projectData.length === 0) {
        toast.error('Project not found')
        return
      }
      
      setProject(projectData[0])

      // Load scraped data
      const data = await blink.db.scrapedData.list({
        where: { project_id: projectId, user_id: user?.id },
        orderBy: { scraped_at: 'desc' }
      })
      
      setScrapedData(data)
    } catch (error) {
      console.error('Failed to load project data:', error)
      toast.error('Failed to load project data')
    } finally {
      setLoading(false)
    }
  }, [user?.id, projectId])

  const filteredData = scrapedData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const parseCustomData = (customDataStr: string) => {
    try {
      return JSON.parse(customDataStr)
    } catch {
      return {}
    }
  }

  const parseLinks = (linksStr: string) => {
    try {
      return JSON.parse(linksStr)
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The requested project could not be found.</p>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                {project.target_url}
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Badge 
                className={
                  project.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'running'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              
              {project.status === 'completed' && (
                <Button asChild>
                  <Link to={`/export?project=${projectId}`}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Items Scraped</p>
                  <p className="text-2xl font-bold text-gray-900">{project.scraped_items}</p>
                </div>
                <Database className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expected</p>
                  <p className="text-2xl font-bold text-gray-900">{project.total_items}</p>
                </div>
                <Globe className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.total_items > 0 
                      ? Math.round((project.scraped_items / project.total_items) * 100)
                      : 0
                    }%
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search scraped data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Data Grid */}
        {filteredData.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No data found' : 'No scraped data yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Data will appear here once the scraping process completes'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => {
              const customData = parseCustomData(item.custom_data)
              const links = parseLinks(item.links)
              
              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 truncate">
                      {item.url}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {item.description && (
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      
                      {customData.content && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Extracted Content:</p>
                          <p className="text-sm line-clamp-3">{customData.content}</p>
                        </div>
                      )}
                      
                      {links.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Links Found: {links.length}</p>
                          <div className="space-y-1">
                            {links.slice(0, 3).map((link: string, index: number) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 block truncate"
                              >
                                {link}
                              </a>
                            ))}
                            {links.length > 3 && (
                              <p className="text-xs text-gray-500">
                                +{links.length - 3} more links
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(item.scraped_at).toLocaleDateString()}</span>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}