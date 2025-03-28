
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types";

// User related API calls
export const userAPI = {
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateProfile: async (userId: string, updates: { username?: string; avatar_url?: string }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Task related API calls
export const taskAPI = {
  getAllTasks: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Task[];
  },
  
  createTask: async (taskData: {
    title: string;
    description: string;
    due_date: string;
    priority: string;
  }) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: user.user.id,
        completed: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateTask: async (
    taskId: string,
    taskData: {
      title?: string;
      description?: string;
      due_date?: string;
      priority?: string;
      completed?: boolean;
    }
  ) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  deleteTask: async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
    return { success: true };
  },
};
