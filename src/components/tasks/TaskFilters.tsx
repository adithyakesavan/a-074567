
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';

export type FilterType = 'all' | 'completed' | 'pending';

interface TaskFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        className={activeFilter === 'all' ? 'bg-dashboard-accent2' : 'bg-transparent'}
        onClick={() => onFilterChange('all')}
      >
        All Tasks
      </Button>
      <Button
        variant={activeFilter === 'completed' ? 'default' : 'outline'}
        className={activeFilter === 'completed' ? 'bg-dashboard-accent3' : 'bg-transparent'}
        onClick={() => onFilterChange('completed')}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Completed
      </Button>
      <Button
        variant={activeFilter === 'pending' ? 'default' : 'outline'}
        className={activeFilter === 'pending' ? 'bg-dashboard-accent1' : 'bg-transparent'}
        onClick={() => onFilterChange('pending')}
      >
        <Clock className="w-4 h-4 mr-2" />
        Pending
      </Button>
    </div>
  );
};

export default TaskFilters;
