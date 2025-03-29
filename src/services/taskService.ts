
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}

export const taskService = {
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
      return [];
    }
    
    return data as Task[];
  },
  
  async createTask(task: CreateTaskInput) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
      throw error;
    }
    
    toast.success('Task created successfully');
    return data as Task;
  },
  
  async updateTask({ id, ...task }: UpdateTaskInput) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...task, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
      throw error;
    }
    
    toast.success('Task updated successfully');
    return data as Task;
  },
  
  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
      throw error;
    }
    
    toast.success('Task deleted successfully');
    return true;
  },
  
  async toggleTaskCompletion(id: string, completed: boolean) {
    return this.updateTask({ id, completed });
  }
};
