
import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    town: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      onRegisterSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={onSwitchToLogin}
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
            onClick={onSwitchToLogin}
            className="text-jamcart-red font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
