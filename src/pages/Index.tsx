
import { 
  ShoppingCart, Smartphone, Box, Key, Bell, Globe, 
  Shield, CheckCircle, Clock, ListTodo 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import MetricCard from '@/components/MetricCard';
import MonthlyChart from '@/components/MonthlyChart';
import CustomerRequests from '@/components/CustomerRequests';
import SidePanel from '@/components/SidePanel';
import TaskList from '@/components/TaskList';
import AboutSection from '@/components/AboutSection';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [taskFilter, setTaskFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  const handleMetricCardClick = (filter: 'all' | 'completed' | 'pending') => {
    setTaskFilter(filter);
    setActiveTab('dashboard');
  };
  
  // Handles notification toggles
  const handleNotificationToggle = (type: string) => {
    toast({
      title: `${type} notifications enabled`,
      description: "You'll receive notifications for your tasks",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">Task Tracker Dashboard</h1>
              <p className="text-dashboard-muted">Manage your tasks efficiently and stay on top of your deadlines</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <MetricCard
                title="Total Tasks"
                value={24}
                total={24}
                color="#61AAF2"
                onClick={() => handleMetricCardClick('all')}
              />
              <MetricCard
                title="Completed"
                value={8}
                total={24}
                color="#7EBF8E"
                onClick={() => handleMetricCardClick('completed')}
              />
              <MetricCard
                title="Pending"
                value={16}
                total={24}
                color="#8989DE"
                onClick={() => handleMetricCardClick('pending')}
              />
            </div>

            <TaskList filter={taskFilter} />
          </>
        );
      case 'about':
        return <AboutSection />;
      case 'settings':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">Settings</h1>
              <p className="text-dashboard-muted">Configure your application settings</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-medium">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive task updates via email</p>
                    </div>
                    <Switch onCheckedChange={() => handleNotificationToggle('Email')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Due Date Reminders</p>
                      <p className="text-sm text-gray-400">Get reminders 5 minutes before due date</p>
                    </div>
                    <Switch onCheckedChange={() => handleNotificationToggle('Due date')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-400">Receive push notifications</p>
                    </div>
                    <Switch onCheckedChange={() => handleNotificationToggle('Push')} />
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-medium">Preferences</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-gray-400">Select your language</p>
                    </div>
                    <select className="bg-transparent border border-white/10 rounded-md px-2 py-1">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Default Task View</p>
                      <p className="text-sm text-gray-400">Choose default task filter</p>
                    </div>
                    <select 
                      className="bg-transparent border border-white/10 rounded-md px-2 py-1"
                      onChange={(e) => setTaskFilter(e.target.value as any)}
                      value={taskFilter}
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending Only</option>
                      <option value="completed">Completed Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={setActiveTab} />
      <div className="pl-64">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
