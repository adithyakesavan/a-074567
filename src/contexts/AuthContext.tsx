
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { supabaseAuth } from '@/services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Profile } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          // Clear profile on sign out
          setProfile(null);
          // Redirect to login page on sign out
          navigate('/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Save authentication status to localStorage for simpler checks
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', session.user.email || '');
          
          // Fetch user profile with setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
          }, 0);
          
          // Redirect to dashboard on sign in
          navigate('/dashboard');
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', session.user.email || '');
          
          // Fetch user profile
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { session } = await supabaseAuth.signIn(email, password);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Fetch user profile
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { user } = await supabaseAuth.signUp(email, password);
      
      if (user) {
        toast.success(
          'Verification email sent. Please check your email to verify your account.',
          { duration: 6000 }
        );
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(`Sign up failed: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabaseAuth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data as Profile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Profile update failed: ${error.message}`);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
