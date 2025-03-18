
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface VerificationFormProps {
  onSwitchToRegister: () => void;
  phone: string;
}

const VerificationForm = ({ onSwitchToRegister, phone }: VerificationFormProps) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const { verifyPhone, loading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-gray-500 hover:text-gray-700 mr-2"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Verify Your Phone</h2>
          <p className="text-gray-600">
            We've sent a code to {phone || 'your phone'}
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
    </div>
  );
};

export default VerificationForm;
