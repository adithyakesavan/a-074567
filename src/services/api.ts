
import { supabase } from "@/integrations/supabase/client";
import { Task, Profile } from "@/types";

// User related API calls
export const userAPI = {
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  getProfile: async (userId: string) => {
    // Using type assertion to work around Supabase type issues
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },
  
  updateProfile: async (userId: string, updates: { username?: string; avatar_url?: string }) => {
    // Using type assertion to work around Supabase type issues
    const { data, error } = await supabase
      .from('profiles' as any)
      .update(updates as any)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }
};

// Task related API calls
export const taskAPI = {
  getAllTasks: async () => {
    // Using type assertion to work around Supabase type issues
    const { data, error } = await supabase
      .from('tasks' as any)
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
    
    // Using type assertion to work around Supabase type issues
    const { data, error } = await supabase
      .from('tasks' as any)
      .insert({
        ...taskData,
        user_id: user.user.id,
        completed: false
      } as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
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
    // Using type assertion to work around Supabase type issues
    const { data, error } = await supabase
      .from('tasks' as any)
      .update(taskData as any)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  },
  
  deleteTask: async (taskId: string) => {
    // Using type assertion to work around Supabase type issues
    const { error } = await supabase
      .from('tasks' as any)
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
    return { success: true };
  },
};
