
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

// Import the refactored components
import BrandingSection from '@/components/auth/BrandingSection';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import VerificationForm from '@/components/auth/VerificationForm';
import MobileHeader from '@/components/auth/MobileHeader';

type AuthMode = 'login' | 'register' | 'verify';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    town: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isVerified) {
      navigate('/categories');
    }
  }, [user, navigate]);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const handleRegisterSuccess = () => {
    setMode('verify');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <BrandingSection />
      
      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <MobileHeader />
          
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
                <LoginForm onSwitchToRegister={() => setMode('register')} />
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
                <RegisterForm 
                  onSwitchToLogin={() => setMode('login')} 
                  onRegisterSuccess={handleRegisterSuccess}
                />
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
                <VerificationForm 
                  onSwitchToRegister={() => setMode('register')}
                  phone={formData.phone}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
