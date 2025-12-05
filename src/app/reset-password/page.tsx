'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/lib/api/auth';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No reset token provided. Please use the link from your email.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token. Please use the link from your email.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setIsSuccess(true);
      toast.success('Password reset successfully');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message || 'Failed to reset password. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/bg.jpg)' }}
      >
        {/* Logo - Top Left */}
        <div className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-2">
          <Image src="/bird.png" alt="OVU Logo" width={35} height={30} className="h-8 w-auto" />
          <span className="text-2xl font-bold text-gray-900 tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>OVU</span>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 md:p-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h2>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full h-12 bg-ovu-primary text-white font-semibold rounded-lg hover:bg-ovu-secondary transition-colors cursor-pointer"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/bg.jpg)' }}
    >
      {/* Logo - Top Left */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-2">
        <Image src="/bird.png" alt="OVU Logo" width={35} height={30} className="h-8 w-auto" />
        <span className="text-2xl font-bold text-gray-900 tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>OVU</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
            Reset Password
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-ovu-primary focus:ring-2 focus:ring-ovu-primary/20 transition-colors"
                disabled={isLoading || !token}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-ovu-primary focus:ring-2 focus:ring-ovu-primary/20 transition-colors"
                disabled={isLoading || !token}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full h-12 bg-ovu-primary text-white font-semibold rounded-lg hover:bg-ovu-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Back to Sign In Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-ovu-primary hover:text-ovu-secondary"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ovu-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}


