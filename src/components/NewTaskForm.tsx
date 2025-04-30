
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Task } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';

interface NewTaskFormProps {
  onAddTask: (task: Task) => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [requirements, setRequirements] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    if (!dueDate) return;
    
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      dueTime: dueTime || '23:59',
      requirements: requirements.trim(),
      completed: false,
      notified: false,
      createdAt: new Date().toISOString(),
    };
    
    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setDueTime('');
    setRequirements('');
  };
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-white">Task Title*</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          className="mt-1 bg-white/20 border-white/30 placeholder-gray-300 text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
          className="mt-1 bg-white/20 border-white/30 placeholder-gray-300 text-white"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate" className="text-white">Due Date*</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            required
            className="mt-1 bg-white/20 border-white/30 text-white"
          />
        </div>
        <div>
          <Label htmlFor="dueTime" className="text-white">Due Time</Label>
          <Input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="mt-1 bg-white/20 border-white/30 text-white"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-white">Priority Level</Label>
        <RadioGroup 
          defaultValue="medium" 
          value={priority} 
          onValueChange={(val) => setPriority(val as 'low' | 'medium' | 'high')}
          className="flex mt-2"
        >
          <div className="flex items-center space-x-2 mr-4">
            <RadioGroupItem value="low" id="low" className="text-green-500 border-green-500" />
            <Label htmlFor="low" className="text-green-300">Low</Label>
          </div>
          <div className="flex items-center space-x-2 mr-4">
            <RadioGroupItem value="medium" id="medium" className="text-amber-500 border-amber-500" />
            <Label htmlFor="medium" className="text-amber-300">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" className="text-red-500 border-red-500" />
            <Label htmlFor="high" className="text-red-300">High</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="requirements" className="text-white">Requirements/Resources</Label>
        <Input
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="What do you need for this task?"
          className="mt-1 bg-white/20 border-white/30 placeholder-gray-300 text-white"
        />
      </div>
      
      <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
        Add Task
      </Button>
    </form>
  );
};

export default NewTaskForm;
