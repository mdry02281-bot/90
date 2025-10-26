import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  ExternalLink,
  Sparkles,
  Gift,
  Zap,
  Shield,
  Star,
  Activity,
  Target,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalSettings {
  minWithdrawal: number;
  exchangeRate: number;
  payoutWallet: string;
  currency: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  usdtAmount: number;
  conversionRate: number;
  walletAddress: string;
  network: string;
  status: string;
  txHash?: string;
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

interface WithdrawalStats {
  totalWithdrawals: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
  rejectedAmount: number;
  averageWithdrawal: number;
}

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [settings, setSettings] = useState<WithdrawalSettings | null>(null);
  const [stats, setStats] = useState<WithdrawalStats | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Withdrawal form state
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    walletAddress: '',
    network: 'TRC20'
  });

  useEffect(() => {
    fetchWithdrawals();
    fetchSettings();
    fetchStats();
    fetchWallet();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/withdrawals/history', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/withdrawals/settings', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/withdrawals/stats', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await fetch('/api/user/wallet', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const amount = parseFloat(withdrawalForm.amount);
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }

    if (settings && amount < settings.minWithdrawal) {
      setError(`Minimum withdrawal amount is $${settings.minWithdrawal}`);
      setIsSubmitting(false);
      return;
    }

    if (wallet && amount > wallet.balance) {
      setError('Insufficient balance');
      setIsSubmitting(false);
      return;
    }

    if (!withdrawalForm.walletAddress.trim()) {
      setError('Please enter your wallet address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/withdrawals/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount,
          walletAddress: withdrawalForm.walletAddress,
          network: withdrawalForm.network,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Withdrawal request submitted successfully!');
        setWithdrawalForm({ amount: '', walletAddress: '', network: 'TRC20' });
        fetchWithdrawals();
        fetchWallet();
        toast.success('Withdrawal request submitted!');
      } else {
        setError(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      completed: CheckCircle,
      rejected: XCircle,
      processing: Activity
    };
    return icons[status.toLowerCase() as keyof typeof icons] || Clock;
  };

  const calculateUSDTAmount = (amount: number) => {
    if (settings) {
      return (amount * settings.exchangeRate).toFixed(2);
    }
    return amount.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading withdrawals...</p>
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
                <h1 className="text-2xl font-bold text-gray-900 font-display">Withdrawals</h1>
                <p className="text-sm text-gray-600">Withdraw your earnings via USDT</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-brand-gradient text-white">
                <Wallet className="h-3 w-3 mr-1" />
                ${wallet?.balance?.toFixed(2) || '0.00'} Available
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
                  Withdraw Your Earnings! 💰
                </h2>
                <p className="text-lg opacity-90">
                  Convert your earnings to USDT and withdraw to your wallet instantly.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation">
                  <Wallet className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card animate-scale-in hover-lift">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Available Balance</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center float-animation">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">${wallet?.balance?.toFixed(2) || '0.00'}</div>
              <p className="text-sm text-gray-600 mt-1">
                Ready to withdraw
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Withdrawn</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center float-animation">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">${stats?.totalAmount?.toFixed(2) || '0.00'}</div>
              <p className="text-sm text-gray-600 mt-1">
                Lifetime withdrawals
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Pending Withdrawals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center float-animation">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">${stats?.pendingAmount?.toFixed(2) || '0.00'}</div>
              <p className="text-sm text-gray-600 mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Exchange Rate</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center float-animation">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">1:{settings?.exchangeRate || '1.00'}</div>
              <p className="text-sm text-gray-600 mt-1">
                USD to USDT
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <div className="animate-slide-up">
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-brand-blue" />
                  Request Withdrawal
                </CardTitle>
                <CardDescription>
                  Withdraw your earnings to your USDT wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 animate-slide-down" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 animate-slide-down">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-semibold">Amount (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min={settings?.minWithdrawal || 10}
                        max={wallet?.balance || 0}
                        placeholder={`Min: $${settings?.minWithdrawal || 10}`}
                        value={withdrawalForm.amount}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="input-brand pl-10 focus-ring"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum withdrawal: ${settings?.minWithdrawal || 10}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="walletAddress" className="text-sm font-semibold">USDT Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      type="text"
                      placeholder="Enter your USDT wallet address"
                      value={withdrawalForm.walletAddress}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, walletAddress: e.target.value }))}
                      className="input-brand focus-ring"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Make sure to use the correct network (TRC20 recommended)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="network" className="text-sm font-semibold">Network</Label>
                    <Select 
                      value={withdrawalForm.network} 
                      onValueChange={(value) => setWithdrawalForm(prev => ({ ...prev, network: value }))}
                    >
                      <SelectTrigger className="input-brand focus-ring">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRC20">TRC20 (Tron)</SelectItem>
                        <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                        <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {withdrawalForm.amount && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">You will receive:</span>
                        <span className="text-lg font-bold text-gradient">
                          {calculateUSDTAmount(parseFloat(withdrawalForm.amount) || 0)} USDT
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Exchange rate: 1 USD = {settings?.exchangeRate || 1} USDT
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full btn-primary btn-touch"
                    disabled={isSubmitting || !wallet?.balance || wallet.balance < (settings?.minWithdrawal || 10)}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Request Withdrawal
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal History */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-brand-blue" />
                  Withdrawal History
                </CardTitle>
                <CardDescription>
                  Track your withdrawal requests and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {withdrawals.length > 0 ? (
                  <div className="space-y-4">
                    {withdrawals.slice(0, 5).map((withdrawal, index) => {
                      const StatusIcon = getStatusIcon(withdrawal.status);
                      return (
                        <div 
                          key={withdrawal.id} 
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-lift animate-scale-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-4 float-animation">
                              <StatusIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                ${withdrawal.amount.toFixed(2)} USD
                              </p>
                              <p className="text-sm text-gray-600">
                                {withdrawal.usdtAmount.toFixed(2)} USDT
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(withdrawal.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className={getStatusColor(withdrawal.status)}>
                              {withdrawal.status}
                            </Badge>
                            {withdrawal.txHash && (
                              <p className="text-xs text-gray-500 mt-1 truncate max-w-20">
                                {withdrawal.txHash.slice(0, 8)}...
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Withdrawals Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start earning and request your first withdrawal!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Withdrawal Info */}
        <div className="mt-8 animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-brand-blue" />
                Withdrawal Information
              </CardTitle>
              <CardDescription>
                Important information about withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Withdrawal Process
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Submit Request</p>
                        <p className="text-sm text-blue-600">Enter amount and wallet address</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-yellow-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-yellow-800">Admin Review</p>
                        <p className="text-sm text-yellow-600">Request reviewed within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Payment Sent</p>
                        <p className="text-sm text-green-600">USDT sent to your wallet</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-pink-500" />
                    Important Notes
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Instant Processing</p>
                        <p className="text-sm text-green-600">Withdrawals processed within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Secure Payments</p>
                        <p className="text-sm text-blue-600">All transactions are secure and encrypted</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <Zap className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-800">Multiple Networks</p>
                        <p className="text-sm text-purple-600">Support for TRC20, ERC20, and BEP20</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}