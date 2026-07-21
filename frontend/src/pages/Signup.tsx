import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { UserPlus, User, Mail, Key, AlertCircle } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-1">
        Register Account
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6">
        Create an account to start analyzing medical documents
      </p>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-medical-rose/10 text-medical-rose text-xs font-semibold border border-medical-rose/25">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <User size={16} />
            </span>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              placeholder="John Doe"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm bg-slate-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.name ? 'border-medical-rose ring-2 ring-medical-rose/10' : 'border-slate-200'}`}
            />
          </div>
          {errors.name && <span className="text-[10px] text-medical-rose font-bold mt-1 block">{errors.name.message}</span>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail size={16} />
            </span>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
              })}
              placeholder="name@example.com"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm bg-slate-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.email ? 'border-medical-rose ring-2 ring-medical-rose/10' : 'border-slate-200'}`}
            />
          </div>
          {errors.email && <span className="text-[10px] text-medical-rose font-bold mt-1 block">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Key size={16} />
            </span>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="••••••••"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm bg-slate-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.password ? 'border-medical-rose ring-2 ring-medical-rose/10' : 'border-slate-200'}`}
            />
          </div>
          {errors.password && <span className="text-[10px] text-medical-rose font-bold mt-1 block">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Key size={16} />
            </span>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === watchPassword || 'Passwords do not match'
              })}
              placeholder="••••••••"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm bg-slate-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.confirmPassword ? 'border-medical-rose ring-2 ring-medical-rose/10' : 'border-slate-200'}`}
            />
          </div>
          {errors.confirmPassword && <span className="text-[10px] text-medical-rose font-bold mt-1 block">{errors.confirmPassword.message}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 text-sm"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
          ) : (
            <>
              <UserPlus size={16} />
              {t('signup')}
            </>
          )}
        </button>
      </form>

      {/* Redirect */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
