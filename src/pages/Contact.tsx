
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Lightbulb, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

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
            onClick={() => navigate('/about')}
          >
            About
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
              <p className="text-gray-300 mb-8">
                Have questions, feedback, or need assistance with Task Tracker? 
                We're here to help! Fill out the form or use our contact information below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-dashboard-accent1 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-300">adithyak3108@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-dashboard-accent2 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-300">+91 8667403113</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-dashboard-accent3 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-300">59,Subramaniya Udaiyar st,</p>
                    <p className="text-gray-300">Telunguplayam,coimbatore</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-6">Send a Feedback</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="bg-white/10 border-white/20" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="bg-white/10 border-white/20" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    className="bg-white/10 border-white/20" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    className="bg-white/10 border-white/20 min-h-[120px]" 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/80">
                  <Send className="w-4 h-4 mr-2" />
                  Send 
                </Button>
              </form>
            </div>
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

export default Contact;
