
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Home, Info, LogOut, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface SidePanelProps {
  onTabChange: (value: string) => void;
}

const SidePanel = ({ onTabChange }: SidePanelProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  // Get user email from auth context or fallback
  const userEmail = user?.email || 'user@example.com';
  const initials = userEmail.split('@')[0].charAt(0).toUpperCase() + 
                  (userEmail.split('@')[0].split('.')[1]?.charAt(0).toUpperCase() || '');
  
  const handleSignOut = async () => {
    try {
      await signOut();
      
      // Show toast notification
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out",
        variant: "destructive"
      });
    }
  };
  
  const handleMyTasks = () => {
    onTabChange('dashboard');
  };
  
  return (
    <div className="h-screen fixed left-0 top-0 w-64 glass-card border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <CheckSquare className="w-6 h-6 text-dashboard-accent2" />
          <h2 className="text-xl font-bold">Task Tracker</h2>
        </div>
        
        <div className="mb-8">
          <h3 className="text-sm uppercase text-dashboard-muted mb-3 px-2">Navigation</h3>
          <Tabs 
            defaultValue="dashboard" 
            orientation="vertical" 
            className="w-full"
            onValueChange={onTabChange}
          >
            <TabsList className="flex flex-col h-auto bg-transparent text-white">
              <TabsTrigger 
                value="dashboard" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Info className="w-4 h-4" />
                About
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <button 
            className="w-full text-left px-3 py-2 mt-2 rounded flex items-center gap-2 hover:bg-white/10 transition-colors"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-sm uppercase text-dashboard-muted mb-3 px-2">User</h3>
          <div className="glass-card p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white font-medium">
                {initials}
              </div>
              <div>
                <p className="font-medium">{userEmail.split('@')[0].replace('.', ' ')}</p>
                <p className="text-xs text-dashboard-muted">{userEmail}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <button 
              className="flex items-center gap-2 p-2 text-left rounded hover:bg-white/10 transition-colors"
              onClick={handleMyTasks}
            >
              <CheckSquare className="w-4 h-4 text-dashboard-accent3" />
              <span>My Tasks</span>
            </button>
            <button 
              className="flex items-center gap-2 p-2 text-left rounded hover:bg-white/10 transition-colors text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
