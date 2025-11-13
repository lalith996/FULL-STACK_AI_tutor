import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Award, Download, Share2, Search, ExternalLink } from 'lucide-react'
import { certificateService } from '@/services/certificateService'
import { Link } from 'react-router-dom'

const CertificatesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: certificates, isLoading } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: () => certificateService.getMyCertificates()
  })

  const filteredCertificates = certificates?.filter(cert =>
    cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.courseCategory.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        </div>
        <p className="text-gray-600">
          View and download your course completion certificates
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates by course name or category..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Certificates Grid */}
      {!filteredCertificates || filteredCertificates.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Complete a course to earn your first certificate!
          </p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate._id} certificate={certificate} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface CertificateCardProps {
  certificate: any
}

const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const formattedDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/certificate/${certificate.certificateId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Course Completion Certificate',
          text: `I completed ${certificate.courseName}!`,
          url: shareUrl
        })
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
    }
  }

  return (
    <div className="card group hover:shadow-xl transition-shadow duration-300">
      {/* Certificate Preview */}
      <Link to={`/certificate/${certificate.certificateId}`}>
        <div className="relative bg-gradient-to-br from-primary-50 to-purple-50 p-6 rounded-lg mb-4 cursor-pointer">
          {/* Mini Certificate Design */}
          <div className="border-4 border-double border-primary-300 rounded p-4 bg-white">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-serif text-sm font-bold text-gray-900 mb-1">
                Certificate of Completion
              </h4>
              <div className="w-12 h-0.5 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600 mb-1">This certifies that</p>
              <p className="font-bold text-primary-600 mb-1">{certificate.studentName}</p>
              <p className="text-xs text-gray-600">has successfully completed</p>
              <p className="font-semibold text-xs text-gray-900 mt-1">{certificate.courseName}</p>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300 flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </Link>

      {/* Certificate Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {certificate.courseName}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
              {certificate.courseCategory}
            </span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>Instructor: <span className="font-medium">{certificate.instructor}</span></p>
          <p className="text-xs font-mono text-gray-500 mt-1">
            ID: {certificate.certificateId}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2 border-t">
          <Link
            to={`/certificate/${certificate.certificateId}`}
            className="btn btn-primary btn-sm flex-1 flex items-center justify-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>View & Download</span>
          </Link>
          <button
            onClick={handleShare}
            className="btn btn-outline btn-sm flex items-center justify-center"
            title="Share Certificate"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CertificatesPage
