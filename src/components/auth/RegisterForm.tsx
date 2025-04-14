
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from './registerFormSchema';
import AccountInfoFields from './AccountInfoFields';
import PaymentInfoFields from './PaymentInfoFields';
import { z } from "zod";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

type FormValues = z.infer<typeof registerSchema>;

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) => {
  const { register: registerUser, loading, error } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      town: '',
      userType: 'customer',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const userType = form.watch('userType');

  const handleSubmit = async (values: FormValues) => {
    try {
      // Only process card info for customers
      const formattedCard = userType === 'customer' ? {
        cardNumber: values.cardNumber,
        cardName: values.cardName,
        expiryDate: values.expiryDate,
        cvv: values.cvv
      } : undefined;
      
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        town: values.town,
        userType: values.userType,
        cardInfo: formattedCard
      });
      
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <AccountInfoFields form={form} />
          
          {/* Only show payment info for customers */}
          {userType === 'customer' && <PaymentInfoFields form={form} />}
          
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
      </Form>
    </div>
  );
};

export default RegisterForm;
