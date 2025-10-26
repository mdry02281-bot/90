import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Users, 
  Trophy, 
  TrendingUp, 
  ArrowRight, 
  Wallet,
  Activity,
  Target,
  LogOut,
  Sparkles,
  Gift,
  Zap,
  Shield,
  Star,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardData {
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    level: number;
    referralCode: string;
    createdAt: string;
  };
  wallet: {
    balance: number;
    pendingBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
  };
  stats: {
    totalTransactions: number;
    totalTasks: number;
    totalReferrals: number;
    totalWithdrawals: number;
    totalReferralBonus: number;
    totalWithdrawn: number;
  };
  recentTransactions: any[];
  recentTasks: any[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const copyReferralCode = async () => {
    if (dashboardData?.user.referralCode) {
      try {
        await navigator.clipboard.writeText(dashboardData.user.referralCode);
        setCopiedCode(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (error) {
        toast.error('Failed to copy referral code');
      }
    }
  };

  const getLevelProgress = (level: number) => {
    const levelRequirements = {
      0: { current: 0, max: 100, next: 'L1' },
      1: { current: 100, max: 500, next: 'L2' },
      2: { current: 500, max: 1000, next: 'L3' },
      3: { current: 1000, max: 1000, next: 'Max' }
    };
    return levelRequirements[level as keyof typeof levelRequirements] || { current: 0, max: 100, next: 'L1' };
  };

  const getLevelColor = (level: number) => {
    const colors = {
      0: 'bg-gray-500',
      1: 'bg-green-500',
      2: 'bg-blue-500',
      3: 'bg-purple-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { user, wallet, stats } = dashboardData;
  const levelProgress = getLevelProgress(user.level);

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
                <p className="text-sm text-gray-600">Welcome back, {user.fullName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className={`${getLevelColor(user.level)} text-white`}>
                Level {user.level}
              </Badge>
              <Button variant="ghost" onClick={handleLogout} className="hover-glow">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="card-interactive p-6 bg-brand-gradient text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 font-display">
                  Welcome back, {user.fullName}! 👋
                </h2>
                <p className="text-lg opacity-90">
                  Ready to earn more money today? Let's get started!
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card animate-scale-in hover-lift">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Balance</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center float-animation">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">${wallet.balance.toFixed(2)}</div>
              <p className="text-sm text-gray-600 mt-1">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Earned</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center float-animation">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">${wallet.totalEarned.toFixed(2)}</div>
              <p className="text-sm text-gray-600 mt-1">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Referrals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center float-animation">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats.totalReferrals}</div>
              <p className="text-sm text-gray-600 mt-1">
                Total referrals
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Tasks Completed</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center float-animation">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats.totalTasks}</div>
              <p className="text-sm text-gray-600 mt-1">
                Tasks completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-brand-blue" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Start earning money with these quick actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/tasks">
                    <Button className="w-full btn-primary btn-touch hover-lift">
                      <Target className="h-4 w-4 mr-2" />
                      Browse Tasks
                    </Button>
                  </Link>
                  <Link href="/referrals">
                    <Button className="w-full btn-secondary btn-touch hover-lift">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Friends
                    </Button>
                  </Link>
                  <Link href="/withdrawals">
                    <Button className="w-full btn-secondary btn-touch hover-lift">
                      <Wallet className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  </Link>
                  <Button 
                    className="w-full btn-secondary btn-touch hover-lift"
                    onClick={copyReferralCode}
                  >
                    {copiedCode ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy Referral Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card className="card-interactive animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-brand-pink" />
                  Level Progress
                </CardTitle>
                <CardDescription>
                  Upgrade your level to unlock higher earning potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Level: {user.level}</span>
                    <Badge variant="secondary" className={`${getLevelColor(user.level)} text-white`}>
                      Level {user.level}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Next Level</span>
                      <span>{levelProgress.current}/{levelProgress.max}</span>
                    </div>
                    <Progress 
                      value={(levelProgress.current / levelProgress.max) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Level Benefits:</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-2" />
                        Level 1: +35% earning bonus
                      </li>
                      <li className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-2" />
                        Level 2: +55% earning bonus
                      </li>
                      <li className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-2" />
                        Level 3: +75% earning bonus
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-interactive animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-brand-blue" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest transactions and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentTransactions.length > 0 ? (
                    dashboardData.recentTransactions.slice(0, 5).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-lift">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Referral Code */}
            <Card className="card-interactive animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-brand-pink" />
                  Your Referral Code
                </CardTitle>
                <CardDescription>
                  Share this code to earn referral bonuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Your referral code:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-mono font-bold text-gradient">
                        {user.referralCode}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyReferralCode}
                        className="hover-glow"
                      >
                        {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">💰 Earn $70+ for each successful referral</p>
                    <p className="mb-2">🎁 Your friends get $10 bonus when they join</p>
                    <p>📈 Multi-level referral system with increasing rewards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="card-interactive animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-brand-blue" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Username:</span>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member since:</span>
                    <span className="text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Level:</span>
                    <Badge variant="secondary" className={`${getLevelColor(user.level)} text-white`}>
                      Level {user.level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="card-interactive animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-brand-pink" />
                  Earning Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-green-600 font-bold text-xs">1</span>
                    </div>
                    <p>Complete daily tasks to maintain consistent earnings</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">2</span>
                    </div>
                    <p>Invite friends using your referral code for bonus rewards</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-purple-600 font-bold text-xs">3</span>
                    </div>
                    <p>Upgrade your level to unlock higher earning potential</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-orange-600 font-bold text-xs">4</span>
                    </div>
                    <p>Withdraw earnings regularly to secure your profits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}