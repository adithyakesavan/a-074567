
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskCount = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user', user.id);
        
        if (error) throw error;
        setTaskCount(count || 0);
      } catch (error) {
        console.error('Error fetching task count:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch your task count',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTaskCount();
  }, [user, toast]);

  if (!user) {
    navigate('/login');
    return null;
  }

  // Get user initials for avatar
  const userEmail = user.email || '';
  const initials = userEmail.split('@')[0].charAt(0).toUpperCase() + 
                 (userEmail.split('@')[0].split('.')[1]?.charAt(0).toUpperCase() || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 mb-6 text-dashboard-accent2 hover:text-dashboard-accent2/80"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8">User Profile</h1>

        <Card className="bg-dashboard-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar className="w-16 h-16 bg-dashboard-accent1">
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl">{userEmail.split('@')[0].replace('.', ' ')}</h2>
                <p className="text-dashboard-muted">{user.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-dashboard-muted mb-1">User ID</h3>
                <p className="font-mono text-sm truncate" title={user.id}>{user.id}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-dashboard-muted mb-1">Total Tasks</h3>
                <p className="text-2xl font-bold">
                  {loading ? '...' : taskCount}
                </p>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-dashboard-muted mb-1">Last Sign In</h3>
              <p>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Not available'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
