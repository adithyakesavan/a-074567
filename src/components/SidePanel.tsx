
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Users, Home, Info, Mail, LogOut, CheckSquare } from "lucide-react";

interface SidePanelProps {
  onTabChange: (value: string) => void;
}

const SidePanel = ({ onTabChange }: SidePanelProps) => {
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
                value="users" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4" />
                Users
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
        </div>
        
        <div className="mt-auto">
          <h3 className="text-sm uppercase text-dashboard-muted mb-3 px-2">User</h3>
          <div className="glass-card p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white font-medium">
                JS
              </div>
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-xs text-dashboard-muted">john.smith@example.com</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-2 p-2 text-left rounded hover:bg-white/10 transition-colors">
              <CheckSquare className="w-4 h-4 text-dashboard-accent3" />
              <span>My Tasks</span>
            </button>
            <button className="flex items-center gap-2 p-2 text-left rounded hover:bg-white/10 transition-colors text-red-400">
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
