
export interface Task {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at?: string;
}
