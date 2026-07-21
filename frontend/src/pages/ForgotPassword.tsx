import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: { email: string }) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/forgot-password', { email: data.email });
      setSuccessMsg(res.data.message || 'Verification email sent successfully.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-1">
        Reset Password
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6">
        Enter your email to receive recovery instructions
      </p>

      {successMsg && (
        <div className="p-4 mb-4 rounded-lg bg-medical-emerald/10 text-medical-emerald text-xs font-semibold border border-medical-emerald/25 flex items-start gap-2.5">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Reset Request Placed</p>
            <p className="font-medium text-[11px] mt-0.5 leading-relaxed text-emerald-800 dark:text-emerald-400">{successMsg}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-medical-rose/10 text-medical-rose text-xs font-semibold border border-medical-rose/25">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                placeholder="name@example.com"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm bg-slate-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.email ? 'border-medical-rose ring-2 ring-medical-rose/10' : 'border-slate-200'}`}
              />
            </div>
            {errors.email && <span className="text-[10px] text-medical-rose font-bold mt-1 block">{errors.email.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 text-sm"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
            ) : (
              'Send Recovery Link'
            )}
          </button>
        </form>
      )}

      {/* Return to Login */}
      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300">
          <ArrowLeft size={12} />
          Back to Login
        </Link>
      </div>
    </div>
  );
};
