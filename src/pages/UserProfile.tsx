
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Lightbulb, User, Mail, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const userEmail = localStorage.getItem('userEmail') || 'john.smith@example.com';
  const userName = userEmail.split('@')[0].replace('.', ' ');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  
  const handleSaveProfile = () => {
    // In a real app, we would save this to a database
    // For now, we'll just show a success message
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

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
            onClick={() => navigate('/about')}
          >
            About
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/contact')}
          >
            Contact
          </Button>
          <div 
            className="cursor-grab active:cursor-grabbing"
            draggable
            onDragEnd={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Lightbulb className="h-5 w-5 text-yellow-300" />
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-8 flex items-center gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold mb-8 text-center">User Profile</h1>
          
          <div className="glass-card p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white text-3xl font-medium mb-4">
                {userName.split(' ').map(name => name.charAt(0).toUpperCase()).join('')}
              </div>
              
              {isEditing ? (
                <div className="flex gap-2 mt-2">
                  <Input 
                    value={editedName} 
                    onChange={(e) => setEditedName(e.target.value)} 
                    className="bg-white/10 border-white/20" 
                  />
                  <Button onClick={handleSaveProfile} size="sm">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <h2 className="text-2xl font-bold">{editedName}</h2>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="glass-card p-4 flex items-center gap-4">
                <User className="w-5 h-5 text-dashboard-accent2" />
                <div className="flex-grow">
                  <h3 className="text-sm text-gray-400">Username</h3>
                  <p>{editedName}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/20"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
              
              <div className="glass-card p-4 flex items-center gap-4">
                <Mail className="w-5 h-5 text-dashboard-accent3" />
                <div>
                  <h3 className="text-sm text-gray-400">Email</h3>
                  <p>{userEmail}</p>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <h3 className="font-medium mb-2">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p>January 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Type</p>
                    <p>Standard</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <h3 className="font-medium mb-2">Activity Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-dashboard-accent1 text-2xl font-bold">24</p>
                    <p className="text-sm text-gray-400">Tasks Created</p>
                  </div>
                  <div>
                    <p className="text-dashboard-accent2 text-2xl font-bold">18</p>
                    <p className="text-sm text-gray-400">Completed</p>
                  </div>
                  <div>
                    <p className="text-dashboard-accent3 text-2xl font-bold">75%</p>
                    <p className="text-sm text-gray-400">Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-6 border-t border-white/10 mt-20">
        <div className="text-center text-gray-400">
          <p>Copyrights 2025. Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
