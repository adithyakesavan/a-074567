import { 
  ShoppingCart, Smartphone, Box, UserPlus, Key, Bell, Globe, 
  Shield, CheckCircle, Clock, ListTodo, User, BarChart, LogOut
} from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageContext, triggerLanguageChange } from '../App';
import MetricCard from '@/components/MetricCard';
import CustomerRequests from '@/components/CustomerRequests';
import SidePanel from '@/components/SidePanel';
import TaskList from '@/components/TaskList';
import NotificationList from '@/components/NotificationList';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [taskFilter, setTaskFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const { language, setLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Handle notification toggles
  const handleNotificationToggle = (type: string) => {
    toast({
      title: `${type} notifications enabled`,
      description: "You'll receive notifications for your tasks",
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    
    let languageName = 'English';
    if (value === 'es') languageName = 'Spanish';
    if (value === 'fr') languageName = 'French';
    
    toast({
      title: language === 'en' ? "Language changed" :
             language === 'es' ? "Idioma cambiado" :
             "Langue changée",
      description: language === 'en' ? `Interface language set to ${languageName}` :
                   language === 'es' ? `Idioma de la interfaz establecido a ${languageName}` :
                   `Langue de l'interface définie sur ${languageName}`,
    });
  };

  const handleMetricCardClick = (filter: 'all' | 'completed' | 'pending') => {
    setTaskFilter(filter);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">
                {language === 'en' ? 'Task Tracker Dashboard' : 
                 language === 'es' ? 'Panel de Control de Tareas' : 
                 'Tableau de Bord des Tâches'}
              </h1>
              <p className="text-dashboard-muted">
                {language === 'en' ? 'Manage your tasks efficiently and stay on top of your deadlines' : 
                 language === 'es' ? 'Administre sus tareas de manera eficiente y cumpla con sus fechas límite' : 
                 'Gérez vos tâches efficacement et respectez vos délais'}
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <MetricCard
                title={language === 'en' ? 'Total Tasks' : 
                      language === 'es' ? 'Tareas Totales' : 
                      'Tâches Totales'}
                value={24}
                total={24}
                color="#61AAF2"
                onClick={() => handleMetricCardClick('all')}
              />
              <MetricCard
                title={language === 'en' ? 'Completed' : 
                      language === 'es' ? 'Completadas' : 
                      'Terminées'}
                value={8}
                total={24}
                color="#7EBF8E"
                onClick={() => handleMetricCardClick('completed')}
              />
              <MetricCard
                title={language === 'en' ? 'Pending' : 
                      language === 'es' ? 'Pendientes' : 
                      'En Attente'}
                value={16}
                total={24}
                color="#8989DE"
                onClick={() => handleMetricCardClick('pending')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <TaskList filter={taskFilter} />
              </div>
              <div>
                <NotificationList />
              </div>
            </div>
          </>
        );
        
      case 'users':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">
                {language === 'en' ? 'Users' : 
                 language === 'es' ? 'Usuarios' : 
                 'Utilisateurs'}
              </h1>
              <p className="text-dashboard-muted">
                {language === 'en' ? 'Manage your users and their permissions' : 
                 language === 'es' ? 'Administre sus usuarios y sus permisos' : 
                 'Gérez vos utilisateurs et leurs permissions'}
              </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-medium">
                    {language === 'en' ? 'Active Users' : 
                     language === 'es' ? 'Usuarios Activos' : 
                     'Utilisateurs Actifs'}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">JD</div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-400">
                          {language === 'en' ? 'Administrator' : 
                           language === 'es' ? 'Administrador' : 
                           'Administrateur'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">
                        {language === 'en' ? 'Active' : 
                         language === 'es' ? 'Activo' : 
                         'Actif'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">AS</div>
                      <div>
                        <p className="font-medium">Alice Smith</p>
                        <p className="text-sm text-gray-400">
                          {language === 'en' ? 'Editor' : 
                           language === 'es' ? 'Editor' : 
                           'Éditeur'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">
                        {language === 'en' ? 'Active' : 
                         language === 'es' ? 'Activo' : 
                         'Actif'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-medium">
                    {language === 'en' ? 'Permissions' : 
                     language === 'es' ? 'Permisos' : 
                     'Permissions'}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? 'Admin Access' : 
                         language === 'es' ? 'Acceso de Administrador' : 
                         'Accès Administrateur'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'en' ? 'Full system access' : 
                         language === 'es' ? 'Acceso completo al sistema' : 
                         'Accès complet au système'}
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? 'Editor Access' : 
                         language === 'es' ? 'Acceso de Editor' : 
                         'Accès Éditeur'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'en' ? 'Content management' : 
                         language === 'es' ? 'Gestión de contenido' : 
                         'Gestion de contenu'}
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'settings':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">
                {language === 'en' ? 'Settings' : 
                 language === 'es' ? 'Configuración' : 
                 'Paramètres'}
              </h1>
              <p className="text-dashboard-muted">
                {language === 'en' ? 'Configure your application settings' : 
                 language === 'es' ? 'Configure los ajustes de su aplicación' : 
                 'Configurez les paramètres de votre application'}
              </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-medium">
                    {language === 'en' ? 'Notifications' : 
                     language === 'es' ? 'Notificaciones' : 
                     'Notifications'}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? 'Email Notifications' : 
                         language === 'es' ? 'Notificaciones por Correo' : 
                         'Notifications par Email'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'en' ? 'Receive task updates via email' : 
                         language === 'es' ? 'Recibir actualizaciones de tareas por correo' : 
                         'Recevoir les mises à jour des tâches par email'}
                      </p>
                    </div>
                    <Switch onCheckedChange={() => handleNotificationToggle('Email')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? 'Due Date Reminders' : 
                         language === 'es' ? 'Recordatorios de Fechas Límite' : 
                         'Rappels de Dates d\'Échéance'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'en' ? 'Get reminders 5 minutes before due date' : 
                         language === 'es' ? 'Recibir recordatorios 5 minutos antes de la fecha límite' : 
                         'Recevoir des rappels 5 minutes avant la date d\'échéance'}
                      </p>
                    </div>
                    <Switch onCheckedChange={() => handleNotificationToggle('Due date')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? 'Push Notifications' : 
                         language === 'es' ? 'Notificaciones Push' : 
                         'Notifications Push'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'en' ? 'Receive push notifications' : 
                         language === 'es' ? 'Recibir notificaciones push' : 
                         'Recevoir des notifications push'}
                      </p>
                    </div>
                    <Switch onCheckedChange={() => handleNotificationToggle('Push')} />
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-medium">
                    {language === 'en' ? 'Preferences' : 
                     language === 'es' ? 'Preferencias' : 
                     'Préférences'}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? 'Language' : 
                         language === 'es' ? 'Idioma' : 
                         'Langue'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'en' ? 'Select your language' : 
                         language === 'es' ? 'Seleccione su idioma' : 
                         'Sélectionnez votre langue'}
                      </p>
                    </div>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-32 bg-transparent border border-white/10">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? 'Default Task View' : 
                         language === 'es' ? 'Vista Predeterminada de Tareas' : 
                         'Vue par Défaut des Tâches'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'en' ? 'Choose default task filter' : 
                         language === 'es' ? 'Elija el filtro predeterminado de tareas' : 
                         'Choisissez le filtre par défaut des tâches'}
                      </p>
                    </div>
                    <Select value={taskFilter} onValueChange={(value: string) => setTaskFilter(value as any)}>
                      <SelectTrigger className="w-32 bg-transparent border border-white/10">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {language === 'en' ? 'All Tasks' : 
                           language === 'es' ? 'Todas las Tareas' : 
                           'Toutes les Tâches'}
                        </SelectItem>
                        <SelectItem value="pending">
                          {language === 'en' ? 'Pending Only' : 
                           language === 'es' ? 'Solo Pendientes' : 
                           'En Attente Seulement'}
                        </SelectItem>
                        <SelectItem value="completed">
                          {language === 'en' ? 'Completed Only' : 
                           language === 'es' ? 'Solo Completadas' : 
                           'Terminées Seulement'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
