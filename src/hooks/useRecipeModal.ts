import { useState, useCallback } from 'react';
import { OptionFaitMaison } from '../types';

export const useRecipeModal = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<OptionFaitMaison | null>(null);

  const openRecipe = useCallback((recipe: OptionFaitMaison) => {
    setSelectedRecipe(recipe);
  }, []);

  const closeRecipe = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  return {
    selectedRecipe,
    openRecipe,
    closeRecipe
  };
};
