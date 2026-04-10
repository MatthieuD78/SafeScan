import { useState, useMemo } from 'react';
import { RecallAlert } from '../types';

export const useRecallsSearch = (recalls: RecallAlert[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecalls = useMemo(() => {
    if (!searchTerm.trim()) {
      return [...recalls].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const term = searchTerm.toLowerCase();
    return recalls
      .filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.brand.toLowerCase().includes(term)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [recalls, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredRecalls
  };
};
