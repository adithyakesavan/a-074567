
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/services/supabaseService';
import { useAuth } from '@/context/AuthContext';
import { Task } from '@/types/database';
import NewTaskForm from './NewTaskForm';
import TaskFilters, { FilterType } from './tasks/TaskFilters';
import TaskSearch from './tasks/TaskSearch';
import TaskTable from './tasks/TaskTable';
import { formatDate, getPriorityColor } from '@/utils/taskUtils';

interface TaskListProps {
  filter?: FilterType;
}

const TaskList = ({ filter = 'all' }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(filter);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});
  const [searchResults, setSearchResults] = useState<Task[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const fetchedTasks = await taskService.getAllTasks();
        const formattedTasks: Task[] = fetchedTasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          user_id: task.user_id,
          due_date: task.due_date,
          priority: task.priority as 'low' | 'medium' | 'high',
          completed: task.completed,
          created_at: task.created_at
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tasks. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user, toast]);

  // Handle task completion toggle
  const handleToggleComplete = async (taskId: string) => {
    if (!user) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = await taskService.updateTask(
      taskId, 
      { completed: !task.completed },
      user.id
    );
    
    if (updatedTask) {
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
      
      toast({
        title: task.completed ? "Task unmarked" : "Task completed",
        description: `"${task.title}" ${task.completed ? "is now active" : "has been completed"}`
      });
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;
    
    const success = await taskService.deleteTask(taskId, user.id, taskToDelete.title);
    
    if (success) {
      setTasks(tasks.filter((task) => task.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed`,
        variant: "destructive"
      });
    }
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
  const handleSaveEdit = async (taskId: string) => {
    if (!user) return;
    
    if (!editForm.title || !editForm.description || !editForm.due_date || !editForm.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const updatedTask = await taskService.updateTask(
      taskId,
      {
        title: editForm.title,
        description: editForm.description,
        due_date: editForm.due_date,
        priority: editForm.priority as 'low' | 'medium' | 'high',
      },
      user.id
    );
    
    if (updatedTask) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              title: editForm.title!,
              description: editForm.description!,
              due_date: editForm.due_date!,
              priority: editForm.priority as 'low' | 'medium' | 'high'
            } 
          : task
      ));
      
      setEditingTask(null);
      setEditForm({});
      
      toast({
        title: "Task updated",
        description: `"${editForm.title}" has been updated`
      });
    }
  };

  // Handle adding a new task
  const handleAddTask = async (newTask: Omit<Task, 'id' | 'user_id'>) => {
    if (!user) return;
    
    const taskToCreate = {
      title: newTask.title,
      description: newTask.description,
      due_date: newTask.due_date,
      priority: newTask.priority,
      user_id: user.id,
    };
    
    const createdTask = await taskService.createTask(taskToCreate);
    
    if (createdTask) {
      const formattedTask: Task = {
        id: createdTask.id,
        title: createdTask.title,
        description: createdTask.description,
        user_id: createdTask.user_id,
        due_date: createdTask.due_date,
        priority: createdTask.priority as 'low' | 'medium' | 'high',
        completed: createdTask.completed
      };
      
      setTasks([...tasks, formattedTask]);
      
      toast({
        title: "Task created",
        description: `"${createdTask.title}" has been added`
      });
    }
  };

  // Handle search results
  const handleSearchResults = (results: Task[] | null) => {
    setSearchResults(results);
  };

  // Handle clearing search results
  const clearSearchResults = () => {
    setSearchResults(null);
  };

  // Filter tasks based on active filter
  const getFilteredTasks = () => {
    let filtered = searchResults || tasks;
    
    if (searchQuery && !searchResults) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (activeFilter === 'completed') {
      return filtered.filter(task => task.completed);
    } else if (activeFilter === 'pending') {
      return filtered.filter(task => !task.completed);
    }
    
    return filtered;
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
          <Button 
            className="flex items-center gap-2 bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
            onClick={() => setIsNewTaskOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* New Task Dialog */}
      <NewTaskForm 
        open={isNewTaskOpen} 
        onOpenChange={setIsNewTaskOpen}
        onTaskCreate={handleAddTask}
      />

      <TaskSearch 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchResults={searchResults}
        onSearchResults={handleSearchResults}
        clearSearchResults={clearSearchResults}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />

      <TaskFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          Loading tasks...
        </div>
      ) : (
        <TaskTable 
          tasks={filteredTasks}
          isLoading={isLoading}
          editingTask={editingTask}
          editForm={editForm}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          onEditFormChange={setEditForm}
          formatDate={formatDate}
          getPriorityColor={getPriorityColor}
        />
      )}
    </div>
  );
};

export default TaskList;
