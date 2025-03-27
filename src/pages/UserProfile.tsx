
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Lightbulb, User, Mail, Save, ArrowLeft, BarChart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const UserProfile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const userEmail = localStorage.getItem('userEmail') || 'john.smith@example.com';
  const storedUserName = localStorage.getItem('userName');
  const [userName, setUserName] = useState(storedUserName || userEmail.split('@')[0].replace('.', ' '));
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  
  // Initialize userName in localStorage if not set
  useEffect(() => {
    if (!storedUserName) {
      localStorage.setItem('userName', userName);
    }
  }, [storedUserName, userName]);
  
  const handleSaveProfile = () => {
    // Save to localStorage to make it available across the app
    localStorage.setItem('userName', editedName);
    setUserName(editedName);
    
    toast({
      title: language === 'en' ? "Profile updated" : 
             language === 'es' ? "Perfil actualizado" : 
             "Profil mis à jour",
      description: language === 'en' ? "Your profile information has been updated successfully." : 
                   language === 'es' ? "Su información de perfil ha sido actualizada con éxito." : 
                   "Vos informations de profil ont été mises à jour avec succès.",
    });
    setIsEditing(false);
  };
  
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

  const initials = userName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <CheckSquare className="w-6 h-6 text-dashboard-accent2" />
          <h1 className="text-2xl font-bold">
            {language === 'en' ? 'Task Tracker' : 
             language === 'es' ? 'Seguimiento de Tareas' : 
             'Suivi des Tâches'}
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/dashboard')}
          >
            {language === 'en' ? 'Dashboard' : 
             language === 'es' ? 'Panel' : 
             'Tableau de Bord'}
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/about')}
          >
            {language === 'en' ? 'About' : 
             language === 'es' ? 'Acerca de' : 
             'À Propos'}
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/contact')}
          >
            {language === 'en' ? 'Contact' : 
             language === 'es' ? 'Contacto' : 
             'Contact'}
          </Button>
          <div 
            className="cursor-grab active:cursor-grabbing"
            draggable
            onDragEnd={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Lightbulb className="h-5 w-5 text-yellow-300" />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white font-medium">
                  {initials}
                </div>
                <span>{userName}</span>
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
                  onClick={() => navigate('/profile')}
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
            {language === 'en' ? 'Back to Dashboard' : 
             language === 'es' ? 'Volver al Panel' : 
             'Retour au Tableau de Bord'}
          </Button>
          
          <h1 className="text-4xl font-bold mb-8 text-center">
            {language === 'en' ? 'User Profile' : 
             language === 'es' ? 'Perfil de Usuario' : 
             'Profil d\'Utilisateur'}
          </h1>
          
          <div className="glass-card p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white text-3xl font-medium mb-4">
                {initials}
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
                <h2 className="text-2xl font-bold">{userName}</h2>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="glass-card p-4 flex items-center gap-4">
                <User className="w-5 h-5 text-dashboard-accent2" />
                <div className="flex-grow">
                  <h3 className="text-sm text-gray-400">
                    {language === 'en' ? 'Username' : 
                     language === 'es' ? 'Nombre de Usuario' : 
                     'Nom d\'Utilisateur'}
                  </h3>
                  <p>{userName}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/20"
                  onClick={() => setIsEditing(true)}
                >
                  {language === 'en' ? 'Edit' : 
                   language === 'es' ? 'Editar' : 
                   'Modifier'}
                </Button>
              </div>
              
              <div className="glass-card p-4 flex items-center gap-4">
                <Mail className="w-5 h-5 text-dashboard-accent3" />
                <div>
                  <h3 className="text-sm text-gray-400">
                    {language === 'en' ? 'Email' : 
                     language === 'es' ? 'Correo' : 
                     'Email'}
                  </h3>
                  <p>{userEmail}</p>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Account Information' : 
                   language === 'es' ? 'Información de la Cuenta' : 
                   'Informations du Compte'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? 'Member Since' : 
                       language === 'es' ? 'Miembro Desde' : 
                       'Membre Depuis'}
                    </p>
                    <p>January 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? 'Account Type' : 
                       language === 'es' ? 'Tipo de Cuenta' : 
                       'Type de Compte'}
                    </p>
                    <p>
                      {language === 'en' ? 'Standard' : 
                       language === 'es' ? 'Estándar' : 
                       'Standard'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Activity Summary' : 
                   language === 'es' ? 'Resumen de Actividad' : 
                   'Résumé d\'Activité'}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-dashboard-accent1 text-2xl font-bold">24</p>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? 'Tasks Created' : 
                       language === 'es' ? 'Tareas Creadas' : 
                       'Tâches Créées'}
                    </p>
                  </div>
                  <div>
                    <p className="text-dashboard-accent2 text-2xl font-bold">18</p>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? 'Completed' : 
                       language === 'es' ? 'Completadas' : 
                       'Terminées'}
                    </p>
                  </div>
                  <div>
                    <p className="text-dashboard-accent3 text-2xl font-bold">75%</p>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? 'Completion Rate' : 
                       language === 'es' ? 'Tasa de Finalización' : 
                       'Taux d\'Achèvement'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-6 border-t border-white/10 mt-20">
        <div className="text-center text-gray-400">
          <p>
            {language === 'en' ? 'Copyrights 2025. Reserved' : 
             language === 'es' ? 'Derechos de Autor 2025. Reservados' : 
             'Droits d\'Auteur 2025. Réservés'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
