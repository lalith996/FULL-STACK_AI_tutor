import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import CertificateGenerator from '@/components/certificates/CertificateGenerator'
import { certificateService } from '@/services/certificateService'

const CertificateViewPage = () => {
  const { certificateId } = useParams<{ certificateId: string }>()

  const { data: certificate, isLoading, error } = useQuery({
    queryKey: ['certificate', certificateId],
    queryFn: () => certificateService.getCertificate(certificateId!),
    enabled: !!certificateId
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Certificate Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The certificate you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/certificates" className="btn btn-primary">
            View My Certificates
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/certificates"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Certificates</span>
      </Link>

      {/* Certificate Generator */}
      <CertificateGenerator
        studentName={certificate.studentName}
        courseName={certificate.courseName}
        completionDate={new Date(certificate.completionDate)}
        instructor={certificate.instructor}
        certificateId={certificate.certificateId}
        courseCategory={certificate.courseCategory}
      />

      {/* LinkedIn Share Tip */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Add to LinkedIn
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Showcase your achievement by adding this certificate to your LinkedIn profile:
              </p>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Click "Download PDF" above</li>
                <li>Go to your LinkedIn profile → Add profile section → Licenses & Certifications</li>
                <li>Fill in: Name: "{certificate.courseName}"</li>
                <li>Issuing organization: "AI E-Learning Platform"</li>
                <li>Issue date: {new Date(certificate.completionDate).toLocaleDateString()}</li>
                <li>Credential ID: {certificate.certificateId}</li>
                <li>Upload your certificate PDF</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Course Link */}
      <div className="mt-6 text-center">
        <Link
          to={`/course/${certificate.courseId}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View Course Details →
        </Link>
      </div>
    </div>
  )
}

export default CertificateViewPage
