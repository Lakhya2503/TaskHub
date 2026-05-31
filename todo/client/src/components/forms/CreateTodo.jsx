import { Sparkles, Tag, X } from 'lucide-react'
import { useState } from 'react'

const CreateTodo = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    typeOfTodo: 'other'
  })
  const [loading, setLoading] = useState(false)

  const todoTypes = [
    { value: 'Personal', color: 'from-[#8338ec] to-[#3a86ff]', icon: '👤' },
    { value: 'Work', color: 'from-[#3a86ff] to-[#fb5607]', icon: '💼' },
    { value: 'Shopping', color: 'from-[#fb5607] to-[#ffbe0b]', icon: '🛒' },
    { value: 'Health', color: 'from-[#ff006e] to-[#fb5607]', icon: '❤️' },
    { value: 'Other', color: 'from-[#ffbe0b] to-[#ff006e]', icon: '✨' },
    { value: 'Education', color: 'from-[#20b2aa] to-[#48d1cc]', icon: '📚' },
    { value: 'Family', color: 'from-[#ff69b4] to-[#ff1493]', icon: '👨‍👩‍👧' },
    { value: 'Travel', color: 'from-[#2ecc71] to-[#27ae60]', icon: '✈️' },
    { value: 'Bills', color: 'from-[#e74c3c] to-[#c0392b]', icon: '💰' },
    { value: 'Fitness', color: 'from-[#3498db] to-[#2980b9]', icon: '💪' },
    { value: 'Meeting', color: 'from-[#9b59b6] to-[#8e44ad]', icon: '📅' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return
    }

    setLoading(true)
    try {
      await onCreate(formData)
      setFormData({ title: '', typeOfTodo: 'OTHER' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-md relative border border-white/20 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-full"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#ff006e] to-[#fb5607] rounded-xl mb-3 shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] bg-clip-text text-transparent">
            Create New Todo
          </h2>
          <p className="text-gray-600 text-sm mt-1">Add a new task to your list</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1.5">
              Todo Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#3a86ff] focus:bg-white transition-all duration-300 placeholder-gray-400"
              placeholder="What do you want to accomplish?"
              required
              autoFocus
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {todoTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, typeOfTodo: type.value })}
                  className={`relative py-2 rounded-lg border transition-all duration-300 ${
                    formData.typeOfTodo === type.value
                      ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-md scale-105`
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="text-lg">{type.icon}</div>
                  <div className="text-[10px] font-semibold mt-0.5">{type.value}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] hover:from-[#7028dc] hover:via-[#2a76ef] hover:to-[#eb4607] text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md flex items-center justify-center gap-1.5 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Todo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTodo
