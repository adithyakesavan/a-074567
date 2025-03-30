
import { Book, CheckSquare, Clock, ListTodo } from "lucide-react";

const AboutSection = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">About Task Tracker</h1>
        <p className="text-dashboard-muted">Learn how to use this application to manage your tasks efficiently</p>
      </header>

      <div className="space-y-8">
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-5 h-5 text-dashboard-accent2" />
            <h2 className="text-xl font-medium">Welcome to Task Tracker</h2>
          </div>
          <p className="text-dashboard-text mb-4">
            Task Tracker is a powerful application designed to help you organize your daily tasks, 
            set priorities, and track your progress. This guide will help you understand how to use 
            the application effectively.
          </p>
          <div className="aspect-video rounded-lg bg-white/5 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2069" 
              alt="Task management dashboard" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-4">
              <ListTodo className="w-5 h-5 text-dashboard-accent1" />
              <h2 className="text-xl font-medium">Creating Tasks</h2>
            </div>
            <ol className="list-decimal list-inside space-y-3 text-dashboard-text">
              <li>Click the <span className="bg-dashboard-accent1 text-white px-2 py-1 rounded text-xs">Add Task</span> button</li>
              <li>Fill in the task details including title, description, and due date</li>
              <li>Select a priority level (low, medium, high)</li>
              <li>Click Save to create your new task</li>
            </ol>
            <div className="mt-4 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070" 
                alt="Creating a new task" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-4">
              <CheckSquare className="w-5 h-5 text-dashboard-accent3" />
              <h2 className="text-xl font-medium">Managing Tasks</h2>
            </div>
            <ul className="list-disc list-inside space-y-3 text-dashboard-text">
              <li>Check the checkbox to mark tasks as completed</li>
              <li>Use the filter buttons to view All, Completed, or Pending tasks</li>
              <li>Edit tasks by clicking the edit icon</li>
              <li>Delete tasks with the trash icon</li>
              <li>Search for specific tasks using the search bar</li>
            </ul>
            <div className="mt-4 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072" 
                alt="Managing tasks" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-medium">Task Prioritization</h2>
          </div>
          <p className="text-dashboard-text mb-4">
            Tasks are color-coded by priority to help you focus on what matters most:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 glass-card">
              <span className="px-2 py-1 rounded-full text-xs text-red-500">High</span>
              <p className="mt-2 text-sm">Urgent tasks that need immediate attention</p>
            </div>
            <div className="p-4 glass-card">
              <span className="px-2 py-1 rounded-full text-xs text-yellow-500">Medium</span>
              <p className="mt-2 text-sm">Important tasks with moderate urgency</p>
            </div>
            <div className="p-4 glass-card">
              <span className="px-2 py-1 rounded-full text-xs text-green-500">Low</span>
              <p className="mt-2 text-sm">Tasks that can be completed when time permits</p>
            </div>
          </div>
          <p className="text-dashboard-text">
            Organize your day by focusing on high-priority tasks first, then moving to medium and low-priority items.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutSection;
