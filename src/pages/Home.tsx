
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckSquare className="w-10 h-10 text-primary" />
              <h1 className="text-3xl font-bold">Task Tracker</h1>
            </div>
            
            <h2 className="mt-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Manage your tasks with ease
            </h2>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay organized, meet deadlines, and achieve your goals with our simple yet powerful task management solution.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/auth">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/about">Learn More</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Simple Task Management</h3>
              <p className="text-muted-foreground">
                Create, organize, and track your tasks in a clean and intuitive interface.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Deadline Tracking</h3>
              <p className="text-muted-foreground">
                Set due dates and priorities to ensure you never miss an important deadline.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Performance Insights</h3>
              <p className="text-muted-foreground">
                Visualize your productivity trends and task completion rates over time.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Task Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
