
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Home, LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidePanelProps {
  onTabChange: (tab: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Auth context will handle redirection
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 w-64 bg-dashboard-sidebar border-r border-white/10 z-10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <CheckSquare className="w-6 h-6 text-dashboard-accent2" />
          <h1 className="text-xl font-bold">Task Tracker</h1>
        </div>
        
        <nav className="space-y-1">
          <button
            className={`flex items-center gap-3 w-full p-3 rounded-md text-left transition-colors ${
              activeTab === 'dashboard' ? 'bg-dashboard-accent2/20 text-dashboard-accent2' : 'hover:bg-white/5'
            }`}
            onClick={() => handleTabClick('dashboard')}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          
          <button
            className={`flex items-center gap-3 w-full p-3 rounded-md text-left transition-colors ${
              activeTab === 'users' ? 'bg-dashboard-accent2/20 text-dashboard-accent2' : 'hover:bg-white/5'
            }`}
            onClick={() => handleTabClick('users')}
          >
            <Users className="w-5 h-5" />
            Users
          </button>
          
          <button
            className={`flex items-center gap-3 w-full p-3 rounded-md text-left transition-colors ${
              activeTab === 'settings' ? 'bg-dashboard-accent2/20 text-dashboard-accent2' : 'hover:bg-white/5'
            }`}
            onClick={() => handleTabClick('settings')}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 px-6">
        <button
          className="flex items-center gap-3 w-full p-3 rounded-md text-left text-red-400 hover:bg-red-500/10 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
