import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles, Shield, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Login successful!');
        // Redirect to dashboard - data comes from database via cookies
        setLocation('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Magic link sent to your email!');
      } else {
        setError(data.error || 'Failed to send magic link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-brand-gradient opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-brand-blue/10 rounded-full float-animation" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-brand-pink/10 rounded-full float-animation" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-40 w-12 h-12 bg-brand-blue/10 rounded-full float-animation" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-40 right-40 w-14 h-14 bg-brand-pink/10 rounded-full float-animation" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover-lift">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4 hover-lift">
            <img src="/logo.png" alt="PromoHive" className="h-12 w-12 float-animation" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">PromoHive</h1>
              <p className="text-sm text-gray-600">Global Promo Network</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="card-interactive animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 float-animation">
              <Shield className="h-8 w-8 text-brand-blue" />
            </div>
            <CardTitle className="text-2xl font-display">Welcome Back</CardTitle>
            <CardDescription className="text-lg">
              Sign in to your account to continue earning
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 animate-slide-down" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-brand pl-10 focus-ring"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-brand pl-10 pr-10 focus-ring"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary btn-touch"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 btn-secondary btn-touch"
                onClick={handleMagicLink}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Magic Link
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-gradient hover:opacity-80 font-semibold transition-opacity">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center animate-fade-in">
          <div className="card-glass p-6">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-brand-pink mr-2" />
              <h3 className="font-semibold text-gray-900 font-display">New to PromoHive?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Create an account and start earning money by completing simple tasks
            </p>
            <Link href="/register">
              <Button variant="outline" size="sm" className="btn-touch hover-glow">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2 float-animation">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Instant Rewards</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2 float-animation" style={{ animationDelay: '1s' }}>
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Secure Platform</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2 float-animation" style={{ animationDelay: '2s' }}>
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Magic Links</p>
          </div>
        </div>
      </div>
    </div>
  );
}