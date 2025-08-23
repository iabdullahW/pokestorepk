import ImageUploadTest from '@/components/admin/ImageUploadTest'

export default function TestUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Upload Test</h1>
          <p className="text-gray-600">Use this page to test image uploads and debug issues</p>
        </div>
        <ImageUploadTest />
      </div>
    </div>
  )
} 