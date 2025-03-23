
export interface Task {
  id: string;
  title: string;
  description: string;
  user: string;  // User ID from auth.users
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}
