'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value.replace(/\D/g, '');
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      toast.success('Verification code resent!');
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

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

          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {!isVerified ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
                  Verify Your Email
                </h2>
                <p className="mt-2 text-gray-600">
                  Enter the 6-digit code sent to {email || 'your email address'}.
                </p>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Code Inputs */}
                <div className="flex gap-2 md:gap-3 justify-between">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-ovu-primary focus:ring-2 focus:ring-ovu-primary/20 transition-colors"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    {countdown > 0 ? (
                      <span className="text-gray-400">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-ovu-primary hover:underline font-medium"
                      >
                        Resend Code
                      </button>
                    )}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || code.join('').length !== 6}
                  className="w-full h-12 bg-ovu-primary text-white font-semibold rounded-lg hover:bg-ovu-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your account {email && <strong>{email}</strong>} has been verified. Redirecting you to the dashboard...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-ovu-primary" />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}


