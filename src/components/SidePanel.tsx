
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Home, Info, Mail, LogOut, CheckSquare, Lightbulb, BarChart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useEffect } from "react";

interface SidePanelProps {
  onTabChange: (value: string) => void;
}

const SidePanel = ({ onTabChange }: SidePanelProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  
  // Update language when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem('language') || 'en');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  useEffect(() => {
    // Listen for custom language change event
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('language') || 'en');
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  const userEmail = localStorage.getItem('userEmail') || 'john.smith@example.com';
  const userName = localStorage.getItem('userName') || userEmail.split('@')[0].replace('.', ' ');
  const initials = userName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  
  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('language');
    
    // Show toast notification
    toast({
      title: language === 'en' ? "Signed out" : 
             language === 'es' ? "Sesión cerrada" : 
             "Déconnecté",
      description: language === 'en' ? "You have been signed out successfully" : 
                   language === 'es' ? "Ha cerrado sesión con éxito" : 
                   "Vous avez été déconnecté avec succès",
    });
    
    // Navigate to home page
    navigate('/');
  };
  
  const handlePerformance = () => {
    navigate('/performance');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLogoClick = () => {
    navigate('/');
  };
  
  return (
    <div className="h-screen fixed left-0 top-0 w-64 glass-card border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={handleLogoClick}>
          <CheckSquare className="w-6 h-6 text-dashboard-accent2" />
          <h2 className="text-xl font-bold">
            {language === 'en' ? 'Task Tracker' : 
             language === 'es' ? 'Seguimiento de Tareas' : 
             'Suivi des Tâches'}
          </h2>
        </div>
        
        <div className="mb-8">
          <h3 className="text-sm uppercase text-dashboard-muted mb-3 px-2">
            {language === 'en' ? 'Navigation' : 
             language === 'es' ? 'Navegación' : 
             'Navigation'}
          </h3>
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
                {language === 'en' ? 'Dashboard' : 
                 language === 'es' ? 'Panel' : 
                 'Tableau de Bord'}
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                {language === 'en' ? 'Settings' : 
                 language === 'es' ? 'Configuración' : 
                 'Paramètres'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <button 
            className="w-full text-left px-3 py-2 mt-2 rounded flex items-center gap-2 hover:bg-white/10 transition-colors"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4" />
            {language === 'en' ? 'Home' : 
             language === 'es' ? 'Inicio' : 
             'Accueil'}
          </button>
          
          <button 
            className="w-full text-left px-3 py-2 mt-2 rounded flex items-center gap-2 hover:bg-white/10 transition-colors"
            onClick={() => navigate('/about')}
          >
            <Info className="w-4 h-4" />
            {language === 'en' ? 'About' : 
             language === 'es' ? 'Acerca de' : 
             'À Propos'}
          </button>
          
          <button 
            className="w-full text-left px-3 py-2 mt-2 rounded flex items-center gap-2 hover:bg-white/10 transition-colors"
            onClick={() => navigate('/contact')}
          >
            <Mail className="w-4 h-4" />
            {language === 'en' ? 'Contact' : 
             language === 'es' ? 'Contacto' : 
             'Contact'}
          </button>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-sm uppercase text-dashboard-muted mb-3 px-2">
            {language === 'en' ? 'User' : 
             language === 'es' ? 'Usuario' : 
             'Utilisateur'}
          </h3>
          
          <Sheet>
            <SheetTrigger asChild>
              <div className="glass-card p-3 mb-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white font-medium">
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-dashboard-muted">{userEmail}</p>
                  </div>
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="glass-card border-white/10">
              <SheetHeader>
                <SheetTitle className="text-center">
                  {language === 'en' ? 'Profile Options' : 
                   language === 'es' ? 'Opciones de Perfil' : 
                   'Options de Profil'}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                <button 
                  className="flex items-center gap-2 p-2 text-left rounded hover:bg-white/10 transition-colors"
                  onClick={handleProfile}
                >
                  <User className="w-4 h-4 text-dashboard-accent1" />
                  <span>
                    {language === 'en' ? 'My Profile' : 
                     language === 'es' ? 'Mi Perfil' : 
                     'Mon Profil'}
                  </span>
                </button>
                <button 
                  className="flex items-center gap-2 p-2 text-left rounded hover:bg-white/10 transition-colors"
                  onClick={handlePerformance}
                >
                  <BarChart className="w-4 h-4 text-dashboard-accent3" />
                  <span>
                    {language === 'en' ? 'My Performance' : 
                     language === 'es' ? 'Mi Rendimiento' : 
                     'Mes Performances'}
                  </span>
                </button>
                <button 
                  className="flex items-center gap-2 p-2 text-left rounded hover:bg-white/10 transition-colors text-red-400"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span>
                    {language === 'en' ? 'Sign Out' : 
                     language === 'es' ? 'Cerrar Sesión' : 
                     'Déconnexion'}
                  </span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
