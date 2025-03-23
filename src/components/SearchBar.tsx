
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Task } from '@/types/database';

interface SearchBarProps {
  onSearchResults: (tasks: Task[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults, setIsLoading }) => {
  const [query, setQuery] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Log what's being sent to the function
      console.log('Sending to task-search:', { query, userId: user.id });
      
      const { data, error } = await supabase.functions.invoke('task-search', {
        body: { query, userId: user.id },
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      console.log('Search response:', data);

      if (data && data.tasks && Array.isArray(data.tasks)) {
        onSearchResults(data.tasks);
        
        if (data.tasks.length === 0) {
          toast({
            title: "No results",
            description: "No tasks match your search query",
          });
        } else {
          toast({
            title: "Search complete",
            description: `Found ${data.tasks.length} matching tasks`,
          });
        }
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error.message || "An error occurred while searching",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks using AI..."
            className="pl-8 bg-transparent w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80">
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
