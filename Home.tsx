import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useLocation } from 'wouter';
import { DollarSign, Users, CheckCircle, TrendingUp, Gift, Star } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <img src="/logo.png" alt="PromoHive" className="h-24 mx-auto mb-8" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PromoHive Global Promo Network
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete tasks, refer friends, and earn real money
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Earn Money</CardTitle>
              <CardDescription>
                Complete simple tasks and earn up to $150 per task
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Refer & Earn</CardTitle>
              <CardDescription>
                Earn up to $180 for each friend you refer
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Level Up</CardTitle>
              <CardDescription>
                Upgrade your level and earn up to 75% bonus on all tasks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Fast Payouts</CardTitle>
              <CardDescription>
                Withdraw your earnings via USDT (TRC20/ERC20/BEP20)
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your free account and get $5 welcome bonus after approval
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Tasks</h3>
              <p className="text-muted-foreground">
                Browse available tasks and start earning by completing simple activities
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
              <p className="text-muted-foreground">
                Request withdrawal once you reach $10 minimum balance
              </p>
            </div>
          </div>
        </div>

        {/* Levels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Membership Levels</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Level 0
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">Free</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ 0% bonus</li>
                  <li>✓ $9.90 withdrawal cap</li>
                  <li>✓ Basic tasks</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  Level 1
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$50</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ 35% bonus</li>
                  <li>✓ $50 withdrawal cap</li>
                  <li>✓ All tasks</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-500 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  Level 2
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$100</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ 55% bonus</li>
                  <li>✓ $100 withdrawal cap</li>
                  <li>✓ Priority support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-500 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Level 3
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$150</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ 75% bonus</li>
                  <li>✓ $150 withdrawal cap</li>
                  <li>✓ VIP support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users already making money with PromoHive
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-12">
              Sign Up Now - It's Free!
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} PromoHive Global Promo Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

