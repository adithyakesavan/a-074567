
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    // Check if user is logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // Get user initials for avatar if user exists
  const userInitials = user?.email 
    ? user.email.split('@')[0].charAt(0).toUpperCase() + 
      (user.email.split('@')[0].split('.')[1]?.charAt(0).toUpperCase() || '')
    : 'G';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <CheckSquare className="w-6 h-6 text-dashboard-accent2" />
          <h1 className="text-2xl font-bold">Task Tracker</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/contact')}
          >
            Contact
          </Button>
          {isAuthenticated ? (
            <div 
              className="cursor-pointer"
              onClick={handleProfileClick}
            >
              <Avatar className="h-9 w-9 bg-dashboard-accent1 hover:ring-2 hover:ring-white/20">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Manage Your Tasks Efficiently</h1>
          <p className="text-xl text-gray-300 mb-12">
            A powerful task management tool that helps you stay organized, focused, and productive.
            Track your progress, set priorities, and never miss a deadline again.
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-black hover:bg-black/80 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Task Organization</h3>
            <p className="text-gray-300">
              Categorize and prioritize your tasks with an intuitive interface.
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
            <p className="text-gray-300">
              Monitor your productivity with visual charts and statistics.
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            <p className="text-gray-300">
              Get timely reminders for approaching deadlines and important tasks.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-6 border-t border-white/10 mt-20">
        <div className="flex justify-between items-center">
          <p className="text-gray-400">Copyrights 2025. Reserved</p>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
