import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiGithub,
  FiArrowRight,
  FiSun,
  FiCloud
} from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { BiLogInCircle } from 'react-icons/bi'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { TbSunset, TbCloudRain } from 'react-icons/tb'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const result = await login(formData)

      if (result.success) {
        toast.success('Login successful!')
        navigate('/todos')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#8338ec]/20 via-[#3a86ff]/20 to-[#fb5607]/20 overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ffbe0b] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ff006e] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#3a86ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-1/4 w-60 h-60 bg-[#fb5607] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-reverse"></div>

        {/* Floating clouds */}
        <div className="absolute top-10 left-20 opacity-20 animate-float-cloud">
          <FiCloud className="w-24 h-24 text-[#3a86ff]" />
        </div>
        <div className="absolute bottom-20 right-32 opacity-15 animate-float-cloud-delay">
          <FiCloud className="w-32 h-32 text-[#8338ec]" />
        </div>

        {/* Sun rays */}
        <div className="absolute top-0 right-0 opacity-10">
          <FiSun className="w-64 h-64 text-[#ffbe0b]" />
        </div>
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-sm m-4 border border-white/50">
        {/* Decorative top bar */}


        {/* Logo/Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-[#8338ec] to-[#3a86ff] p-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <TbSunset className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] mb-1 text-center">
          Welcome Back!
        </h2>
        <p className="text-[#fb5607]/80 text-xs text-center mb-4">Glad to see you again ✨</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="group">
            <label htmlFor="email" className="block text-xs font-medium text-[#8338ec] mb-1">
              Email Address
            </label>
            <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.01]' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FiMail className={`h-3.5 w-3.5 transition-colors ${focusedField === 'email' ? 'text-[#3a86ff]' : 'text-[#8338ec]'}`} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-[#ffbe0b]/5 border border-[#ffbe0b]/30 rounded-lg text-gray-700 placeholder-[#fb5607]/40 focus:outline-none focus:border-[#3a86ff] focus:ring-1 focus:ring-[#3a86ff]/20 transition-all duration-300"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="group">
            <label htmlFor="password" className="block text-xs font-medium text-[#8338ec] mb-1">
              Password
            </label>
            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.01]' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FiLock className={`h-3.5 w-3.5 transition-colors ${focusedField === 'password' ? 'text-[#3a86ff]' : 'text-[#8338ec]'}`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-8 pr-8 py-1.5 text-sm bg-[#ffbe0b]/5 border border-[#ffbe0b]/30 rounded-lg text-gray-700 placeholder-[#fb5607]/40 focus:outline-none focus:border-[#3a86ff] focus:ring-1 focus:ring-[#3a86ff]/20 transition-all duration-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#8338ec] hover:text-[#ff006e] transition-colors"
              >
                {showPassword ? <FiEyeOff className="h-3.5 w-3.5" /> : <FiEye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3 h-3 text-[#3a86ff] bg-[#ffbe0b]/5 border-[#ffbe0b]/30 rounded focus:ring-[#3a86ff] focus:ring-1"
              />
              <span className="ml-1.5 text-xs text-[#8338ec] group-hover:text-[#ff006e] transition-colors">
                Remember me
              </span>
            </label>
            <Link to="/forgot-password" className="text-xs text-[#3a86ff] hover:text-[#8338ec] transition-colors flex items-center gap-0.5">
              Forgot password? <FiArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] hover:from-[#7028dc] hover:via-[#2a76ef] hover:to-[#eb4607] text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] shadow-md flex items-center justify-center gap-1.5 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                <BiLogInCircle className="h-3.5 w-3.5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#ffbe0b]/30"></div>
          </div>
        </div>



        <p className="text-[#8338ec] text-center mt-8 flex items-center justify-center gap-1 text-xs">
          Don't have an account?
          <Link to="/register" className="text-transparent bg-clip-text bg-gradient-to-r from-[#8338ec] to-[#ff006e] font-semibold hover:from-[#7028dc] hover:to-[#ef0060] transition-all duration-300 flex items-center gap-0.5 text-xs">
            Create account <FiArrowRight className="h-2.5 w-2.5" />
          </Link>
        </p>

        {/* Decorative elements */}
        <div className="absolute -bottom-3 -right-3 opacity-20">
          <TbCloudRain className="w-12 h-12 text-[#8338ec]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(15px) translateX(-15px); }
        }
        @keyframes float-cloud {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(20px); }
        }
        @keyframes float-cloud-delay {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 12s ease-in-out infinite; }
        .animate-float-cloud { animation: float-cloud 15s ease-in-out infinite; }
        .animate-float-cloud-delay { animation: float-cloud-delay 18s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default Login
