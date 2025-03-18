
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const { toast } = useToast();

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

  return (
    <div>
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
            onClick={onSwitchToRegister}
            className="text-jamcart-red font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
