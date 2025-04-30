
import React from 'react';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleCompletion, onDeleteTask }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 text-gray-300">
        <p className="text-xl">No tasks found</p>
        <p className="text-sm mt-2">Add new tasks to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className={`p-4 transition-all duration-300 ${task.completed ? 'bg-white/5 opacity-70' : 'bg-white/20'}`}>
          <div className="flex items-start gap-4">
            <Checkbox 
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggleCompletion(task.id)}
              className={`mt-1 ${task.completed ? 'bg-teal-500 text-white border-teal-500' : ''}`}
            />
            <div className="flex-grow">
              <div className="flex justify-between">
                <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                  {task.title}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'text-gray-500' : 'text-gray-200'}`}>
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-gray-200 border-gray-500">
                  <Clock className="h-3 w-3" />
                  {format(new Date(`${task.dueDate}T${task.dueTime}`), 'MMM d, h:mm a')}
                </Badge>
              </div>
              {task.requirements && !task.completed && (
                <div className="mt-2 text-xs text-purple-200 bg-purple-900/30 p-2 rounded">
                  <span className="font-semibold">Requirements:</span> {task.requirements}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
