import { PieChart } from 'lucide-react'

interface CategoryData {
  category: string
  courses: number
  timeSpent: number
  color: string
}

interface CategoryBreakdownProps {
  data: CategoryData[]
}

const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Learning by Category</h3>
        <div className="text-center py-12 text-gray-500">
          No category data available yet
        </div>
      </div>
    )
  }

  const totalCourses = data.reduce((sum, cat) => sum + cat.courses, 0)
  const totalTime = data.reduce((sum, cat) => sum + cat.timeSpent, 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Learning by Category</h3>
        <PieChart className="w-5 h-5 text-primary-600" />
      </div>

      <div className="space-y-4">
        {data.map((category, index) => {
          const coursePercentage = totalCourses > 0
            ? Math.round((category.courses / totalCourses) * 100)
            : 0
          const timePercentage = totalTime > 0
            ? Math.round((category.timeSpent / totalTime) * 100)
            : 0

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {category.courses} {category.courses === 1 ? 'course' : 'courses'}
                </div>
              </div>

              <div className="ml-7">
                {/* Course Distribution */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${coursePercentage}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">{coursePercentage}%</span>
                </div>

                {/* Time Distribution */}
                <div className="flex items-center text-xs text-gray-600">
                  <span>{Math.round(category.timeSpent)} hours spent ({timePercentage}% of total)</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">{totalCourses}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.round(totalTime)}</div>
          <div className="text-sm text-gray-600">Total Hours</div>
        </div>
      </div>
    </div>
  )
}

export default CategoryBreakdown
