import { LogOut, Plus, Sparkles, User, Search, Filter, Calendar, CheckCircle, Circle, Trash2, Edit2, X, SortAsc, SortDesc, Clock, Home } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createTodo, deleteTodo, fetchTodos, updateTodoName } from '../api'
import { useAuth } from '../context/AuthContext'
import Todo from './card/Todo'
import CreateTodo from './forms/CreateTodo'

const TodoDashboard = () => {
  const { user, logout } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, completed, pending
  const [sortBy, setSortBy] = useState('date') // date, name, status
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc
  const [selectedTodos, setSelectedTodos] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  })

  const navigate = useNavigate()

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [todos])

  const calculateStats = () => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    setStats({ total, completed, pending, completionRate })
  }

  const loadTodos = async () => {
    setLoading(true)
    try {
      const response = await fetchTodos()
      setTodos(response?.data?.data || [])
    } catch (error) {
      toast.error('Failed to load todos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleHome = () => {
    navigate("/")
  }

  const handleCreateTodo = async (todoData) => {
    try {
      await createTodo(todoData)
      toast.success('Todo created successfully')
      setShowCreateModal(false)
      loadTodos()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create todo')
    }
  }

  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return

    try {
      await deleteTodo(todoId)
      toast.success('Todo deleted successfully')
      loadTodos()
      setSelectedTodos(selectedTodos.filter(id => id !== todoId))
    } catch (error) {
      toast.error('Failed to delete todo')
    }
  }

  const handleUpdateTodo = async (todoId, data) => {
    try {
      await updateTodoName(todoId, data)
      toast.success('Todo updated successfully')
      loadTodos()
    } catch (error) {
      toast.error('Failed to update todo')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const handleSelectTodo = (todoId) => {
    setSelectedTodos(prev => {
      if (prev.includes(todoId)) {
        return prev.filter(id => id !== todoId)
      } else {
        return [...prev, todoId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedTodos.length === filteredTodos.length) {
      setSelectedTodos([])
    } else {
      setSelectedTodos(filteredTodos.map(todo => todo._id))
    }
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTodos.length} todos?`)) return

    try {
      await Promise.all(selectedTodos.map(id => deleteTodo(id)))
      toast.success(`${selectedTodos.length} todos deleted successfully`)
      setSelectedTodos([])
      loadTodos()
    } catch (error) {
      toast.error('Failed to delete some todos')
    }
  }

  const handleBulkStatusUpdate = async (completed) => {
    try {
      await Promise.all(selectedTodos.map(id => updateTodoName(id, { completed })))
      toast.success(`${selectedTodos.length} todos updated successfully`)
      setSelectedTodos([])
      loadTodos()
    } catch (error) {
      toast.error('Failed to update todos')
    }
  }

  const filteredTodos = useMemo(() => {
    let filtered = [...todos]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed)
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(todo => !todo.completed)
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt)
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'status') {
        comparison = (a.completed ? 1 : 0) - (b.completed ? 1 : 0)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [todos, searchTerm, filterStatus, sortBy, sortOrder])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8338ec] via-[#3a86ff] to-[#fb5607] p-4 md:p-6">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ffbe0b] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#ff006e] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#3a86ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-[#fb5607] rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-blob animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#ffbe0b] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-3000"></div>
      </div>

      {/* Header */}
      <div className="relative max-w-7xl mx-auto mb-8">
        <div className="bg-white/95 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8338ec] to-[#3a86ff] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] bg-clip-text text-transparent">
                  My Todos
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8338ec]" />
                  {getGreeting()}, {user?.fullName || 'User'}!
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#ff006e] via-[#fb5607] to-[#ffbe0b] hover:from-[#ef0060] hover:via-[#eb4607] hover:to-[#efae00] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New Todo
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/50 hover:bg-white/70 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              <button
                  onClick={handleHome}
                  className="flex items-center gap-2 bg-white/50 hover:bg-white/70 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-200"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#8338ec] to-[#3a86ff] rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Circle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff006e] to-[#ffbe0b] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="relative max-w-7xl mx-auto mb-6">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search todos by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 rounded-xl border border-gray-200 focus:border-[#8338ec] focus:outline-none focus:ring-2 focus:ring-[#8338ec]/20 transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-white/50 rounded-xl border border-gray-200 focus:border-[#8338ec] focus:outline-none focus:ring-2 focus:ring-[#8338ec]/20 transition-all cursor-pointer"
                >
                  <option value="all">All Tasks</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-')
                    setSortBy(newSortBy)
                    setSortOrder(newSortOrder)
                  }}
                  className="appearance-none pl-4 pr-10 py-2 bg-white/50 rounded-xl border border-gray-200 focus:border-[#8338ec] focus:outline-none focus:ring-2 focus:ring-[#8338ec]/20 transition-all cursor-pointer"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="status-asc">Pending First</option>
                  <option value="status-desc">Completed First</option>
                </select>
                {sortOrder === 'asc' ? <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> : <SortDesc className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterStatus !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#8338ec]/10 rounded-lg text-sm">
                  Search: {searchTerm}
                  <X onClick={() => setSearchTerm('')} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#8338ec]/10 rounded-lg text-sm">
                  Status: {filterStatus === 'completed' ? 'Completed' : 'Pending'}
                  <X onClick={() => setFilterStatus('all')} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedTodos.length > 0 && (
        <div className="relative max-w-7xl mx-auto mb-6 animate-slideDown">
          <div className="bg-gradient-to-r from-[#8338ec] to-[#3a86ff] backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">{selectedTodos.length} tasks selected</span>
                <button
                  onClick={handleSelectAll}
                  className="text-white/80 hover:text-white text-sm underline"
                >
                  {selectedTodos.length === filteredTodos.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all"
                >
                  <Clock className="w-4 h-4" />
                  Mark Pending
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Todos Grid */}
      <div className="relative max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-white/30 border-t-[#ffbe0b] rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading your todos...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ffbe0b] to-[#fb5607] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No matching todos found!' : 'No todos yet!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'Start your productivity journey by creating your first todo'}
            </p>
            {(searchTerm || filterStatus !== 'all') ? (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8338ec] to-[#3a86ff] hover:from-[#7028dc] hover:to-[#2a76ef] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8338ec] to-[#3a86ff] hover:from-[#7028dc] hover:to-[#2a76ef] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Your First Todo
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-right text-white/80 text-sm">
              Showing {filteredTodos.length} of {todos.length} todos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTodos.map((todo) => (
                <div key={todo._id} className="relative group">
                  {showBulkActions && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedTodos.includes(todo._id)}
                        onChange={() => handleSelectTodo(todo._id)}
                        className="w-5 h-5 rounded border-gray-300 text-[#8338ec] focus:ring-[#8338ec] cursor-pointer"
                      />
                    </div>
                  )}
                  <Todo
                    todo={todo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                    onRefresh={loadTodos}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Todo Modal */}
      {showCreateModal && (
        <CreateTodo
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTodo}
        />
      )}

      <Outlet />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}

export default TodoDashboard
