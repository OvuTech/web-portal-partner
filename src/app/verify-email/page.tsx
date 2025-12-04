'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/lib/api/auth';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('No verification token provided');
        setIsLoading(false);
        return;
      }

      console.log('[Verify Email Page] Token from URL:', token);
      console.log('[Verify Email Page] Full URL:', window.location.href);

      try {
        // Try the Next.js proxy route (try simpler path first, then fallback to v1 path)
        let response;
        
        // First try the simpler path
        response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        
        // If simpler path returns 404, try the v1 path
        if (response.status === 404) {
          console.log('[Verify Email Page] Simple path not found, trying v1 path');
          response = await fetch('/api/v1/partners/auth/verify-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
        }
        
        // If both routes return 404, the route isn't deployed
        if (response.status === 404) {
          console.error('[Verify Email Page] Proxy route not found (404). The API route needs to be deployed.');
          setError('Verification service is temporarily unavailable. Please contact support or try again later.');
          setIsLoading(false);
          return;
        }

        console.log('[Verify Email Page] Response status:', response.status);

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Response is not JSON (likely HTML error page)
          const text = await response.text();
          console.error('Non-JSON response:', text.substring(0, 200));
          setError('Verification endpoint returned an error. Please contact support.');
          setIsLoading(false);
          return;
        }

        console.log('[Verify Email Page] Response data:', data);

        if (!response.ok) {
          const errorMessage = data.detail || data.message || 'Verification failed';
          console.error('[Verify Email Page] Verification failed:', errorMessage);
          setError(errorMessage);
          setIsLoading(false);
          return;
        }

        setIsVerified(true);
        toast.success('Email verified successfully!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error: any) {
        setError('Failed to verify email. Please try again.');
        toast.error('Verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

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

        {isLoading ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Email</h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        ) : isVerified ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been verified successfully. Redirecting you to login...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-ovu-primary" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {error || 'The verification link is invalid or has expired. Please request a new verification email.'}
            </p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="inline-block w-full h-12 bg-ovu-primary text-white font-semibold rounded-lg hover:bg-ovu-secondary transition-colors flex items-center justify-center cursor-pointer"
              >
                Go to Login
              </Link>
              <Link
                href="/register"
                className="inline-block w-full h-12 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer"
              >
                Register Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ovu-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

