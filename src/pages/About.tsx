
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const About = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <CheckSquare className="w-6 h-6 text-dashboard-accent2" />
          <h1 className="text-2xl font-bold">Task Tracker</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/contact')}
          >
            Contact
          </Button>
          <div 
            className="cursor-grab active:cursor-grabbing"
            draggable
            onDragEnd={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Lightbulb className="h-5 w-5 text-yellow-300" />
          </div>
          {!localStorage.getItem('isLoggedIn') ? (
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
          )}
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About Task Tracker</h1>
          
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              Task Tracker is designed to help individuals and teams organize their work efficiently and track progress
              seamlessly. We believe in creating simple yet powerful tools that enhance productivity without overwhelming
              our users with unnecessary complexity.
            </p>
            <p className="text-gray-300">
              Our application provides intuitive task management features, progress tracking, and insightful analytics
              to help you stay on top of your responsibilities and achieve your goals.
            </p>
          </div>
          
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Intuitive task organization and prioritization</li>
              <li>Visual progress tracking with customizable metrics</li>
              <li>Performance analytics to identify productivity patterns</li>
              <li>User-friendly interface designed for efficiency</li>
              <li>Secure user authentication and data storage</li>
              <li>Responsive design for desktop and mobile devices</li>
            </ul>
          </div>
          
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-300 mb-6">
              Task Tracker is developed by a dedicated team of professionals passionate about creating
              tools that make work more manageable and enjoyable. Our diverse team brings together expertise
              in user experience design, software development, and productivity management.
            </p>
            <p className="text-gray-300">
              We are committed to continuously improving our platform based on user feedback and evolving
              needs in the world of task management.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-6 border-t border-white/10 mt-20">
        <div className="text-center text-gray-400">
          <p>Copyrights 2025. Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
