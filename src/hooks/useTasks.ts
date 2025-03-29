
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, CreateTaskInput, UpdateTaskInput } from '@/services/taskService';

export function useTasks() {
  const queryClient = useQueryClient();
  
  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });
  
  const createTaskMutation = useMutation({
    mutationFn: (task: CreateTaskInput) => taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: (task: UpdateTaskInput) => taskService.updateTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  const toggleTaskCompletionMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      taskService.toggleTaskCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    toggleTaskCompletion: toggleTaskCompletionMutation.mutate,
  };
}
