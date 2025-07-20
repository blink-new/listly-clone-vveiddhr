import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Globe, 
  Database, 
  Download, 
  Zap, 
  Target, 
  FileSpreadsheet,
  Chrome,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react'

export function LandingPage() {
  const features = [
    {
      icon: Globe,
      title: 'Extract from Any Website',
      description: 'Scrape data from any website with our powerful extraction engine. No coding required.'
    },
    {
      icon: Target,
      title: 'Smart Pattern Detection',
      description: 'Automatically detect and extract repeated patterns like product listings, contact info, and more.'
    },
    {
      icon: FileSpreadsheet,
      title: 'Multiple Export Formats',
      description: 'Export your scraped data to CSV, Excel, JSON, or integrate directly with your tools.'
    },
    {
      icon: Chrome,
      title: 'Browser Extension',
      description: 'Install our Chrome extension for one-click scraping directly from your browser.'
    },
    {
      icon: Shield,
      title: 'Ethical Scraping',
      description: 'Built-in rate limiting and respect for robots.txt to ensure responsible data extraction.'
    },
    {
      icon: Clock,
      title: 'Real-time Progress',
      description: 'Monitor your scraping jobs in real-time with detailed progress tracking and error handling.'
    }
  ]

  const steps = [
    {
      step: '1',
      title: 'Enter URL',
      description: 'Paste the website URL you want to scrape data from'
    },
    {
      step: '2',
      title: 'Select Data',
      description: 'Choose what data to extract - text, images, links, prices, etc.'
    },
    {
      step: '3',
      title: 'Extract & Export',
      description: 'Let our AI extract the data and export it in your preferred format'
    }
  ]

  const useCases = [
    'E-commerce product data',
    'Lead generation & contact info',
    'Real estate listings',
    'Job postings & recruitment',
    'News & content aggregation',
    'Market research & pricing',
    'Social media monitoring',
    'Academic research data'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Web Scraping
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Extract Data from
              <span className="text-primary"> Any Website</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Turn any website into structured data with our powerful web scraping platform. 
              Extract, organize, and export data from millions of websites in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/dashboard">Start Scraping Free</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Chrome className="w-4 h-4 mr-2" />
                Download Extension
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 100 free extractions
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Web Scraping Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to extract, process, and export data from any website
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Extract data from any website in 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Use Case
            </h2>
            <p className="text-xl text-gray-600">
              From e-commerce to research, extract the data you need
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-700 font-medium">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Extract Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using Listly to automate their data collection
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/dashboard">
              <Database className="w-4 h-4 mr-2" />
              Start Scraping Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Listly</span>
              </div>
              <p className="text-gray-400">
                The most powerful web scraping platform for businesses and developers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/tutorials" className="hover:text-white">Tutorials</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Listly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}