import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft, History, Database } from 'lucide-react'

export function ScrapingHistory() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scraping History</h1>
          <p className="text-gray-600">View all your past scraping projects and exports</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-600 mb-6">Your scraping history will appear here once you complete projects</p>
            <Button asChild>
              <Link to="/scrape">
                <Database className="w-4 h-4 mr-2" />
                Start Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}