import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft, Download, FileSpreadsheet, FileText, Database } from 'lucide-react'

export function ExportCenter() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Center</h1>
          <p className="text-gray-600">Export your scraped data in various formats</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2 text-green-600" />
                CSV Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Export data as comma-separated values for Excel and other tools</p>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                JSON Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Export structured data in JSON format for developers</p>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-purple-600" />
                Excel Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Export data as Excel spreadsheet with formatting</p>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}