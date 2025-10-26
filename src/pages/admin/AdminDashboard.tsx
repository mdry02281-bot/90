import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  UserCheck,
  UserX,
  Wallet,
  Award,
  AlertCircle,
  Sparkles,
  Gift,
  Zap,
  Shield,
  Star,
  Activity,
  Crown,
  Globe,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  users: {
    total: number;
    pending: number;
    approved: number;
  };
  tasks: {
    total: number;
    active: number;
  };
  withdrawals: {
    total: number;
    pending: number;
  };
  revenue: {
    total: number;
  };
  recentActivity: any[];
}

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isApproved: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardStats();
    fetchPendingUsers();
  }, []);

  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard Stats Response:', data);
        // The API returns { success: true, stats: {...} }
        const statsData = data.stats || data;
        console.log('Parsed Stats Data:', statsData);
        setStats(statsData);
      } else {
        const errorData = await response.json();
        console.error('Failed to load dashboard stats:', errorData);
        toast.error('Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    setUsersLoading(true);
    try {
      console.log('Fetching pending users...');
      const response = await fetch('/api/admin/users?status=pending', {
        credentials: 'include',
      });
      console.log('Pending users response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Pending users response data:', data);
        const users = data.users || [];
        console.log('Parsed pending users:', users);
        console.log('Number of pending users:', users.length);
        setPendingUsers(users);
        
        if (users.length === 0) {
          console.log('No pending users found');
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to load pending users:', response.status, errorData);
        toast.error('Failed to load pending users');
      }
    } catch (error) {
      console.error('Network error fetching pending users:', error);
      toast.error('Network error');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      console.log('Approving user:', userId);
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log('Approve response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Approve success:', data);
        toast.success('User approved successfully');
        fetchPendingUsers();
        fetchDashboardStats();
      } else {
        const data = await response.json();
        console.error('Approve failed:', data);
        toast.error(data.error || 'Failed to approve user');
      }
    } catch (error) {
      console.error('Approve network error:', error);
      toast.error('Network error');
    }
  };

  const handleCreateTestUser = async () => {
    try {
      console.log('Creating test user...');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@promohive.com`,
          password: 'Test123!@#',
          username: `testuser${Date.now()}`,
          fullName: 'Test User',
          gender: 'male',
          birthdate: '1990-01-01',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Test user created:', data);
        toast.success('Test user created successfully');
        fetchPendingUsers();
        fetchDashboardStats();
      } else {
        const errorData = await response.json();
        console.error('Failed to create test user:', errorData);
        toast.error(errorData.error || 'Failed to create test user');
      }
    } catch (error) {
      console.error('Create test user network error:', error);
      toast.error('Network error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">Unable to connect to the server</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
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
                <h1 className="text-2xl font-bold text-gray-900 font-display">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  fetchDashboardStats();
                  fetchPendingUsers();
                  toast.success('Data refreshed');
                }}
              >
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="secondary" className="bg-brand-gradient text-white">
                <Crown className="h-3 w-3 mr-1" />
                Admin Panel
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
                  Welcome to Admin Panel! 👑
                </h2>
                <p className="text-lg opacity-90">
                  Manage users, tasks, withdrawals, and monitor platform performance.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation">
                  <Crown className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="dashboard-card animate-scale-in hover-lift">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Users</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center float-animation">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.users?.total ?? 1}</div>
              <p className="text-sm text-gray-600 mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Pending Approvals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center float-animation">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.users?.pending || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Active Tasks</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center float-animation">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.tasks?.active || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                Available tasks
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Pending Withdrawals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center float-animation">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.withdrawals?.pending || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Revenue</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center float-animation">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">${(stats?.revenue?.total || 0).toFixed(2)}</div>
              <p className="text-sm text-gray-600 mt-1">
                Total earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-brand-blue" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="btn-primary btn-touch hover-lift"
                  onClick={() => {
                    console.log('Switching to users tab');
                    setActiveTab('users');
                  }}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve Users
                  {stats?.users?.pending ? (
                    <Badge className="ml-2 bg-yellow-500">{stats.users.pending}</Badge>
                  ) : null}
                </Button>
                <Button 
                  className="btn-secondary btn-touch hover-lift"
                  onClick={() => {
                    console.log('Switching to tasks tab');
                    setActiveTab('tasks');
                  }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Manage Tasks
                </Button>
                <Button 
                  className="btn-secondary btn-touch hover-lift"
                  onClick={() => {
                    console.log('Switching to withdrawals tab');
                    setActiveTab('withdrawals');
                  }}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Review Withdrawals
                  {stats?.withdrawals?.pending ? (
                    <Badge className="ml-2 bg-yellow-500">{stats.withdrawals.pending}</Badge>
                  ) : null}
                </Button>
                <Button 
                  className="btn-secondary btn-touch hover-lift"
                  onClick={() => {
                    console.log('Switching to settings tab');
                    setActiveTab('settings');
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value: string) => {
          console.log('Tab changed to:', value);
          setActiveTab(value);
        }} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="hover-glow">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="hover-glow">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tasks" className="hover-glow">
              <Target className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="hover-glow">
              <Wallet className="h-4 w-4 mr-2" />
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="settings" className="hover-glow">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Platform Overview */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-interactive animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-brand-blue" />
                    Platform Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="font-medium">Total Users</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{stats?.users?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">Approved Users</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">{stats?.users?.approved || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                        <span className="font-medium">Pending Users</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">{stats?.users?.pending || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="font-medium">Active Tasks</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">{stats?.tasks?.active || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-interactive animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-brand-pink" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">Total Revenue</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">${stats?.revenue?.total?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="font-medium">Total Withdrawals</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{stats?.withdrawals?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                        <span className="font-medium">Pending Withdrawals</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">{stats?.withdrawals?.pending || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="font-medium">Platform Health</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="card-interactive animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-brand-blue" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest platform activities and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity?.length > 0 ? (
                    stats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-lift animate-scale-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {activity.type}
                        </Badge>
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
          </TabsContent>

          <TabsContent value="users" className="space-y-8">
            {/* Debug Info */}
            <Card className="card-interactive animate-slide-up bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Debug Information
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Technical details for troubleshooting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <strong className="text-blue-900">Pending Users Count:</strong> 
                  <span className="ml-2 font-mono bg-white px-2 py-1 rounded">{pendingUsers.length}</span>
                </div>
                <div className="text-sm">
                  <strong className="text-blue-900">Users Loading:</strong> 
                  <span className="ml-2 font-mono bg-white px-2 py-1 rounded">{usersLoading ? 'Yes' : 'No'}</span>
                </div>
                <div className="text-xs text-gray-600 mt-2 p-2 bg-white rounded overflow-auto max-h-32">
                  <strong>Raw Data:</strong>
                  <pre>{JSON.stringify({ pendingUsersCount: pendingUsers.length, usersLoading }, null, 2)}</pre>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <Button 
                    onClick={handleCreateTestUser} 
                    className="btn-primary"
                    size="sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Test User
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-brand-blue" />
                  Pending User Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve new user registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-12">
                    <div className="spinner mx-auto mb-4" />
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Users</h3>
                    <p className="text-gray-600">All users have been approved.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div 
                        key={user.id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{user.fullName}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Username: {user.username} | Registered: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                            <Button 
                              onClick={() => handleApproveUser(user.id)}
                              className="btn-primary"
                              size="sm"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-8">
            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-brand-blue" />
                  Task Management
                </CardTitle>
                <CardDescription>
                  Create and manage platform tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Management</h3>
                  <p className="text-gray-600 mb-4">
                    Create new tasks, manage existing ones, and monitor task performance.
                  </p>
                  <Button className="btn-primary hover-glow">
                    <Target className="h-4 w-4 mr-2" />
                    Manage Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-8">
            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-brand-blue" />
                  Withdrawal Management
                </CardTitle>
                <CardDescription>
                  Review and process withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Wallet className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Withdrawal Management</h3>
                  <p className="text-gray-600 mb-4">
                    Review pending withdrawal requests and process payments.
                  </p>
                  <Button className="btn-primary hover-glow">
                    <Wallet className="h-4 w-4 mr-2" />
                    Manage Withdrawals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-brand-blue" />
                  Platform Settings
                </CardTitle>
                <CardDescription>
                  Configure global platform settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Settings</h3>
                  <p className="text-gray-600 mb-4">
                    Adjust various platform configurations, such as welcome bonuses, referral rates, and withdrawal limits.
                  </p>
                  <Button className="btn-primary hover-glow" disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Tools */}
        <div className="mt-8 animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-brand-blue" />
                Admin Tools
              </CardTitle>
              <CardDescription>
                Advanced administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
                  <p className="text-sm text-gray-600">Manage database and backups</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '1s' }}>
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600">Platform analytics and reports</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '2s' }}>
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-sm text-gray-600">Security settings and logs</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '3s' }}>
                    <Settings className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
                  <p className="text-sm text-gray-600">Platform configuration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}