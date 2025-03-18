
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronLeft, Check } from 'lucide-react';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'register' | 'verify';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    town: '',
  });
  const { login, register, verifyPhone, user, loading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.isVerified) {
      navigate('/categories');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Success!",
        description: "You've successfully logged in.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      setMode('verify');
      toast({
        title: "Verification required",
        description: "Please verify your phone number to continue.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerificationChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`verification-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verification-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await verifyPhone(code);
      if (success) {
        toast({
          title: "Success!",
          description: "Your phone number has been verified.",
        });
        navigate('/categories');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-jamcart-red to-jamcart-red/80 p-12 flex-col justify-between text-white">
        <div>
          <AnimatedLogo size="md" className="mb-12" />
          <h1 className="text-4xl font-bold mb-4">Welcome to JAMCart</h1>
          <p className="text-white/90 text-lg mb-8">
            Your one-stop convenience hub for all your daily needs.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-4">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-white/80 text-sm">Get your items delivered in under an hour</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-4">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Multiple Categories</h3>
              <p className="text-white/80 text-sm">From groceries to bill payments, all in one app</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-4">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-white/80 text-sm">Pay securely with multiple payment options</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <AnimatedLogo size="md" className="mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-center mb-2">Welcome to JAMCart</h1>
            <p className="text-gray-600 text-center">
              Your one-stop convenience hub
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Sign In</h2>
                  <p className="text-gray-600">
                    Enter your details to access your account
                  </p>
                </div>
                
                <form onSubmit={handleLogin}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <ActionButton
                    variant="primary"
                    size="lg"
                    className="w-full mb-4"
                    loading={loading}
                    type="submit"
                  >
                    Sign In
                  </ActionButton>
                  
                  <p className="text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-jamcart-red font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              </motion.div>
            )}
            
            {mode === 'register' && (
              <motion.div
                key="register"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-8">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-gray-600">
                      Fill in your details to get started
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red pr-10"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red"
                      placeholder="+1 (234) 567-8901"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red"
                      placeholder="123 Main St, Apt 4"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
                      Closest Town
                    </label>
                    <input
                      type="text"
                      id="town"
                      name="town"
                      value={formData.town}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red"
                      placeholder="Kingston"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <ActionButton
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                    loading={loading}
                    type="submit"
                  >
                    Create Account
                  </ActionButton>
                  
                  <p className="text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-jamcart-red font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              </motion.div>
            )}
            
            {mode === 'verify' && (
              <motion.div
                key="verify"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-8">
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold">Verify Your Phone</h2>
                    <p className="text-gray-600">
                      We've sent a code to {formData.phone || 'your phone'}
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleVerifyCode}>
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter the 6-digit verification code
                    </label>
                    <div className="flex justify-center space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          id={`verification-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={verificationCode[index]}
                          onChange={(e) => handleVerificationChange(index, e.target.value)}
                          onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamcart-red focus:border-jamcart-red"
                          autoComplete="off"
                        />
                      ))}
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Didn't receive a code?{' '}
                      <button
                        type="button"
                        className="text-jamcart-red font-medium hover:underline"
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <ActionButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={loading}
                    type="submit"
                  >
                    Verify & Continue
                  </ActionButton>
                  
                  <p className="text-center text-gray-600 text-sm mt-4">
                    Note: For demo purposes, use code <strong>123456</strong> or <strong>000000</strong>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
