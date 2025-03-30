
import React, { useState } from 'react';
import { Clock, CheckCircle, Edit, Trash2, Search, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// Define the Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create project proposal',
    description: 'Draft a detailed proposal for the new client project',
    dueDate: '2025-01-15T14:00',
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    title: 'Review team performance',
    description: 'Conduct quarterly performance reviews for team members',
    dueDate: '2025-01-20T10:00',
    priority: 'medium',
    completed: true,
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Update the user manual with the latest features',
    dueDate: '2025-01-18T16:30',
    priority: 'low',
    completed: false,
  },
];

// Filter types for task filtering
type FilterType = 'all' | 'completed' | 'pending';

interface TaskListProps {
  filter?: FilterType;
}

const TaskList = ({ filter = 'all' }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(filter);

  // Handle task completion toggle
  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
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
          <Button className="flex items-center gap-2 bg-dashboard-accent1 hover:bg-dashboard-accent1/80">
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
                      onCheckedChange={() => handleToggleComplete(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-400 line-clamp-1">{task.description}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(task.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
    </div>
  );
};

export default TaskList;
