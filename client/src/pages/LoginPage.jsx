import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '../utils/validators';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register: signUp } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = isRegister ? registerSchema : loginSchema;
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(data);
        toast.success('Account created! Welcome to Celtics City.');
      } else {
        await login(data.email, data.password);
        toast.success('Welcome back, Celt!');
      }
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-black">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto px-4">
        <div className="bg-card rounded-2xl p-8 border border-white/5">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green flex items-center justify-center mx-auto mb-4"><span className="text-black font-display text-2xl font-bold">N</span></div>
            <h1 className="text-2xl font-display text-white">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-sm text-gray-400 mt-1">{isRegister ? 'Join the Celt Family' : 'Sign in to your account'}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input {...formRegister('firstName')} placeholder="First Name" className="w-full" />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <input {...formRegister('lastName')} placeholder="Last Name" className="w-full" />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
            )}
            <div>
              <input type="email" {...formRegister('email')} placeholder="Email Address" className="w-full" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            {isRegister && (
              <>
                <div>
                  <input {...formRegister('phone')} placeholder="Phone (+254XXXXXXXXX)" className="w-full" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <input {...formRegister('idNumber')} placeholder="National ID Number" className="w-full" />
                  {errors.idNumber && <p className="text-red-400 text-xs mt-1">{errors.idNumber.message}</p>}
                </div>
              </>
            )}
            <div>
              <input type="password" {...formRegister('password')} placeholder="Password" className="w-full" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            {isRegister && (
              <div>
                <input type="password" {...formRegister('confirmPassword')} placeholder="Confirm Password" className="w-full" />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            )}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-gray-400 hover:text-green transition-colors">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
