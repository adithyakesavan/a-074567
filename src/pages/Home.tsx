
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { LanguageContext } from '../App';
import UserProfileMenu from '@/components/UserProfileMenu';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language } = useContext(LanguageContext);
  const { toast } = useToast();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const handleGetStarted = () => {
    // Check if user is logged in
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

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
          {!isLoggedIn ? (
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              {language === 'en' ? 'Login' : 
               language === 'es' ? 'Iniciar Sesión' : 
               'Connexion'}
            </Button>
          ) : (
            <UserProfileMenu />
          )}
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            {language === 'en' ? 'Manage Your Tasks Efficiently' : 
             language === 'es' ? 'Administre sus Tareas Eficientemente' : 
             'Gérez vos Tâches Efficacement'}
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            {language === 'en' ? 'A powerful task management tool that helps you stay organized, focused, and productive. Track your progress, set priorities, and never miss a deadline again.' : 
             language === 'es' ? 'Una poderosa herramienta de gestión de tareas que le ayuda a mantenerse organizado, enfocado y productivo. Haga seguimiento a su progreso, establezca prioridades y nunca más pierda una fecha límite.' : 
             'Un outil puissant de gestion des tâches qui vous aide à rester organisé, concentré et productif. Suivez votre progression, définissez des priorités et ne manquez plus jamais une échéance.'}
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-black hover:bg-black/80 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2"
              onClick={handleGetStarted}
            >
              <span className="text-yellow-400">
                {language === 'en' ? 'Get Started' : 
                 language === 'es' ? 'Comenzar' : 
                 'Commencer'}
              </span>
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Task Organization' : 
               language === 'es' ? 'Organización de Tareas' : 
               'Organisation des Tâches'}
            </h3>
            <p className="text-gray-300">
              {language === 'en' ? 'Categorize and prioritize your tasks with an intuitive interface.' : 
               language === 'es' ? 'Categorice y priorice sus tareas con una interfaz intuitiva.' : 
               'Catégorisez et hiérarchisez vos tâches avec une interface intuitive.'}
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Progress Tracking' : 
               language === 'es' ? 'Seguimiento de Progreso' : 
               'Suivi de Progression'}
            </h3>
            <p className="text-gray-300">
              {language === 'en' ? 'Monitor your productivity with visual charts and statistics.' : 
               language === 'es' ? 'Monitoree su productividad con gráficos visuales y estadísticas.' : 
               'Suivez votre productivité avec des graphiques visuels et des statistiques.'}
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Notifications' : 
               language === 'es' ? 'Notificaciones' : 
               'Notifications'}
            </h3>
            <p className="text-gray-300">
              {language === 'en' ? 'Get timely reminders for approaching deadlines and important tasks.' : 
               language === 'es' ? 'Reciba recordatorios oportunos para fechas límite próximas y tareas importantes.' : 
               'Recevez des rappels opportuns pour les échéances à venir et les tâches importantes.'}
            </p>
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

export default Home;
