import { TrendingUp } from 'lucide-react'

interface ProgressData {
  date: string
  completed: number
  timeSpent: number
}

interface ProgressChartProps {
  data: ProgressData[]
}

const ProgressChart = ({ data }: ProgressChartProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
        <div className="text-center py-12 text-gray-500">
          No progress data available yet
        </div>
      </div>
    )
  }

  const maxCompleted = Math.max(...data.map(d => d.completed), 1)
  const maxTimeSpent = Math.max(...data.map(d => d.timeSpent), 1)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Learning Progress</h3>
        <TrendingUp className="w-5 h-5 text-primary-600" />
      </div>

      <div className="space-y-6">
        {/* Lessons Completed Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Lessons Completed</h4>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-xs text-gray-600 w-20">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-end pr-2"
                      style={{ width: `${(item.completed / maxCompleted) * 100}%` }}
                    >
                      {item.completed > 0 && (
                        <span className="text-xs font-semibold text-white">{item.completed}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Spent Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Time Spent (minutes)</h4>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-xs text-gray-600 w-20">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-end pr-2"
                      style={{ width: `${(item.timeSpent / maxTimeSpent) * 100}%` }}
                    >
                      {item.timeSpent > 0 && (
                        <span className="text-xs font-semibold text-white">{item.timeSpent}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {data.reduce((sum, d) => sum + d.completed, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(data.reduce((sum, d) => sum + d.timeSpent, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Minutes</div>
        </div>
      </div>
    </div>
  )
}

export default ProgressChart
