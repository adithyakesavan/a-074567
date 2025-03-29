
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare } from 'lucide-react';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <header className="p-4 flex justify-center">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Task Tracker</h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <AuthForm />
      </main>
    </div>
  );
};

export default Auth;
