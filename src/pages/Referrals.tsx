import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Copy, 
  Share2, 
  DollarSign, 
  TrendingUp, 
  ArrowLeft,
  UserPlus,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
  Gift,
  Zap,
  Shield,
  Star,
  CheckCircle,
  Target,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  stats: {
    totalReferrals: number;
    totalBonus: number;
    levelStats: any[];
    recentReferrals: any[];
  };
}

export default function Referrals() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchReferralData();
    fetchReferrals();
    fetchEarnings();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referrals/link', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const response = await fetch('/api/referrals/my-referrals', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setReferrals(data);
      }
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/referrals/earnings', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setEarnings(data);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    }
  };

  const copyReferralCode = async () => {
    if (referralData?.referralCode) {
      try {
        await navigator.clipboard.writeText(referralData.referralCode);
        setCopiedCode(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (error) {
        toast.error('Failed to copy referral code');
      }
    }
  };

  const copyReferralLink = async () => {
    if (referralData?.referralLink) {
      try {
        await navigator.clipboard.writeText(referralData.referralLink);
        setCopiedLink(true);
        toast.success('Referral link copied!');
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (error) {
        toast.error('Failed to copy referral link');
      }
    }
  };

  const shareReferralLink = async () => {
    if (referralData?.referralLink) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join PromoHive and Start Earning!',
            text: 'Join me on PromoHive and start earning money by completing simple tasks!',
            url: referralData.referralLink,
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        copyReferralLink();
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading referrals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 hover-lift">
              <Link href="/dashboard">
                <Button variant="ghost" className="hover-glow">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img src="/logo.png" alt="PromoHive" className="h-10 w-10 float-animation" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display">Referrals</h1>
                <p className="text-sm text-gray-600">Invite friends and earn bonuses</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-brand-gradient text-white">
                <Users className="h-3 w-3 mr-1" />
                {referrals.length} Referrals
              </Badge>
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
                  Earn More with Referrals! 🎁
                </h2>
                <p className="text-lg opacity-90">
                  Invite friends and earn $70+ for each successful referral. Your friends get $10 bonus too!
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation">
                  <Gift className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dashboard-card animate-scale-in hover-lift">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Referrals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center float-animation">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{referrals.length}</div>
              <p className="text-sm text-gray-600 mt-1">
                Friends invited
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Earnings</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center float-animation">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">${earnings?.totalReferralEarnings?.toFixed(2) || '0.00'}</div>
              <p className="text-sm text-gray-600 mt-1">
                From referrals
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Active Referrals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center float-animation">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">
                {referrals.filter(r => r.referred.isApproved).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Approved friends
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code Section */}
        <div className="mb-8 animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2 text-brand-pink" />
                Your Referral Code
              </CardTitle>
              <CardDescription>
                Share this code with your friends to earn referral bonuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Referral Code</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyReferralCode}
                      className="hover-glow"
                    >
                      {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-center">
                    <code className="text-2xl font-mono font-bold text-gradient bg-white/50 px-4 py-2 rounded-lg">
                      {referralData?.referralCode || 'Loading...'}
                    </code>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Referral Link</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyReferralLink}
                        className="hover-glow"
                      >
                        {copiedLink ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={shareReferralLink}
                        className="hover-glow"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                    <code className="text-sm font-mono bg-white/50 px-3 py-2 rounded-lg break-all">
                      {referralData?.referralLink || 'Loading...'}
                    </code>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={copyReferralCode}
                    className="w-full btn-primary btn-touch"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Referral Code
                  </Button>
                  <Button 
                    onClick={shareReferralLink}
                    className="w-full btn-secondary btn-touch"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Benefits */}
        <div className="mb-8 animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-brand-blue" />
                Referral Benefits
              </CardTitle>
              <CardDescription>
                Here's what you and your friends get when they join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    What You Earn
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">$70+ Referral Bonus</p>
                        <p className="text-sm text-green-600">For each approved friend</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Multi-level Rewards</p>
                        <p className="text-sm text-blue-600">Earn from your referrals' referrals</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-800">Level Bonuses</p>
                        <p className="text-sm text-purple-600">Higher levels = higher rewards</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-pink-500" />
                    What Your Friends Get
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <Gift className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-yellow-800">$10 Welcome Bonus</p>
                        <p className="text-sm text-yellow-600">When they get approved</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Access to Tasks</p>
                        <p className="text-sm text-green-600">Start earning immediately</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Instant Payouts</p>
                        <p className="text-sm text-blue-600">Withdraw via USDT</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referrals List */}
        <div className="mb-8 animate-scale-in">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-brand-blue" />
                Your Referrals
              </CardTitle>
              <CardDescription>
                Track your referral progress and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <div className="space-y-4">
                  {referrals.map((referral, index) => (
                    <div 
                      key={referral.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-lift animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-4 float-animation">
                          <UserPlus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{referral.referred.username}</p>
                          <p className="text-sm text-gray-600">{referral.referred.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined: {new Date(referral.referred.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className={getStatusColor(referral.referred.isApproved ? 'approved' : 'pending')}>
                          {referral.referred.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                        {referral.bonus > 0 && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            +${referral.bonus.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Referrals Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start inviting friends to earn referral bonuses!
                  </p>
                  <Button 
                    onClick={shareReferralLink}
                    className="btn-primary hover-glow"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Referral Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <div className="animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-brand-pink" />
                Referral Tips
              </CardTitle>
              <CardDescription>
                Maximize your referral earnings with these strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation">
                    <Share2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Share Everywhere</h3>
                  <p className="text-sm text-gray-600">Share on social media, forums, and with friends</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '1s' }}>
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Be Trustworthy</h3>
                  <p className="text-sm text-gray-600">Only invite people who will actually use the platform</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '2s' }}>
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Help Them Start</h3>
                  <p className="text-sm text-gray-600">Guide your referrals on how to complete tasks</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '3s' }}>
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">Monitor your referrals and help them succeed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}