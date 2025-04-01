
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Types
export interface Task {
  id?: string;
  email_id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at?: string;
}

export interface Notification {
  id?: string;
  email_id: string;
  task_id: string;
  message: string;
  status: string;
  created_at?: string;
}

// Authentication functions
export const supabaseAuth = {
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data?.session?.user || null;
    } catch (error: any) {
      console.error("Error getting current user:", error.message);
      return null;
    }
  },
};

// Task management functions
export const taskService = {
  createTask: async (task: Task) => {
    try {
      const { data, error } = await supabase.from('tasks').insert(task).select().single();
      
      if (error) throw error;
      
      // Create notification after task is created
      if (data) {
        await notificationService.createNotification({
          email_id: task.email_id,
          task_id: data.id,
          message: `You have a new task: ${task.title}`,
          status: 'unread'
        });
      }
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },
  
  getTasks: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('email_id', email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error fetching tasks:", error.message);
      return [];
    }
  },
  
  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },
  
  deleteTask: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },
};

// Notification management functions
export const notificationService = {
  createNotification: async (notification: Notification) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error creating notification:", error.message);
      throw error;
    }
  },
  
  getNotifications: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('email_id', email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error fetching notifications:", error.message);
      return [];
    }
  },
  
  markAsRead: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error marking notification as read:", error.message);
      throw error;
    }
  },
  
  deleteNotification: async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting notification:", error.message);
      throw error;
    }
  },
};
