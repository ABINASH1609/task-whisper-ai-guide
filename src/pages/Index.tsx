
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import TaskList from '@/components/TaskList';
import NewTaskForm from '@/components/NewTaskForm';
import VoiceAssistant from '@/components/VoiceAssistant';
import { Task } from '@/types/task';
import { formatDistanceToNow } from 'date-fns';
import { TaskService } from '@/services/TaskService';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const savedTasks = TaskService.getAllTasks();
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    // Filter tasks based on selected filter
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setFilteredTasks(tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }));
    } else if (filter === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setFilteredTasks(tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() > today.getTime();
      }));
    } else if (filter === 'completed') {
      setFilteredTasks(tasks.filter(task => task.completed));
    }
  }, [tasks, filter]);

  useEffect(() => {
    // Check for approaching due dates and notify
    const checkDueDates = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.completed) return;
        
        const dueDate = new Date(task.dueDate);
        const timeUntilDue = dueDate.getTime() - now.getTime();
        
        // If due in less than an hour and not notified yet
        if (timeUntilDue > 0 && timeUntilDue <= 3600000 && !task.notified) {
          toast({
            title: "Task Reminder",
            description: `"${task.title}" is due in ${formatDistanceToNow(dueDate)}`,
            duration: 5000,
          });
          
          // If voice is enabled, speak the reminder
          if (isVoiceEnabled) {
            const message = `Reminder: Your task ${task.title} is due in ${formatDistanceToNow(dueDate)}`;
            const utterance = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.speak(utterance);
          }
          
          // Mark as notified
          TaskService.updateTask({
            ...task,
            notified: true
          });
        }
      });
    };
    
    // Check due dates every minute
    const intervalId = setInterval(checkDueDates, 60000);
    return () => clearInterval(intervalId);
  }, [tasks, toast, isVoiceEnabled]);

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    TaskService.addTask(newTask);
    
    toast({
      title: "Task Added",
      description: "Your new task has been created successfully",
    });

    if (isVoiceEnabled) {
      const message = `New task added: ${newTask.title}, due ${formatDistanceToNow(new Date(newTask.dueDate))} from now`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updated = { ...task, completed: !task.completed };
        TaskService.updateTask(updated);
        return updated;
      }
      return task;
    });
    setTasks(updatedTasks);
    
    const completedTask = updatedTasks.find(t => t.id === taskId);
    if (completedTask?.completed && isVoiceEnabled) {
      const message = `Great job! Task "${completedTask.title}" marked as complete.`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    TaskService.deleteTask(taskId);
    
    toast({
      title: "Task Deleted",
      description: "The task has been removed",
    });
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    toast({
      title: `Voice Assistant ${!isVoiceEnabled ? 'Enabled' : 'Disabled'}`,
      description: `Voice guidance is now ${!isVoiceEnabled ? 'on' : 'off'}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-300">
            Task Whisperer
          </h1>
          <p className="text-purple-200 mb-4">Your AI-powered task assistant</p>
          <Button 
            onClick={toggleVoice} 
            variant={isVoiceEnabled ? "default" : "outline"}
            className={`${isVoiceEnabled ? 'bg-teal-500 hover:bg-teal-600' : 'text-teal-400 border-teal-400'}`}
          >
            {isVoiceEnabled ? '🔊 Voice On' : '🔈 Voice Off'}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-0 shadow-xl p-5">
              <h2 className="text-xl font-bold mb-4 text-teal-300">Add New Task</h2>
              <NewTaskForm onAddTask={addTask} />
            </Card>
            
            {isVoiceEnabled && (
              <Card className="bg-white/10 backdrop-blur-md border-0 shadow-xl p-5 mt-6">
                <VoiceAssistant tasks={tasks} />
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-0 shadow-xl p-5">
              <Tabs defaultValue="all" onValueChange={setFilter}>
                <TabsList className="grid grid-cols-4 mb-4 bg-white/20">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <TaskList 
                    tasks={filteredTasks} 
                    onToggleCompletion={toggleTaskCompletion}
                    onDeleteTask={deleteTask}
                  />
                </TabsContent>
                <TabsContent value="today" className="mt-0">
                  <TaskList 
                    tasks={filteredTasks} 
                    onToggleCompletion={toggleTaskCompletion}
                    onDeleteTask={deleteTask}
                  />
                </TabsContent>
                <TabsContent value="upcoming" className="mt-0">
                  <TaskList 
                    tasks={filteredTasks} 
                    onToggleCompletion={toggleTaskCompletion}
                    onDeleteTask={deleteTask}
                  />
                </TabsContent>
                <TabsContent value="completed" className="mt-0">
                  <TaskList 
                    tasks={filteredTasks} 
                    onToggleCompletion={toggleTaskCompletion}
                    onDeleteTask={deleteTask}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
