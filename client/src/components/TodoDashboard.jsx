import { LogOut, Plus, Sparkles, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
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

  useEffect(() => {
    loadTodos()
  }, [])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8338ec] via-[#3a86ff] to-[#fb5607] p-4 md:p-6">
      {/* Animated background - all 5 colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ffbe0b] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#ff006e] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#3a86ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-[#fb5607] rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-blob animation-delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative max-w-7xl mx-auto mb-8">
        <div className="bg-white/95 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8338ec] to-[#3a86ff] rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] bg-clip-text text-transparent">
                  My Todos
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8338ec]" />
                  {user?.fullName || 'User'}
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
            </div>
          </div>
        </div>
      </div>

      {/* Todos Grid */}
      <div className="relative max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-white/30 border-t-[#ffbe0b] rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading your todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ffbe0b] to-[#fb5607] rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No todos yet!</h3>
            <p className="text-gray-600 mb-6">Start your productivity journey by creating your first todo</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8338ec] to-[#3a86ff] hover:from-[#7028dc] hover:to-[#2a76ef] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Your First Todo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todos.map((todo) => (
              <Todo
                key={todo._id}
                todo={todo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
                onRefresh={loadTodos}
              />
            ))}
          </div>
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
        .animate-blob {
          animation: blob 7s infinite;
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
      `}</style>
    </div>
  )
}

export default TodoDashboard
