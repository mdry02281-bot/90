import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Sparkles, Zap, Shield } from 'lucide-react';

export default function NotFound() {
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
          <div className="flex items-center justify-center space-x-3 mb-4 hover-lift">
            <img src="/logo.png" alt="PromoHive" className="h-12 w-12 float-animation" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">PromoHive</h1>
              <p className="text-sm text-gray-600">Global Promo Network</p>
            </div>
          </div>
        </div>

        {/* 404 Card */}
        <Card className="card-interactive animate-scale-in">
          <CardHeader className="text-center">
            <div className="relative mb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center float-animation">
                <Search className="h-10 w-10 text-red-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-pink/20 rounded-full float-animation" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-brand-blue/20 rounded-full float-animation" style={{ animationDelay: '1s' }} />
            </div>
            <CardTitle className="text-5xl font-bold text-gradient font-display animate-bounce-in">404</CardTitle>
            <CardDescription className="text-xl animate-slide-up">
              Page Not Found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Oops! The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best explorers sometimes take a wrong turn!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-bounce-in" style={{ animationDelay: '0.4s' }}>
              <Link href="/">
                <Button className="w-full sm:w-auto btn-primary btn-touch hover-lift">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto btn-secondary btn-touch hover-lift"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fun Elements */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2 float-animation">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Search</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2 float-animation" style={{ animationDelay: '1s' }}>
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Explore</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2 float-animation" style={{ animationDelay: '2s' }}>
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Discover</p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="card-glass p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center font-display">
              <Shield className="h-5 w-5 mr-2 text-brand-blue" />
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              If you think this is an error, please contact our support team.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full btn-touch hover-glow">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm" className="w-full btn-touch hover-glow">
                  Register
                </Button>
              </Link>
              <Link href="/dashboard" className="text-gradient hover:opacity-80 transition-opacity text-sm text-center">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-gradient hover:opacity-80 transition-opacity text-sm text-center">
                Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}