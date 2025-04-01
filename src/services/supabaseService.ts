
import { supabase } from '@/integrations/supabase/client';
import { Task, Notification, Profile } from '@/types/supabase';
import { toast } from 'sonner';

// Auth functions
export const supabaseAuth = {
  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }
    return data.session;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data.user;
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }
    
    return data;
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
};

// Profile functions
export const profileService = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    return data as Profile;
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return data as Profile;
  }
};

// Tasks functions
export const taskService = {
  // Get all tasks for current user
  getTasks: async () => {
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('email_id', user.email)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    return data as unknown as Task[];
  },

  // Create a new task
  createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newTask = {
      ...task,
      email_id: user.email,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    // Create notification for new task
    try {
      await notificationService.createNotification({
        message: `You have a new task: ${task.title}`,
        task_id: data.id,
        status: 'unread',
        email_id: user.email as string
      });
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Continue even if notification fails
    }
    
    return data as unknown as Task;
  },

  // Update a task
  updateTask: async (id: string, updates: Partial<Task>) => {
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('email_id', user.email)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    
    // Create notification for task update if status changed to completed
    if (updates.completed) {
      try {
        await notificationService.createNotification({
          message: `Task completed: ${data.title}`,
          task_id: id,
          status: 'unread',
          email_id: user.email as string
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Continue even if notification fails
      }
    }
    
    return data as unknown as Task;
  },

  // Delete a task
  deleteTask: async (id: string) => {
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('email_id', user.email);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
    
    return true;
  }
};

// Notifications functions
export const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Cast notifications table name as any to work around type constraint
    const { data, error } = await supabase
      .from('notifications' as any)
      .select('*')
      .eq('email_id', user.email)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
    
    return data as unknown as Notification[];
  },

  // Create a new notification
  createNotification: async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    // Cast notifications table name as any to work around type constraint
    const { data, error } = await supabase
      .from('notifications' as any)
      .insert(notification)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
    
    return data as unknown as Notification;
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Cast notifications table name as any to work around type constraint
    const { data, error } = await supabase
      .from('notifications' as any)
      .update({ status: 'read' })
      .eq('id', id)
      .eq('email_id', user.email)
      .select()
      .single();
    
    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
    
    return data as unknown as Notification;
  },

  // Delete a notification
  deleteNotification: async (id: string) => {
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Cast notifications table name as any to work around type constraint
    const { error } = await supabase
      .from('notifications' as any)
      .delete()
      .eq('id', id)
      .eq('email_id', user.email);
    
    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
    
    return true;
  }
};
