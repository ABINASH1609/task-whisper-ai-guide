
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  dueTime: string;
  requirements: string;
  completed: boolean;
  notified: boolean;
  createdAt: string;
}
