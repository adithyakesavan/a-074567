
export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
  priority: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  email_id: string | null;
  user_id: string;
  category_id?: string | null;
}

export interface Notification {
  id: string;
  message: string;
  task_id: string | null;
  status: string;
  created_at: string;
  email_id: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
