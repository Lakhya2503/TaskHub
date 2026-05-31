import { Check, Edit2, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { completeTodoItem, createTodoItem, deleteTodoItem } from '../../api'

const Todo = ({ todo, onDelete, onUpdate, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemContext, setNewItemContext] = useState('')
  const [loading, setLoading] = useState(false)

  const typeColors = {
    PERSONAL: 'from-[#8338ec] to-[#3a86ff]',
    WORK: 'from-[#3a86ff] to-[#fb5607]',
    SHOPPING: 'from-[#fb5607] to-[#ffbe0b]',
    HEALTH: 'from-[#ff006e] to-[#fb5607]',
    OTHER: 'from-[#ffbe0b] to-[#ff006e]'
  }

  const typeIcons = {
    PERSONAL: '👤',
    WORK: '💼',
    SHOPPING: '🛒',
    HEALTH: '❤️',
    OTHER: '✨'
  }

  const handleUpdateTitle = async () => {
    if (!editTitle.trim() || editTitle === todo.title) {
      setIsEditing(false)
      return
    }

    await onUpdate(todo._id, { title: editTitle })
    setIsEditing(false)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()

    if (!newItemContext.trim()) return

    setLoading(true)
    try {
      await createTodoItem(todo._id, { context: newItemContext })
      toast.success('Todo item added')
      setNewItemContext('')
      setShowAddItem(false)
      onRefresh()
    } catch (error) {
      toast.error('Failed to add todo item')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteItem = async (itemId) => {
    try {
      await completeTodoItem(itemId)
      toast.success('Todo item completed')
      onRefresh()
    } catch (error) {
      toast.error('Failed to complete todo item')
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return

    try {
      await deleteTodoItem(itemId)
      toast.success('Todo item deleted')
      onRefresh()
    } catch (error) {
      toast.error('Failed to delete todo item')
    }
  }

  const completedCount = todo.todos?.filter(item => item.isComplete).length || 0
  const totalCount = todo.todos?.length || 0
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="group bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20 overflow-hidden">
      {/* Colored top bar */}
      <div className={`h-2 bg-gradient-to-r ${typeColors[todo.typeOfTodo] || typeColors.OTHER}`}></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border-2 border-[#3a86ff] rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3a86ff]/20"
                  autoFocus
                />
                <button
                  onClick={handleUpdateTitle}
                  className="p-2 bg-[#3a86ff] hover:bg-[#2a76ef] text-white rounded-lg transition-colors"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditTitle(todo.title)
                  }}
                  className="p-2 bg-[#ff006e] hover:bg-[#ef0060] text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#8338ec] transition-colors">
                  {todo.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${typeColors[todo.typeOfTodo] || typeColors.OTHER} text-white text-xs font-semibold rounded-full shadow-md`}>
                    <span>{typeIcons[todo.typeOfTodo] || typeIcons.OTHER}</span>
                    {todo.typeOfTodo}
                  </span>
                  {totalCount > 0 && (
                    <span className="text-xs text-gray-500 font-medium">
                      {completedCount}/{totalCount} completed
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-[#3a86ff] hover:bg-[#3a86ff]/10 rounded-lg transition-all duration-200"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(todo._id)}
                className="p-2 text-[#ff006e] hover:bg-[#ff006e]/10 rounded-lg transition-all duration-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${typeColors[todo.typeOfTodo] || typeColors.OTHER} transition-all duration-500 rounded-full`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Todo Items */}
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {todo.todos && todo.todos.length > 0 ? (
            todo.todos.map((item) => (
              <div
                key={item._id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                  item.isComplete
                    ? 'bg-[#3a86ff]/10 border border-[#3a86ff]/30'
                    : 'bg-gray-50 border border-gray-200 hover:border-[#3a86ff]/50'
                }`}
              >
                <span
                  className={`flex-1 text-sm ${
                    item.isComplete
                      ? 'line-through text-gray-500'
                      : 'text-gray-700 font-medium'
                  }`}
                >
                  {item.context}
                </span>
                <div className="flex gap-2 ml-3">
                  {!item.isComplete && (
                    <button
                      onClick={() => handleCompleteItem(item._id)}
                      className="p-1.5 text-[#3a86ff] hover:bg-[#3a86ff]/10 rounded-lg transition-all duration-200"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-1.5 text-[#ff006e] hover:bg-[#ff006e]/10 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">No items yet. Add your first task!</p>
          )}
        </div>

        {/* Add Item Form */}
        {showAddItem ? (
          <form onSubmit={handleAddItem} className="space-y-2">
            <input
              type="text"
              value={newItemContext}
              onChange={(e) => setNewItemContext(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 bg-gray-50 border-2 border-[#3a86ff] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a86ff]/20"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !newItemContext.trim()}
                className="flex-1 bg-gradient-to-r from-[#8338ec] to-[#3a86ff] hover:from-[#7028dc] hover:to-[#2a76ef] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus size={16} />
                    Add
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddItem(false)
                  setNewItemContext('')
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddItem(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffbe0b]/10 to-[#fb5607]/10 hover:from-[#ffbe0b]/20 hover:to-[#fb5607]/20 text-[#fb5607] font-semibold py-3 rounded-xl transition-all duration-300 border-2 border-dashed border-[#fb5607]/30 hover:border-[#fb5607]/50"
          >
            <Plus size={18} />
            Add New Item
          </button>
        )}
      </div>

      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none">
        <Sparkles className="w-full h-full text-[#ffbe0b]" />
      </div>
    </div>
  )
}

export default Todo
