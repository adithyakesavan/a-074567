
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Stay organized and boost your productivity
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Track your tasks, manage your time, and achieve your goals with our powerful task management platform.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <p>Simple and intuitive task management</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <p>Track progress and prioritize tasks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <p>Performance insights to optimize your workflow</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  {user ? (
                    <Button asChild size="lg" className="sm:w-auto">
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild size="lg" className="sm:w-auto">
                        <Link to="/login">Get Started</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="sm:w-auto">
                        <Link to="/about">Learn More</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="lg:w-full">
                <div className="relative overflow-hidden rounded-xl border bg-background p-2">
                  <div className="bg-accent/50 rounded-lg p-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Task Dashboard Preview</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-card rounded-md">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary/70"></div>
                            <span>Complete project proposal</span>
                          </div>
                          <span className="text-sm text-muted-foreground">Due today</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-card rounded-md">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-amber-500/70"></div>
                            <span>Team meeting prep</span>
                          </div>
                          <span className="text-sm text-muted-foreground">Tomorrow</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-card rounded-md">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500/70"></div>
                            <span>Review quarterly goals</span>
                          </div>
                          <span className="text-sm text-muted-foreground">Next week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Task Tracker. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
