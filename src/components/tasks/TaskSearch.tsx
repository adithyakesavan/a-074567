
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Task } from '@/types/database';

interface TaskSearchProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: Task[] | null;
  onSearchResults: (results: Task[]) => void;
  clearSearchResults: () => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const TaskSearch: React.FC<TaskSearchProps> = ({
  searchQuery,
  onSearchQueryChange,
  searchResults,
  onSearchResults,
  clearSearchResults,
  isSearching,
  setIsSearching
}) => {
  return (
    <div className="mb-6 space-y-4">
      <SearchBar onSearchResults={onSearchResults} setIsLoading={setIsSearching} />
      
      <div className="relative flex items-center">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Filter tasks by keyword..."
          className="pl-8 bg-transparent"
          value={searchQuery}
          onChange={(e) => {
            onSearchQueryChange(e.target.value);
            if (searchResults) onSearchResults(null);
          }}
        />
      </div>
      
      {searchResults && (
        <div className="flex items-center justify-between bg-white/10 p-2 rounded">
          <span className="text-sm text-gray-300">
            Showing AI search results ({searchResults.length} tasks)
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearSearchResults}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        </div>
      )}
      
      {isSearching && (
        <div className="text-center py-2 text-gray-400">
          Searching with AI...
        </div>
      )}
    </div>
  );
};

export default TaskSearch;
