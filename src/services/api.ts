
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
    // Use a type cast for the entire query chain
    const response = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (response.error) throw response.error;
    return response.data as Profile;
  },
  
  updateProfile: async (userId: string, updates: { username?: string; avatar_url?: string }) => {
    // Use a type cast for the entire query chain
    const response = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (response.error) throw response.error;
    return response.data as Profile;
  }
};

// Task related API calls
export const taskAPI = {
  getAllTasks: async () => {
    // Use a type cast for the entire query chain
    const response = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (response.error) throw response.error;
    return response.data as Task[];
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
    
    // Use a type cast for the entire query chain
    const response = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: user.user.id,
        completed: false
      })
      .select()
      .single();
    
    if (response.error) throw response.error;
    return response.data as Task;
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
    // Use a type cast for the entire query chain
    const response = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', taskId)
      .select()
      .single();
    
    if (response.error) throw response.error;
    return response.data as Task;
  },
  
  deleteTask: async (taskId: string) => {
    // Use a type cast for the entire query chain
    const response = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (response.error) throw response.error;
    return { success: true };
  },
};
