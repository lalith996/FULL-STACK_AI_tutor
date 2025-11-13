import { useState } from 'react'
import { Play, RotateCcw, Copy, Check, Download, Maximize2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CodePlaygroundProps {
  initialCode?: string
  language?: 'javascript' | 'python' | 'html'
  readOnly?: boolean
}

const CodePlayground = ({
  initialCode = '// Write your code here\nconsole.log("Hello, World!");',
  language = 'javascript',
  readOnly = false
}: CodePlaygroundProps) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const runCode = () => {
    setIsRunning(true)
    setOutput([])

    try {
      // Capture console.log outputs
      const logs: string[] = []
      const originalLog = console.log

      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '))
        originalLog(...args)
      }

      // Execute code in a safe way
      if (language === 'javascript') {
        // Create a function to run the code in isolation
        const result = new Function(code)()
        if (result !== undefined) {
          logs.push(`→ ${result}`)
        }
      } else if (language === 'python') {
        logs.push('Python execution requires backend integration')
      } else if (language === 'html') {
        logs.push('HTML preview below')
      }

      // Restore console.log
      console.log = originalLog

      setOutput(logs.length > 0 ? logs : ['Code executed successfully (no output)'])
      toast.success('Code executed!')
    } catch (error: any) {
      setOutput([`❌ Error: ${error.message}`])
      toast.error('Execution error!')
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput([])
    toast.success('Code reset!')
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const downloadCode = () => {
    const extension = language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'html'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-sm font-mono uppercase">{language}</span>
        </div>
        <div className="flex items-center space-x-2">
          {!readOnly && (
            <>
              <button
                onClick={resetCode}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                title="Reset code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={copyCode}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={downloadCode}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                title="Download code"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-x divide-gray-200">
        {/* Code Editor */}
        <div className="relative">
          <div className="absolute top-2 left-2 text-xs text-gray-500 font-mono">Editor</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={readOnly}
            className="w-full h-96 p-4 pt-8 font-mono text-sm bg-gray-50 border-0 focus:outline-none focus:ring-0 resize-none"
            spellCheck={false}
            style={{
              tabSize: 2,
              fontFamily: "'Fira Code', 'Courier New', monospace"
            }}
          />
        </div>

        {/* Output */}
        <div className="relative bg-gray-900">
          <div className="absolute top-2 left-2 text-xs text-gray-400 font-mono">Output</div>
          <div className="h-96 p-4 pt-8 overflow-y-auto">
            {output.length === 0 ? (
              <div className="text-gray-500 text-sm font-mono">
                Run your code to see the output...
              </div>
            ) : (
              <div className="space-y-1">
                {output.map((line, index) => (
                  <div
                    key={index}
                    className={`font-mono text-sm ${
                      line.startsWith('❌') ? 'text-red-400' :
                      line.startsWith('→') ? 'text-green-400' :
                      'text-gray-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd> to run
          </div>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* HTML Preview (if language is HTML) */}
      {language === 'html' && (
        <div className="border-t border-gray-200 p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
          <iframe
            srcDoc={code}
            title="HTML Preview"
            className="w-full h-64 border border-gray-300 rounded bg-white"
            sandbox="allow-scripts"
          />
        </div>
      )}
    </div>
  )
}

export default CodePlayground
