
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import Performance from "./pages/Performance";

const queryClient = new QueryClient();

// Simple auth check function
const isAuthenticated = () => localStorage.getItem('isLoggedIn') === 'true';

// Initialize language if not set
const initializeLanguage = () => {
  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'en');
  }
};

// Initialize userName from email if not set
const initializeUserName = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  
  if (isLoggedIn && userEmail && !localStorage.getItem('userName')) {
    const userName = userEmail.split('@')[0].replace('.', ' ');
    localStorage.setItem('userName', userName);
  }
};

const App = () => {
  // Initialize app settings
  useEffect(() => {
    initializeLanguage();
    initializeUserName();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="task-tracker-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
