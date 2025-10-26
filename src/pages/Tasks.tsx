import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Play, 
  CheckCircle, 
  Clock, 
  DollarSign,
  ExternalLink,
  ArrowLeft,
  Target,
  Users,
  Zap,
  Sparkles,
  Gift,
  Shield,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  reward: number;
  instructions?: string;
  url?: string;
  proofRequired: boolean;
  status: string;
  maxParticipants?: number;
  currentParticipants: number;
  createdAt: string;
}

interface Offer {
  id: string;
  externalId: string;
  source: string;
  title: string;
  description: string;
  reward: number;
  url: string;
  isActive: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('manual');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchUserTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, selectedTab]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.tasks);
      } else {
        toast.error('Failed to load tasks');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const response = await fetch('/api/tasks/user', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setUserTasks(data.userTasks);
      }
    } catch (error) {
      console.error('Failed to load user tasks:', error);
    }
  };

  const filterTasks = () => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedTab !== 'all') {
      filtered = filtered.filter(task => task.type.toLowerCase() === selectedTab);
    }

    setFilteredTasks(filtered);
  };

  const startTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/start`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Task started successfully!');
        fetchUserTasks();
      } else {
        toast.error(data.error || 'Failed to start task');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const submitProof = async (taskId: string, proofUrl: string, proofText: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/submit-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ proofUrl, proofText }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Proof submitted successfully!');
        fetchUserTasks();
      } else {
        toast.error(data.error || 'Failed to submit proof');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const getTaskTypeIcon = (type: string) => {
    const icons = {
      manual: Target,
      adgem: Zap,
      adsterra: Activity,
      cpalead: Users,
      referral: Users
    };
    return icons[type.toLowerCase() as keyof typeof icons] || Target;
  };

  const getTaskTypeColor = (type: string) => {
    const colors = {
      manual: 'bg-blue-100 text-blue-800',
      adgem: 'bg-green-100 text-green-800',
      adsterra: 'bg-purple-100 text-purple-800',
      cpalead: 'bg-orange-100 text-orange-800',
      referral: 'bg-pink-100 text-pink-800'
    };
    return colors[type.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUserTaskStatus = (taskId: string) => {
    const userTask = userTasks.find(ut => ut.taskId === taskId);
    return userTask ? userTask.status : null;
  };

  const isTaskStarted = (taskId: string) => {
    return userTasks.some(ut => ut.taskId === taskId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading tasks...</p>
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
                <h1 className="text-2xl font-bold text-gray-900 font-display">Tasks</h1>
                <p className="text-sm text-gray-600">Complete tasks and earn money</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-brand-gradient text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                {filteredTasks.length} Available
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
                  Start Earning Today! 💰
                </h2>
                <p className="text-lg opacity-90">
                  Complete tasks and earn money instantly. Choose from various task types below.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation">
                  <Target className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 animate-slide-up">
          <Card className="card-interactive">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-brand pl-10 focus-ring"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Filter by type:</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all" className="hover-glow">
              <Target className="h-4 w-4 mr-2" />
              All Tasks
            </TabsTrigger>
            <TabsTrigger value="manual" className="hover-glow">
              <Target className="h-4 w-4 mr-2" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="adgem" className="hover-glow">
              <Zap className="h-4 w-4 mr-2" />
              AdGem
            </TabsTrigger>
            <TabsTrigger value="adsterra" className="hover-glow">
              <Activity className="h-4 w-4 mr-2" />
              Adsterra
            </TabsTrigger>
            <TabsTrigger value="cpalead" className="hover-glow">
              <Users className="h-4 w-4 mr-2" />
              CPAlead
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task, index) => {
                  const TaskIcon = getTaskTypeIcon(task.type);
                  const userTaskStatus = getUserTaskStatus(task.id);
                  const isStarted = isTaskStarted(task.id);
                  
                  return (
                    <Card 
                      key={task.id} 
                      className={`task-card animate-scale-in hover-lift ${
                        isStarted ? 'ring-2 ring-brand-blue' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className="task-card-header">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTaskTypeColor(task.type)}`}>
                              <TaskIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="task-card-title">{task.title}</CardTitle>
                              <Badge variant="secondary" className={getTaskTypeColor(task.type)}>
                                {task.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="task-card-reward">${task.reward.toFixed(2)}</div>
                            {userTaskStatus && (
                              <Badge variant="secondary" className={getStatusColor(userTaskStatus)}>
                                {userTaskStatus}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          {task.description}
                        </CardDescription>
                        
                        {task.instructions && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
                            <p className="text-sm text-gray-600">{task.instructions}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                          {task.maxParticipants && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {task.currentParticipants}/{task.maxParticipants}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {!isStarted ? (
                            <Button 
                              onClick={() => startTask(task.id)}
                              className="w-full btn-primary btn-touch"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Task
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              {userTaskStatus === 'pending' && (
                                <div className="text-center">
                                  <div className="flex items-center justify-center mb-2">
                                    <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                                    <span className="text-sm font-medium">Task in Progress</span>
                                  </div>
                                  <Button 
                                    onClick={() => {
                                      const proofUrl = prompt('Enter proof URL (optional):');
                                      const proofText = prompt('Enter proof text:');
                                      if (proofText) {
                                        submitProof(task.id, proofUrl || '', proofText);
                                      }
                                    }}
                                    className="w-full btn-secondary btn-touch"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Submit Proof
                                  </Button>
                                </div>
                              )}
                              {userTaskStatus === 'approved' && (
                                <div className="text-center">
                                  <div className="flex items-center justify-center mb-2">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Completed!</span>
                                  </div>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Reward Credited
                                  </Badge>
                                </div>
                              )}
                              {userTaskStatus === 'rejected' && (
                                <div className="text-center">
                                  <div className="flex items-center justify-center mb-2">
                                    <Clock className="h-4 w-4 mr-2 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">Rejected</span>
                                  </div>
                                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                                    Proof Rejected
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {task.url && (
                            <Button 
                              variant="outline" 
                              className="w-full btn-touch"
                              onClick={() => window.open(task.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Task
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Available</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No tasks match your search criteria.' : 'No tasks available for this category.'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="hover-glow"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Tips Section */}
        <div className="mt-12 animate-slide-up">
          <Card className="card-interactive">
              <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-brand-pink" />
                Earning Tips
              </CardTitle>
              <CardDescription>
                Maximize your earnings with these helpful tips
              </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Complete Daily</h3>
                  <p className="text-sm text-gray-600">Complete tasks daily to maintain consistent earnings</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '1s' }}>
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Follow Instructions</h3>
                  <p className="text-sm text-gray-600">Read and follow task instructions carefully</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '2s' }}>
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quality Proof</h3>
                  <p className="text-sm text-gray-600">Submit high-quality proof for faster approval</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '3s' }}>
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Level Up</h3>
                  <p className="text-sm text-gray-600">Upgrade your level for higher earning potential</p>
                </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}