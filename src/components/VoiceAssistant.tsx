
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Play } from 'lucide-react';
import { Task } from '@/types/task';
import { formatDistanceToNow, isToday, isTomorrow, format } from 'date-fns';

interface VoiceAssistantProps {
  tasks: Task[];
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ tasks }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  
  useEffect(() => {
    // Generate the summary text for tasks
    if (tasks.length === 0) {
      setSpeechText("You don't have any tasks scheduled yet. Click the plus button to add a new task.");
      return;
    }
    
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length === 0) {
      setSpeechText("Great job! You've completed all your tasks.");
      return;
    }
    
    const todayTasks = incompleteTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isToday(taskDate);
    });
    
    const tomorrowTasks = incompleteTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isTomorrow(taskDate);
    });
    
    const urgentTasks = incompleteTasks.filter(task => task.priority === 'high');
    
    // Build the speech text
    let summary = "Here's your task summary: ";
    
    if (todayTasks.length > 0) {
      summary += `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} scheduled for today. `;
      if (todayTasks.length <= 3) {
        todayTasks.forEach((task, index) => {
          summary += `${index === 0 ? '' : ', '} ${task.title} due at ${task.dueTime}`;
        });
        summary += ". ";
      } else {
        const highPriorityToday = todayTasks.filter(task => task.priority === 'high');
        if (highPriorityToday.length > 0) {
          summary += `Including ${highPriorityToday.length} high priority task${highPriorityToday.length > 1 ? 's' : ''}. `;
        }
      }
    } else {
      summary += "You don't have any tasks scheduled for today. ";
    }
    
    if (tomorrowTasks.length > 0) {
      summary += `For tomorrow, you have ${tomorrowTasks.length} task${tomorrowTasks.length > 1 ? 's' : ''} planned. `;
    }
    
    if (urgentTasks.length > 0) {
      summary += `You have ${urgentTasks.length} high-priority task${urgentTasks.length > 1 ? 's' : ''} that need attention. `;
      
      // Add details for the most urgent task
      if (urgentTasks.length > 0) {
        const mostUrgent = urgentTasks.sort((a, b) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )[0];
        
        summary += `Most urgent is "${mostUrgent.title}" due ${formatDistanceToNow(new Date(mostUrgent.dueDate))} from now. `;
        
        if (mostUrgent.requirements) {
          summary += `You'll need: ${mostUrgent.requirements}. `;
        }
      }
    }
    
    // Add a motivational message
    const motivationalMessages = [
      "You're making great progress!",
      "Keep up the good work!",
      "Stay focused, you've got this!",
      "One task at a time leads to success!",
      "Remember to take breaks when needed."
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    summary += randomMessage;
    
    setSpeechText(summary);
  }, [tasks]);
  
  const speakSummary = () => {
    if (!speechText) return;
    
    const utterance = new SpeechSynthesisUtterance(speechText);
    window.speechSynthesis.speak(utterance);
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-teal-300">Voice Assistant</h2>
      <div className="text-sm text-gray-200 mb-4">{speechText}</div>
      <Button 
        onClick={speakSummary} 
        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
      >
        <Play className="mr-2 h-4 w-4" /> Speak Task Summary
      </Button>
    </div>
  );
};

export default VoiceAssistant;
