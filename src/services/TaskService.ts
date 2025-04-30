
import { Task } from '@/types/task';

const TASKS_STORAGE_KEY = 'task-whisperer-tasks';

export class TaskService {
  static getAllTasks(): Task[] {
    const tasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  static getTask(id: string): Task | undefined {
    const tasks = this.getAllTasks();
    return tasks.find(task => task.id === id);
  }

  static addTask(task: Task): void {
    const tasks = this.getAllTasks();
    tasks.push(task);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }

  static updateTask(updatedTask: Task): void {
    const tasks = this.getAllTasks();
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  static deleteTask(id: string): void {
    const tasks = this.getAllTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  static getTasksByDate(date: Date): Task[] {
    const tasks = this.getAllTasks();
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate.startsWith(dateString));
  }

  static getUpcomingTasks(): Task[] {
    const tasks = this.getAllTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate.getTime() >= today.getTime();
    }).sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  static getOverdueTasks(): Task[] {
    const tasks = this.getAllTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate.getTime() < today.getTime();
    });
  }
}
