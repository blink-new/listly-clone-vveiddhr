import { Navigation } from '@/components/Navigation'

export default function ListView() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">List View</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">List view coming soon...</p>
        </div>
      </div>
    </div>
  )
}