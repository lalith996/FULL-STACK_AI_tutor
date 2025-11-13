import { useRef } from 'react'
import { Award, Download, Share2, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CertificateProps {
  studentName: string
  courseName: string
  completionDate: Date
  instructor: string
  certificateId: string
  courseCategory: string
}

const CertificateGenerator = ({
  studentName,
  courseName,
  completionDate,
  instructor,
  certificateId,
  courseCategory
}: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    // In a real app, this would use html2canvas or similar library
    // to convert the certificate to PDF
    toast.success('Certificate download will be available soon!')

    // Example implementation with html2canvas (commented out):
    // const html2canvas = (await import('html2canvas')).default
    // const canvas = await html2canvas(certificateRef.current!)
    // const link = document.createElement('a')
    // link.download = `certificate-${certificateId}.png`
    // link.href = canvas.toDataURL()
    // link.click()
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Course Completion Certificate',
      text: `I just completed ${courseName}!`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success('Certificate shared!')
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
        style={{
          aspectRatio: '1.414/1', // A4 ratio
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        {/* Decorative Border */}
        <div className="absolute inset-0 border-8 border-double border-primary-600 m-4"></div>

        {/* Corner Decorations */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary-400"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary-400"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary-400"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary-400"></div>

        {/* Certificate Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          {/* Logo/Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Certificate of Completion
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mb-8"></div>

          {/* Content */}
          <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
          <h2 className="text-5xl font-bold text-primary-600 mb-6" style={{ fontFamily: 'serif' }}>
            {studentName}
          </h2>

          <p className="text-lg text-gray-600 mb-4">
            has successfully completed the course
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            {courseName}
          </h3>

          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="px-4 py-2 bg-primary-100 rounded-lg">
              <span className="text-sm text-gray-600">Category:</span>
              <span className="ml-2 font-semibold text-primary-700">{courseCategory}</span>
            </div>
            <div className="px-4 py-2 bg-green-100 rounded-lg">
              <span className="text-sm text-gray-600">Completed:</span>
              <span className="ml-2 font-semibold text-green-700">{formattedDate}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 w-full">
            <div className="flex items-end justify-between">
              <div className="text-left">
                <div className="w-48 border-t-2 border-gray-900 mb-2"></div>
                <p className="text-sm font-semibold text-gray-900">{instructor}</p>
                <p className="text-xs text-gray-600">Course Instructor</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-2">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <p className="text-xs text-gray-600">Verified Certificate</p>
              </div>

              <div className="text-right">
                <div className="w-48 border-t-2 border-gray-900 mb-2"></div>
                <p className="text-sm font-semibold text-gray-900">AI E-Learning</p>
                <p className="text-xs text-gray-600">Platform</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Certificate ID: <span className="font-mono font-semibold">{certificateId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Award className="w-96 h-96 text-primary-600" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleDownload}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={handleShare}
          className="btn btn-outline flex items-center space-x-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Verification Info */}
      <div className="max-w-2xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Certificate Verification:</strong> This certificate can be verified using the Certificate ID.
          Share this ID with potential employers or on your resume to prove your achievement.
        </p>
      </div>
    </div>
  )
}

export default CertificateGenerator
