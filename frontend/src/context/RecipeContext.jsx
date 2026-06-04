import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getRecipeHistory,
  mapRecipeFromApi,
  markRecipeCooked,
  recommendRecipes,
  saveRecipe,
  unsaveRecipe,
} from "../lib/api";
import { useAuth } from "./AuthContext";

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  const { isAuthenticated, refreshUserData } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [history, setHistory] = useState({});
  const [recipesLoading, setRecipesLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      void loadRecipeHistory();
    } else {
      setRecipes([]);
      setHistory({});
    }
  }, [isAuthenticated]);

  const loadRecipeHistory = useCallback(async () => {
    setRecipesLoading(true);
    try {
      const response = await getRecipeHistory();
      const mapped = response.data.map(mapRecipeFromApi);
      const deduplicated = deduplicateRecipesByTitle(mapped);
      setRecipes(deduplicated);
      setHistory(buildHistoryMap(deduplicated));
      return deduplicated;
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  const generateRecommendations = useCallback(async (goal) => {
    const response = await recommendRecipes(goal ? { goal } : {});
    const mapped = response.data.map(mapRecipeFromApi);
    setRecipes((prev) => mergeRecipes(mapped, prev));
    setHistory((prev) => ({ ...prev, ...buildHistoryMap(mapped) }));
    return mapped;
  }, []);

  const toggleSave = useCallback(async (recipeId) => {
    const target = recipes.find((item) => item.id === recipeId);
    if (!target) return;

    if (target.isSaved) {
      await unsaveRecipe(recipeId);
    } else {
      await saveRecipe(recipeId);
    }

    await loadRecipeHistory();
    void refreshUserData();
  }, [recipes, loadRecipeHistory, refreshUserData]);

  const toggleComplete = useCallback(async (recipeId) => {
    await markRecipeCooked(recipeId);
    await loadRecipeHistory();
    void refreshUserData();
  }, [loadRecipeHistory, refreshUserData]);

  const viewRecipe = useCallback((recipeId) => {
    setHistory((prev) => ({
      ...prev,
      [recipeId]: {
        ...(prev[recipeId] || { recipeId, isSaved: false, isCompleted: false }),
        lastActivity: Date.now(),
      },
    }));
  }, []);

  const getRecipeById = useCallback(
    (id) => recipes.find((item) => item.id === id) || null,
    [recipes]
  );

  const savedRecipes = recipes.filter((item) => item.isSaved).map((item) => item.id);
  const completedRecipes = recipes
    .filter((item) => item.isCompleted)
    .map((item) => item.id);

  const value = useMemo(
    () => ({
      recipes,
      savedRecipes,
      completedRecipes,
      history,
      recipesLoading,
      refreshRecipes: loadRecipeHistory,
      generateRecommendations,
      viewRecipe,
      toggleSave,
      toggleComplete,
      getRecipeById,
    }),
    [
      recipes,
      savedRecipes,
      completedRecipes,
      history,
      recipesLoading,
      loadRecipeHistory,
      generateRecommendations,
      viewRecipe,
      toggleSave,
      toggleComplete,
      getRecipeById,
    ]
  );

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

function buildHistoryMap(recipes) {
  return recipes.reduce((accumulator, recipe) => {
    accumulator[recipe.id] = {
      recipeId: recipe.id,
      isSaved: recipe.isSaved,
      isCompleted: recipe.isCompleted,
      lastActivity: new Date(recipe.updatedAt || recipe.createdAt || Date.now()).getTime(),
    };
    return accumulator;
  }, {});
}

function deduplicateRecipesByTitle(recipesList) {
  const map = new Map();
  for (const recipe of recipesList) {
    const key = recipe.title.trim().toLowerCase();
    const existing = map.get(key);
    
    if (!existing) {
      map.set(key, recipe);
    } else {
      const dateExisting = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      const dateCurrent = new Date(recipe.updatedAt || recipe.createdAt || 0).getTime();
      
      if (dateCurrent > dateExisting) {
        map.set(key, recipe);
      } else if (dateCurrent === dateExisting) {
        // If dates are equal, prefer the one with scanId (important for recommendation linking)
        if (recipe.raw?.scanId && !existing.raw?.scanId) {
          map.set(key, recipe);
        }
      }
    }
  }
  return Array.from(map.values()).sort(
    (left, right) =>
      new Date(right.updatedAt || right.createdAt || 0).getTime() -
      new Date(left.updatedAt || left.createdAt || 0).getTime()
  );
}

function mergeRecipes(incoming, existing) {
  const combined = [...existing, ...incoming];
  return deduplicateRecipesByTitle(combined);
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within RecipeProvider");
  }
  return context;
}
