import { useState, useEffect } from 'react'
import { Bookmark, StickyNote, Search, Plus, Trash2, Edit2, Save, X, Tag, Clock, Filter } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Note {
  id: string
  content: string
  timestamp: Date
  lessonId: string
  lessonTitle: string
  tags: string[]
  color: string
}

interface BookmarkItem {
  id: string
  lessonId: string
  lessonTitle: string
  timestamp: Date
  videoTime?: number
  note?: string
}

interface NotesBookmarksProps {
  courseId: string
  currentLessonId?: string
  currentLessonTitle?: string
  currentVideoTime?: number
}

const NotesBookmarks = ({
  courseId,
  currentLessonId = '',
  currentLessonTitle = '',
  currentVideoTime = 0
}: NotesBookmarksProps) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks'>('notes')
  const [notes, setNotes] = useState<Note[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string>('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({
    content: '',
    tags: [] as string[],
    color: 'yellow'
  })

  const noteColors = [
    { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900' },
    { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-900' },
    { name: 'green', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900' },
    { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-900' },
    { name: 'purple', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-900' },
  ]

  // Load from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${courseId}`)
    const savedBookmarks = localStorage.getItem(`bookmarks_${courseId}`)

    if (savedNotes) setNotes(JSON.parse(savedNotes))
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
  }, [courseId])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`notes_${courseId}`, JSON.stringify(notes))
  }, [notes, courseId])

  useEffect(() => {
    localStorage.setItem(`bookmarks_${courseId}`, JSON.stringify(bookmarks))
  }, [bookmarks, courseId])

  const handleAddNote = () => {
    if (!newNote.content.trim()) {
      toast.error('Note content cannot be empty')
      return
    }

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.content,
      timestamp: new Date(),
      lessonId: currentLessonId,
      lessonTitle: currentLessonTitle,
      tags: newNote.tags,
      color: newNote.color
    }

    setNotes([note, ...notes])
    setNewNote({ content: '', tags: [], color: 'yellow' })
    setIsAddingNote(false)
    toast.success('Note added!')
  }

  const handleUpdateNote = (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, ...newNote, timestamp: new Date() } : note
    )
    setNotes(updatedNotes)
    setEditingNoteId(null)
    setNewNote({ content: '', tags: [], color: 'yellow' })
    toast.success('Note updated!')
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
    toast.success('Note deleted!')
  }

  const handleAddBookmark = () => {
    const bookmark: BookmarkItem = {
      id: Date.now().toString(),
      lessonId: currentLessonId,
      lessonTitle: currentLessonTitle,
      timestamp: new Date(),
      videoTime: currentVideoTime,
      note: ''
    }

    setBookmarks([bookmark, ...bookmarks])
    toast.success('Bookmark added!')
  }

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId))
    toast.success('Bookmark removed!')
  }

  const handleAddTag = (tag: string) => {
    if (tag && !newNote.tags.includes(tag)) {
      setNewNote({ ...newNote, tags: [...newNote.tags, tag] })
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewNote({ ...newNote, tags: newNote.tags.filter(t => t !== tag) })
  }

  const getAllTags = () => {
    const tags = new Set<string>()
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags)
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !filterTag || note.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getColorClasses = (colorName: string) => {
    return noteColors.find(c => c.name === colorName) || noteColors[0]
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">My Learning Notes</h3>
          {activeTab === 'notes' ? (
            <button
              onClick={() => setIsAddingNote(true)}
              className="btn btn-primary btn-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          ) : (
            <button
              onClick={handleAddBookmark}
              className="btn btn-primary btn-sm flex items-center space-x-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmark This</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'notes'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <StickyNote className="w-4 h-4" />
              <span>Notes ({notes.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'bookmarks'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks ({bookmarks.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="input pl-10"
          />
        </div>

        {activeTab === 'notes' && getAllTags().length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <button
              onClick={() => setFilterTag('')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                !filterTag ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              All
            </button>
            {getAllTags().map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  filterTag === tag ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'notes' ? (
          <div className="space-y-3">
            {/* Add/Edit Note Form */}
            {(isAddingNote || editingNoteId) && (
              <div className={`border-2 rounded-lg p-4 ${getColorClasses(newNote.color).border} ${getColorClasses(newNote.color).bg}`}>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Write your note here..."
                  rows={4}
                  className="w-full p-2 bg-white/50 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />

                {/* Tags Input */}
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newNote.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/70 rounded-full text-sm flex items-center space-x-1">
                        <span>#{tag}</span>
                        <button onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tags (press Enter)..."
                    className="w-full p-2 bg-white/50 border border-gray-300 rounded text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTag(e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>

                {/* Color Picker */}
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Color:</span>
                  {noteColors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setNewNote({ ...newNote, color: color.name })}
                      className={`w-6 h-6 rounded-full ${color.bg} border-2 ${
                        newNote.color === color.name ? 'border-gray-900' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      setIsAddingNote(false)
                      setEditingNoteId(null)
                      setNewNote({ content: '', tags: [], color: 'yellow' })
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-white/50 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editingNoteId ? handleUpdateNote(editingNoteId) : handleAddNote()}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <StickyNote className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p>{searchQuery ? 'No notes found' : 'No notes yet. Start taking notes!'}</p>
              </div>
            ) : (
              filteredNotes.map(note => {
                const colorClasses = getColorClasses(note.color)
                return (
                  <div
                    key={note.id}
                    className={`border-2 rounded-lg p-4 ${colorClasses.border} ${colorClasses.bg} ${colorClasses.text}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap mb-2">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {note.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-white/50 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-xs opacity-70">
                          <span>{note.lessonTitle}</span>
                          <span>•</span>
                          <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => {
                            setEditingNoteId(note.id)
                            setNewNote({
                              content: note.content,
                              tags: note.tags,
                              color: note.color
                            })
                          }}
                          className="p-1 hover:bg-white/50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 hover:bg-white/50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p>{searchQuery ? 'No bookmarks found' : 'No bookmarks yet. Save important moments!'}</p>
              </div>
            ) : (
              filteredBookmarks.map(bookmark => (
                <div
                  key={bookmark.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bookmark className="w-4 h-4 text-primary-600" />
                        <h4 className="font-medium text-gray-900">{bookmark.lessonTitle}</h4>
                      </div>
                      {bookmark.videoTime !== undefined && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Video time: {formatTime(bookmark.videoTime)}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {new Date(bookmark.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {activeTab === 'notes' ? `${filteredNotes.length} of ${notes.length} notes` : `${filteredBookmarks.length} of ${bookmarks.length} bookmarks`}
          </span>
          <span>All data saved locally</span>
        </div>
      </div>
    </div>
  )
}

export default NotesBookmarks
