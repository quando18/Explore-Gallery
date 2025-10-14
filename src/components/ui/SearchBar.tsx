'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { useAutocomplete } from '@/hooks/useItems';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search images, designs, or creators...",
  className 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const { suggestions, isLoading } = useAutocomplete(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search with 300ms delay
  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onChange(searchValue);
      onSearch(searchValue);
    }, 300);
  }, [onChange, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    setShowSuggestions(newValue.length >= 2);
    debouncedSearch(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-2xl", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={internalValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              if (value.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "pl-10 pr-20 h-12 text-base",
              isFocused && "ring-2 ring-primary"
            )}
            aria-label="Search"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            role="combobox"
          />
          
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-12 h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 h-8 w-8"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion: string, index: number) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none first:rounded-t-md last:rounded-b-md"
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={false}
            >
              <div className="flex items-center">
                <Search className="h-3 w-3 mr-3 text-muted-foreground" />
                {suggestion}
              </div>
            </button>
          ))}
          
          {isLoading && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              Loading suggestions...
            </div>
          )}
        </div>
      )}
    </div>
  );
}