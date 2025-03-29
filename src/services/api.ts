
// This file serves as the frontend API service that communicates with our backend
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for our data
export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  user_id?: string;
  created_at?: string;
}

// User related API calls
export const userAPI = {
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }
      
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

// Task related API calls
export const taskAPI = {
  getAllTasks: async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as Task[];
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },
  
  createTask: async (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
  }) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          priority: taskData.priority,
          user_id: userData.user?.id,
          completed: false
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Task;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
  
  updateTask: async (
    taskId: string,
    taskData: {
      title?: string;
      description?: string;
      dueDate?: string;
      priority?: string;
      completed?: boolean;
    }
  ) => {
    try {
      // Create an object with only the fields that need updating
      const updateData: any = {};
      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate;
      if (taskData.priority !== undefined) updateData.priority = taskData.priority;
      if (taskData.completed !== undefined) updateData.completed = taskData.completed;
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Task;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },
  
  deleteTask: async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },
};
