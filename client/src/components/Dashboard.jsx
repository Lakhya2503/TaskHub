import { CheckSquare, Sparkles, Star, Zap } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8338ec] via-[#3a86ff] to-[#fb5607] relative overflow-hidden">
      {/* Animated background blobs - all 5 colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ffbe0b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#ff006e] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#3a86ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-[#fb5607] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl mb-8 shadow-2xl border border-white/30">
          <CheckSquare className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
          Todo<span className="text-[#ffbe0b]">Flow</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
          Organize your life with vibrant productivity
        </p>
        <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
          Experience task management reimagined with beautiful colors, smooth animations, and intuitive design
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <Sparkles className="w-10 h-10 text-[#ffbe0b] mb-4 mx-auto" />
            <h3 className="text-white font-bold text-lg mb-2">Beautiful Design</h3>
            <p className="text-white/70 text-sm">Vibrant colors that inspire creativity</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <Zap className="w-10 h-10 text-[#ff006e] mb-4 mx-auto" />
            <h3 className="text-white font-bold text-lg mb-2">Lightning Fast</h3>
            <p className="text-white/70 text-sm">Smooth performance, instant updates</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <Star className="w-10 h-10 text-[#ffbe0b] mb-4 mx-auto" />
            <h3 className="text-white font-bold text-lg mb-2">Stay Organized</h3>
            <p className="text-white/70 text-sm">Manage tasks with ease and style</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/register')}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#ff006e] via-[#fb5607] to-[#ffbe0b] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5" />
            Get Started Free
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/80">
          <div>
            <div className="text-3xl font-bold text-white">10K+</div>
            <div className="text-sm">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-sm">Tasks Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">99%</div>
            <div className="text-sm">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#ffbe0b]/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#ff006e]/30 rounded-full blur-xl animate-pulse animation-delay-2000"></div>

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

export default Dashboard
