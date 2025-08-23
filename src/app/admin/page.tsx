export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          CMS Admin Setup Required
        </h1>
        <p className="text-gray-600 mb-6">
          To access the Payload CMS admin interface, you need to set up your database connection first.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left text-sm">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Setup:</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Copy <code>.env.example</code> to <code>.env</code></li>
            <li>Add your PostgreSQL database URL</li>
            <li>Run <code>npm run dev</code></li>
            <li>Visit <code>/admin</code> to create your first user</li>
          </ol>
        </div>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}