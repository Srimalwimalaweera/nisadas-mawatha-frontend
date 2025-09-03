import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const FilterContext = createContext(undefined);

const initialFilters = {
  category: 'All',
  language: 'All',
  sortBy: 'relevance',
};

export function FilterProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters(initialFilters);
  }, []);

  const value = useMemo(() => ({
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
  }), [searchQuery, filters, resetFilters]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}