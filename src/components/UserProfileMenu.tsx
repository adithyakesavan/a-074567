
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BarChart, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LanguageContext } from '../App';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface UserProfileMenuProps {
  variant?: 'side' | 'top';
}

const UserProfileMenu = ({ variant = 'top' }: UserProfileMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useContext(LanguageContext);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [initials, setInitials] = useState('');
  
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || 'john.smith@example.com';
    const storedName = localStorage.getItem('userName') || storedEmail.split('@')[0].replace('.', ' ');
    
    setUserEmail(storedEmail);
    setUserName(storedName);
    setInitials(storedName.split(' ').map(name => name.charAt(0).toUpperCase()).join(''));
    
    // Listen for changes to userName
    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('userName') || storedEmail.split('@')[0].replace('.', ' ');
      setUserName(updatedName);
      setInitials(updatedName.split(' ').map(name => name.charAt(0).toUpperCase()).join(''));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
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
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        {variant === 'side' ? (
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
        ) : (
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white font-medium">
              {initials}
            </div>
            <span>{userName}</span>
          </div>
        )}
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
  );
};

export default UserProfileMenu;
