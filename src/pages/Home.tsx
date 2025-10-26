import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, DollarSign, Users, Target, Shield, Zap, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 hover-lift">
              <img src="/logo.png" alt="PromoHive" className="h-10 w-10 float-animation" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display">PromoHive</h1>
                <p className="text-sm text-gray-600">Global Promo Network</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="hover-glow">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="btn-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-display">
              Earn Money with{' '}
              <span className="text-gradient animate-gradient-x">
                PromoHive
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed animate-slide-up">
              Join the global promo network and start earning money by completing simple tasks, 
              referring friends, and participating in our reward system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
              <Link href="/register">
                <Button size="lg" className="btn-primary text-lg px-8 py-6 btn-touch">
                  Start Earning Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-6 btn-touch">
                  Already a Member?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Why Choose PromoHive?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer multiple ways to earn money with our comprehensive reward system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-interactive text-center hover-lift animate-scale-in">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 float-animation">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-display">Easy Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Complete simple tasks like following social media accounts, 
                  downloading apps, or filling out surveys to earn money.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-interactive text-center hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 float-animation">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-display">Referral System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Invite friends and earn bonuses when they join and start earning. 
                  Multi-level referral system with increasing rewards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-interactive text-center hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4 float-animation">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-display">Level Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Upgrade your level to unlock higher earning potential and 
                  better rewards. Each level offers increased benefits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-interactive text-center hover-lift animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-4 float-animation">
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl font-display">Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Withdraw your earnings securely via USDT cryptocurrency. 
                  Fast, secure, and reliable payment processing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-interactive text-center hover-lift animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 float-animation">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-display">Instant Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Get paid instantly for completed tasks. No waiting periods, 
                  your earnings are credited immediately upon approval.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-interactive text-center hover-lift animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-4 float-animation">
                  <TrendingUp className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl font-display">Global Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Join thousands of users worldwide earning money through 
                  our platform. Be part of the global promo network.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-brand-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 font-display">How It Works</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-slide-up">
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 text-3xl font-bold glow-effect">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4 font-display">Sign Up</h3>
              <p className="text-lg opacity-90">
                Create your account and wait for admin approval
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 text-3xl font-bold glow-effect">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4 font-display">Get Approved</h3>
              <p className="text-lg opacity-90">
                Receive $5 welcome bonus when your account is approved
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 text-3xl font-bold glow-effect">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4 font-display">Complete Tasks</h3>
              <p className="text-lg opacity-90">
                Start earning by completing available tasks and offers
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 text-3xl font-bold glow-effect">
                4
              </div>
              <h3 className="text-2xl font-semibold mb-4 font-display">Withdraw Earnings</h3>
              <p className="text-lg opacity-90">
                Cash out your earnings via USDT cryptocurrency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Join Thousands of Earners
            </h2>
            <p className="text-xl text-gray-600">
              Be part of our growing community of successful earners
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-bounce-in">
              <div className="text-4xl font-bold text-gradient mb-2 font-display">10,000+</div>
              <div className="text-lg text-gray-600">Active Users</div>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-gradient mb-2 font-display">$500K+</div>
              <div className="text-lg text-gray-600">Total Paid Out</div>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-gradient mb-2 font-display">50,000+</div>
              <div className="text-lg text-gray-600">Tasks Completed</div>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-gradient mb-2 font-display">99%</div>
              <div className="text-lg text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real testimonials from our satisfied users
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-interactive p-6 hover-lift animate-scale-in">
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "PromoHive has changed my life! I've earned over $2000 in just 3 months. The tasks are easy and payouts are instant."
                </p>
                <div className="font-semibold text-gray-900">Sarah M.</div>
                <div className="text-sm text-gray-500">Level 3 User</div>
              </CardContent>
            </Card>
            
            <Card className="card-interactive p-6 hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The referral program is amazing! I've made $500+ just from referring friends. Highly recommended!"
                </p>
                <div className="font-semibold text-gray-900">Ahmed K.</div>
                <div className="text-sm text-gray-500">Level 2 User</div>
              </CardContent>
            </Card>
            
            <Card className="card-interactive p-6 hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Best earning platform I've used! Tasks are diverse, support is great, and withdrawals are super fast."
                </p>
                <div className="font-semibold text-gray-900">Maria L.</div>
                <div className="text-sm text-gray-500">Level 1 User</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 font-display animate-fade-in">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-slide-up">
            Join PromoHive today and start your journey to financial freedom. 
            It's free to join and you can start earning immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
          <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 btn-touch hover-glow">
                Join PromoHive Now
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-3 mb-4 hover-lift">
                <img src="/logo.png" alt="PromoHive" className="h-8 w-8 float-animation" />
                <div>
                  <h3 className="text-xl font-bold font-display">PromoHive</h3>
                  <p className="text-sm text-gray-400">Global Promo Network</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                The leading platform for earning money through simple tasks and referrals.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary" className="hover-glow">Secure</Badge>
                <Badge variant="secondary" className="hover-glow">Fast</Badge>
                <Badge variant="secondary" className="hover-glow">Reliable</Badge>
              </div>
            </div>

            <div className="animate-slide-up">
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tasks" className="hover:text-white transition-colors">Tasks</Link></li>
                <li><Link href="/referrals" className="hover:text-white transition-colors">Referrals</Link></li>
                <li><Link href="/withdrawals" className="hover:text-white transition-colors">Withdrawals</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fade-in">
            <p>&copy; 2024 PromoHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}