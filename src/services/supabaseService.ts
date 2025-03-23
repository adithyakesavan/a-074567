
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Task } from '@/types/database';
import { toast } from '@/hooks/use-toast';

// Task related functions
export const taskService = {
  // Fetch all tasks for current user
  getAllTasks: async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      return tasks || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  },
  
  // Create a new task
  createTask: async (taskData: {
    title: string;
    description: string;
    due_date: string;
    priority: string;
    user_id: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Create notification for new task
      await notificationService.createNotification({
        user_id: taskData.user_id,
        type: 'task_created',
        message: `New task created: ${taskData.title}`,
        task_id: data.id
      });
      
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  // Update a task
  updateTask: async (
    taskId: string,
    taskData: {
      title?: string;
      description?: string;
      due_date?: string;
      priority?: string;
      completed?: boolean;
    },
    userId: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Create notification for task update if completion status changed
      if (taskData.completed !== undefined) {
        await notificationService.createNotification({
          user_id: userId,
          type: taskData.completed ? 'task_completed' : 'task_reopened',
          message: taskData.completed 
            ? `Task completed: ${data.title}` 
            : `Task reopened: ${data.title}`,
          task_id: taskId
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  // Delete a task
  deleteTask: async (taskId: string, userId: string, taskTitle: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Create notification for deleted task
      await notificationService.createNotification({
        user_id: userId,
        type: 'task_deleted',
        message: `Task deleted: ${taskTitle}`,
        task_id: null
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }
};

// Notification related functions
export const notificationService = {
  // Create a new notification
  createNotification: async (notificationData: {
    user_id: string;
    type: string;
    message: string;
    task_id: string | null;
  }) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },
  
  // Fetch all notifications for current user
  getAllNotifications: async (userId: string) => {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  
  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }
};
