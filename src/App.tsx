
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect, createContext, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import Performance from "./pages/Performance";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a language context
export const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {}
});

const queryClient = new QueryClient();

// Initialize language if not set
const initializeLanguage = () => {
  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'en');
  }
  return localStorage.getItem('language') || 'en';
};

// Custom event for language change
export const triggerLanguageChange = () => {
  window.dispatchEvent(new Event('languageChange'));
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/performance" element={
        <ProtectedRoute>
          <Performance />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const [language, setLanguage] = useState(initializeLanguage());
  
  // Language state setter that also updates localStorage
  const handleSetLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
    triggerLanguageChange();
  };

  // Initialize app settings
  useEffect(() => {
    initializeLanguage();
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="task-tracker-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LanguageContext.Provider>
  );
};

export default App;
