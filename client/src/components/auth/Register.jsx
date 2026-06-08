import { useState, useEffect } from 'react'
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
  FaCloudSun,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoadingRegister } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false
    }
  })

  // Real-time validation
  useEffect(() => {
    validateForm()
  }, [formData])

  const validateForm = () => {
    const errors = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters'
    } else if (formData.fullName.trim().length > 50) {
      errors.fullName = 'Full name must be less than 50 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    } else if (formData.password.length > 50) {
      errors.password = 'Password must be less than 50 characters'
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    setIsFormValid(Object.keys(errors).length === 0)
    return errors
  }

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    const score = Object.values(checks).filter(Boolean).length

    let message = ''
    if (score === 0 || score === 1) message = 'Very Weak'
    else if (score === 2) message = 'Weak'
    else if (score === 3) message = 'Fair'
    else if (score === 4) message = 'Good'
    else if (score === 5) message = 'Strong'

    setPasswordStrength({ score, message, checks })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Check password strength for password field
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = {
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    }
    setTouched(allTouched)

    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      // Show first error message
      const firstError = Object.values(errors)[0]
      toast.error(firstError)
      return
    }

    try {
      const submitData = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      }

      const result = await register(submitData)
      console.log(result)

      if (result.success) {
        toast.success('Registration successful! Please login to continue.', {
          icon: <FaCheckCircle className="text-green-500" />,
          position: "top-right",
          autoClose: 3000
        })

        // Navigate to login after short delay
        setTimeout(() => {
          navigate('/login', {
            state: { email: formData.email.toLowerCase().trim() }
          })
        }, 1500)
      } else {
        toast.error(result.error || 'Registration failed. Please try again.', {
          icon: <FaTimesCircle className="text-red-500" />
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  const getPasswordStrengthColor = () => {
    const score = passwordStrength.score
    if (score <= 1) return 'bg-red-500'
    if (score === 2) return 'bg-orange-500'
    if (score === 3) return 'bg-yellow-500'
    if (score === 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getFieldError = (field) => {
    return touched[field] && validationErrors[field]
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
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md border border-white/50 transition-all duration-300 hover:shadow-2xl">
        {/* Header with Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff006e] to-[#fb5607] rounded-2xl mb-3 shadow-md transform transition-transform hover:scale-105">
            <FaCloudSun className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm mt-1">Join our vibrant community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div className="group">
            <label htmlFor="fullName" className="block text-xs font-medium text-[#8338ec] mb-1">
              Full Name <span className="text-[#ff006e]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaUser className={`text-sm transition-colors ${getFieldError('fullName') ? 'text-red-500' : 'text-[#8338ec] group-focus-within:text-[#3a86ff]'}`} />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur('fullName')}
                className={`w-full pl-8 pr-3 py-2 bg-[#ffbe0b]/5 border rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                  getFieldError('fullName')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#ffbe0b]/30 focus:ring-[#3a86ff] focus:border-transparent'
                }`}
                placeholder="John Doe"
                disabled={isLoadingRegister}
              />
            </div>
            {getFieldError('fullName') && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.fullName}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="group">
            <label htmlFor="email" className="block text-xs font-medium text-[#8338ec] mb-1">
              Email Address <span className="text-[#ff006e]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaEnvelope className={`text-sm transition-colors ${getFieldError('email') ? 'text-red-500' : 'text-[#8338ec] group-focus-within:text-[#3a86ff]'}`} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`w-full pl-8 pr-3 py-2 bg-[#ffbe0b]/5 border rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                  getFieldError('email')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#ffbe0b]/30 focus:ring-[#3a86ff] focus:border-transparent'
                }`}
                placeholder="john@example.com"
                disabled={isLoadingRegister}
              />
            </div>
            {getFieldError('email') && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="group">
            <label htmlFor="password" className="block text-xs font-medium text-[#8338ec] mb-1">
              Password <span className="text-[#ff006e]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaLock className={`text-sm transition-colors ${getFieldError('password') ? 'text-red-500' : 'text-[#8338ec] group-focus-within:text-[#3a86ff]'}`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-8 pr-8 py-2 bg-[#ffbe0b]/5 border rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                  getFieldError('password')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#ffbe0b]/30 focus:ring-[#3a86ff] focus:border-transparent'
                }`}
                placeholder="••••••••"
                disabled={isLoadingRegister}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-[#ff006e] transition-colors"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Password Strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.score <= 1 ? 'text-red-500' :
                    passwordStrength.score === 2 ? 'text-orange-500' :
                    passwordStrength.score === 3 ? 'text-yellow-500' :
                    passwordStrength.score === 4 ? 'text-blue-500' :
                    'text-green-500'
                  }`}>
                    {passwordStrength.message}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        level <= passwordStrength.score ? getPasswordStrengthColor() : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-500">
                  <span className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : ''}`}>
                    {passwordStrength.checks.length ? <FaCheckCircle className="text-green-500 text-xs" /> : <FaTimesCircle className="text-gray-400 text-xs" />}
                    Min 8 characters
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : ''}`}>
                    {passwordStrength.checks.uppercase ? <FaCheckCircle className="text-green-500 text-xs" /> : <FaTimesCircle className="text-gray-400 text-xs" />}
                    Uppercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : ''}`}>
                    {passwordStrength.checks.lowercase ? <FaCheckCircle className="text-green-500 text-xs" /> : <FaTimesCircle className="text-gray-400 text-xs" />}
                    Lowercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-600' : ''}`}>
                    {passwordStrength.checks.number ? <FaCheckCircle className="text-green-500 text-xs" /> : <FaTimesCircle className="text-gray-400 text-xs" />}
                    Number
                  </span>
                  <span className={`col-span-2 flex items-center gap-1 ${passwordStrength.checks.specialChar ? 'text-green-600' : ''}`}>
                    {passwordStrength.checks.specialChar ? <FaCheckCircle className="text-green-500 text-xs" /> : <FaTimesCircle className="text-gray-400 text-xs" />}
                    Special character
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="group">
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#8338ec] mb-1">
              Confirm Password <span className="text-[#ff006e]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaLock className={`text-sm transition-colors ${getFieldError('confirmPassword') ? 'text-red-500' : 'text-[#8338ec] group-focus-within:text-[#3a86ff]'}`} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full pl-8 pr-8 py-2 bg-[#ffbe0b]/5 border rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                  getFieldError('confirmPassword')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#ffbe0b]/30 focus:ring-[#3a86ff] focus:border-transparent'
                }`}
                placeholder="••••••••"
                disabled={isLoadingRegister}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-[#ff006e] transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            {getFieldError('confirmPassword') && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoadingRegister || !isFormValid}
            className="w-full bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#fb5607] hover:from-[#7028dc] hover:via-[#2a76ef] hover:to-[#eb4607] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 text-sm mt-6"
          >
            {isLoadingRegister ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                <FaUserPlus className="w-3.5 h-3.5" />
                Register Now
                <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Terms & Conditions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our{' '}
            <Link to="/terms" className="text-[#3a86ff] hover:text-[#8338ec] transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#3a86ff] hover:text-[#8338ec] transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>

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
