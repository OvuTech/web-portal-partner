'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/lib/api/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    businessType: '',
    password: '',
    confirmPassword: '',
    website: '',
    taxId: '',
    businessDescription: '',
    expectedMonthlyVolume: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone || !formData.companyName || !formData.businessType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company_name: formData.companyName,
        business_type: formData.businessType,
        website: formData.website || undefined,
        tax_id: formData.taxId || undefined,
        business_description: formData.businessDescription || undefined,
        expected_monthly_volume: formData.expectedMonthlyVolume ? parseInt(formData.expectedMonthlyVolume) : undefined,
      });
      toast.success('Registration successful! Please check your email to verify your account.');
      // Redirect to verification page with email
      router.push(`/verify?email=${encodeURIComponent(response.email)}`);
    } catch (error: any) {
      // Handle pydantic validation errors (comes as array)
      const detail = error.response?.data?.detail;
      let message = 'Registration failed. Please try again.';
      
      if (Array.isArray(detail)) {
        message = detail.map((d: any) => d.msg).join(', ');
      } else if (typeof detail === 'string') {
        message = detail;
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
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

          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">Create Partner Account</h2>
            <p className="mt-2 text-gray-600">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  className="w-full h-12"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  className="w-full h-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Company Name *</Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter your company name"
                className="w-full h-12"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">Business Type *</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                disabled={isLoading}
                required
              >
                <SelectTrigger id="businessType" className="w-full h-12">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel_agency">Travel Agency</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full h-12"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 800 000 0000"
                className="w-full h-12"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                className="w-full h-12"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">Tax ID</Label>
              <Input
                id="taxId"
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="Enter your tax ID (optional)"
                className="w-full h-12"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                placeholder="Describe your business (optional)"
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-ovu-primary focus:ring-2 focus:ring-ovu-primary/20 resize-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="expectedMonthlyVolume" className="block text-sm font-medium text-gray-700 mb-2">Expected Monthly Volume</Label>
              <Input
                id="expectedMonthlyVolume"
                type="number"
                value={formData.expectedMonthlyVolume}
                onChange={(e) => setFormData({ ...formData, expectedMonthlyVolume: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full h-12"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password * (min 8 characters)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  className="w-full h-12 pr-12"
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className="w-full h-12"
                disabled={isLoading}
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-ovu-primary focus:ring-ovu-primary" />
              <span className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-ovu-primary hover:underline">Terms of Service</a> and <a href="#" className="text-ovu-primary hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-ovu-primary text-white font-semibold rounded-lg hover:bg-ovu-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-ovu-primary hover:text-ovu-secondary">
                Sign in
              </Link>
            </p>
          </form>
      </div>
    </div>
  );
}
