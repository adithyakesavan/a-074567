
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect, createContext, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./components/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import Performance from "./pages/Performance";

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

// Initialize userName from email if not set
const initializeUserName = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  
  if (isLoggedIn && userEmail && !localStorage.getItem('userName')) {
    const userName = userEmail.split('@')[0].replace('.', ' ');
    localStorage.setItem('userName', userName);
  }
};

// Custom event for language change
export const triggerLanguageChange = () => {
  window.dispatchEvent(new Event('languageChange'));
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
    initializeUserName();
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="task-tracker-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Protected routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Index />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/performance" element={<Performance />} />
                  </Route>
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </LanguageContext.Provider>
  );
};

export default App;
