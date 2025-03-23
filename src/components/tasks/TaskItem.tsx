
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { Task } from '@/types/database';

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editForm: Partial<Task>;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditClick: (task: Task) => void;
  onCancelEdit: () => void;
  onSaveEdit: (taskId: string) => void;
  onEditFormChange: (form: Partial<Task>) => void;
  formatDate: (dateString: string) => string;
  getPriorityColor: (priority: string) => string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isEditing,
  editForm,
  onToggleComplete,
  onDeleteTask,
  onEditClick,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  formatDate,
  getPriorityColor
}) => {
  return (
    <TableRow key={task.id} className="hover:bg-white/5">
      <TableCell>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editForm.title}
              onChange={(e) => onEditFormChange({ ...editForm, title: e.target.value })}
              className="bg-white/10 border-white/20"
              placeholder="Task title"
            />
            <Input
              value={editForm.description}
              onChange={(e) => onEditFormChange({ ...editForm, description: e.target.value })}
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
        {isEditing ? (
          <select
            value={editForm.priority}
            onChange={(e) => onEditFormChange({ 
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
        {isEditing ? (
          <Input
            type="datetime-local"
            value={editForm.due_date?.slice(0, 16)}
            onChange={(e) => onEditFormChange({ ...editForm, due_date: e.target.value })}
            className="bg-white/10 border-white/20"
          />
        ) : (
          formatDate(task.due_date)
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-green-500 hover:text-green-600"
              onClick={() => onSaveEdit(task.id)}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={onCancelEdit}
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
              onClick={() => onEditClick(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => onDeleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TaskItem;
