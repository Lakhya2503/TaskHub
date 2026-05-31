import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaCloudSun
} from 'react-icons/fa'

const Register = () => {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      const submitData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      }

      const result = await register(submitData)

      if (result.success) {
        toast.success('Registration successful! Please login.')
        navigate('/login')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#8338ec]/20 via-[#3a86ff]/20 to-[#fb5607]/20 py-4 px-4 relative overflow-auto">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ffbe0b] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#ff006e] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#3a86ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-sm border border-white/50">
        {/* Header with Icon */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff006e] to-[#fb5607] rounded-2xl mb-3 shadow-md transform transition-transform hover:scale-105">
            <FaCloudSun className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm mt-1">Join our vibrant community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name Field */}
          <div className="group">
            <label htmlFor="fullName" className="block text-xs font-medium text-[#8338ec] mb-1">
              Full Name <span className="text-[#ff006e]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaUser className="text-[#8338ec] group-focus-within:text-[#3a86ff] transition-colors text-sm" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 bg-[#ffbe0b]/5 border border-[#ffbe0b]/30 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a86ff] focus:border-transparent transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="group">
            <label htmlFor="email" className="block text-xs font-medium text-[#8338ec] mb-1">
              Email Address <span className="text-[#ff006e]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaEnvelope className="text-[#8338ec] group-focus-within:text-[#3a86ff] transition-colors text-sm" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 bg-[#ffbe0b]/5 border border-[#ffbe0b]/30 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a86ff] focus:border-transparent transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="group">
            <label htmlFor="password" className="block text-xs font-medium text-[#8338ec] mb-1">
              Password <span className="text-[#ff006e]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaLock className="text-[#8338ec] group-focus-within:text-[#3a86ff] transition-colors text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-8 pr-8 py-2 bg-[#ffbe0b]/5 border border-[#ffbe0b]/30 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a86ff] focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-[#ff006e] transition-colors"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] hover:from-[#7028dc] hover:via-[#2a76ef] hover:to-[#eb4607] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 text-sm mt-4"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                Register Now
                <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 pt-4 border-t border-[#ffbe0b]/30">
          <p className="text-gray-600 text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-transparent bg-gradient-to-r from-[#8338ec] to-[#ff006e] bg-clip-text font-semibold hover:from-[#7028dc] hover:to-[#ef0060] transition-all text-sm"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
