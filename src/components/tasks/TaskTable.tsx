
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TaskItem from './TaskItem';
import { Task } from '@/types/database';

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  editingTask: string | null;
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

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading,
  editingTask,
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
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingTask === task.id}
                editForm={editForm}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onEditClick={onEditClick}
                onCancelEdit={onCancelEdit}
                onSaveEdit={onSaveEdit}
                onEditFormChange={onEditFormChange}
                formatDate={formatDate}
                getPriorityColor={getPriorityColor}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                {isLoading ? 'Loading tasks...' : 'No tasks found. Create a new task to get started.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
