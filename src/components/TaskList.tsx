
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Edit, Trash2, Search, PlusCircle, X, Save } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { v4 as uuid } from 'uuid';
import { Task, taskAPI } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Filter types for task filtering
type FilterType = 'all' | 'completed' | 'pending';

interface TaskListProps {
  filter?: FilterType;
}

const TaskList = ({ filter = 'all' }: TaskListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(filter);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    completed: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks using React Query
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskAPI.getAllTasks,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: {
      title: string;
      description: string;
      dueDate: string;
      priority: string;
    }) => taskAPI.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsAddTaskDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        completed: false,
      });
      toast({
        title: "Task added",
        description: `"${newTask.title}" has been added to your tasks`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add task: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({taskId, taskData}: {
      taskId: string,
      taskData: {
        title?: string;
        description?: string;
        dueDate?: string;
        priority?: string;
        completed?: boolean;
      }
    }) => taskAPI.updateTask(taskId, taskData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      setEditForm({});
      toast({
        title: "Task updated",
        description: `"${data.title}" has been updated`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskAPI.deleteTask(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      const taskToDelete = tasks.find(task => task.id === taskId);
      toast({
        title: "Task deleted",
        description: `"${taskToDelete?.title}" has been removed`,
        variant: "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete task: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle task completion toggle
  const handleToggleComplete = (taskId: string, currentCompleted: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    updateTaskMutation.mutate({
      taskId,
      taskData: { completed: !currentCompleted }
    });
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };
  
  // Handle edit task
  const handleEditClick = (task: Task) => {
    setEditingTask(task.id);
    setEditForm({ ...task });
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({});
  };
  
  // Handle save edit
  const handleSaveEdit = (taskId: string) => {
    if (!editForm.title || !editForm.description || !editForm.due_date || !editForm.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    updateTaskMutation.mutate({
      taskId,
      taskData: {
        title: editForm.title,
        description: editForm.description,
        dueDate: editForm.due_date,
        priority: editForm.priority as 'low' | 'medium' | 'high',
        completed: editForm.completed
      }
    });
  };

  // Handle add task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.description || !newTask.due_date || !newTask.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate({
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.due_date,
      priority: newTask.priority as string,
    });
  };

  // Filter tasks based on active filter
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter === 'completed') {
      return filtered.filter(task => task.completed);
    } else if (activeFilter === 'pending') {
      return filtered.filter(task => !task.completed);
    }
    
    return filtered;
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredTasks = getFilteredTasks();
  
  React.useEffect(() => {
    setActiveFilter(filter);
  }, [filter]);

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">Tasks</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              className="pl-8 w-64 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="flex items-center gap-2 bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
            onClick={() => setIsAddTaskDialogOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          className={activeFilter === 'all' ? 'bg-dashboard-accent2' : 'bg-transparent'}
          onClick={() => setActiveFilter('all')}
        >
          All Tasks
        </Button>
        <Button
          variant={activeFilter === 'completed' ? 'default' : 'outline'}
          className={activeFilter === 'completed' ? 'bg-dashboard-accent3' : 'bg-transparent'}
          onClick={() => setActiveFilter('completed')}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Completed
        </Button>
        <Button
          variant={activeFilter === 'pending' ? 'default' : 'outline'}
          className={activeFilter === 'pending' ? 'bg-dashboard-accent1' : 'bg-transparent'}
          onClick={() => setActiveFilter('pending')}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-400">Loading tasks...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to load tasks. Please try again later.
        </div>
      ) : (
        <div className="rounded-md border border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5 hover:bg-white/10">
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id, task.completed)}
                      />
                    </TableCell>
                    <TableCell>
                      {editingTask === task.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="bg-white/10 border-white/20"
                            placeholder="Task title"
                          />
                          <Input
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="bg-white/10 border-white/20"
                            placeholder="Task description"
                          />
                        </div>
                      ) : (
                        <>
                          <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-400 line-clamp-1">{task.description}</div>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask === task.id ? (
                        <select
                          value={editForm.priority}
                          onChange={(e) => setEditForm({ 
                            ...editForm, 
                            priority: e.target.value as 'low' | 'medium' | 'high' 
                          })}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask === task.id ? (
                        <Input
                          type="datetime-local"
                          value={editForm.due_date?.slice(0, 16)}
                          onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                          className="bg-white/10 border-white/20"
                        />
                      ) : (
                        formatDate(task.due_date)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingTask === task.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-green-500 hover:text-green-600"
                            onClick={() => handleSaveEdit(task.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditClick(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No tasks found. Create a new task to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Title
              </Label>
              <Input
                id="task-title"
                placeholder="Task title"
                className="col-span-3"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-description" className="text-right">
                Description
              </Label>
              <Input
                id="task-description"
                placeholder="Task description"
                className="col-span-3"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-due-date" className="text-right">
                Due Date
              </Label>
              <Input
                id="task-due-date"
                type="datetime-local"
                className="col-span-3"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-priority" className="text-right">
                Priority
              </Label>
              <select
                id="task-priority"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newTask.priority as string}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80">
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
