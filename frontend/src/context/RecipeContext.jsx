import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const RecipeContext = createContext(null);

const RECIPE_STATUS_KEY = "nutrivision_recipe_status";

function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    console.warn(
      "[RecipeContext] Corrupted localStorage data — resetting to default.",
    );
    return fallback;
  }
}

function migrateEntry(recipeId, entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return {
      recipeId,
      isSaved: false,
      isCompleted: false,
      lastActivity: 0,
    };
  }
  return {
    recipeId,
    isSaved: false,
    isCompleted: false,
    lastActivity: 0,
    ...entry,
  };
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry === "object" &&
    !Array.isArray(entry) &&
    "recipeId" in entry
  );
}

function loadStatus(userId) {
  try {
    const raw = localStorage.getItem(RECIPE_STATUS_KEY);
    const byUser = safeParse(raw, {});
    const userEntries = byUser[userId] || {};
    const migrated = {};
    let dirty = false;
    for (const [id, entry] of Object.entries(userEntries)) {
      const valid = migrateEntry(id, entry);
      migrated[id] = valid;
      if (!isValidEntry(valid) || entry !== valid) dirty = true;
    }
    const result = { ...migrated };
    // Rewrite localStorage to clean up bad entries on next save
    if (dirty) {
      try {
        const raw2 = localStorage.getItem(RECIPE_STATUS_KEY);
        const all = safeParse(raw2, {});
        all[userId] = result;
        localStorage.setItem(RECIPE_STATUS_KEY, JSON.stringify(all));
      } catch {}
    }
    return result;
  } catch {
    return {};
  }
}

function saveStatus(userId, status) {
  try {
    const raw = localStorage.getItem(RECIPE_STATUS_KEY);
    const all = safeParse(raw, {});
    // Never store null/undefined entries
    const cleaned = {};
    for (const [id, entry] of Object.entries(status)) {
      if (isValidEntry(entry)) {
        cleaned[id] = entry;
      }
    }
    all[userId] = cleaned;
    localStorage.setItem(RECIPE_STATUS_KEY, JSON.stringify(all));
  } catch {}
}

export function RecipeProvider({ children }) {
  const { activeUserId } = useAuth();

  const [statusMap, setStatusMap] = useState(() =>
    activeUserId ? loadStatus(activeUserId) : {},
  );

  useEffect(() => {
    if (activeUserId) {
      setStatusMap(loadStatus(activeUserId));
    } else {
      setStatusMap({});
    }
  }, [activeUserId]);

  useEffect(() => {
    if (activeUserId) {
      saveStatus(activeUserId, statusMap);
    }
  }, [activeUserId, statusMap]);

  const toggleSave = useCallback(
    (recipeId) => {
      if (!activeUserId) return;
      setStatusMap((prev) => {
        const existing = prev[recipeId];
        const merged = migrateEntry(recipeId, existing);
        const updated = {
          ...merged,
          recipeId,
          isSaved: !merged.isSaved,
          lastActivity: Date.now(),
        };
        saveStatus(activeUserId, { ...prev, [recipeId]: updated });
        return { ...prev, [recipeId]: updated };
      });
    },
    [activeUserId],
  );

  const toggleComplete = useCallback(
    (recipeId) => {
      if (!activeUserId) return;
      setStatusMap((prev) => {
        const existing = prev[recipeId];
        const merged = migrateEntry(recipeId, existing);
        const updated = {
          ...merged,
          recipeId,
          isCompleted: !merged.isCompleted,
          lastActivity: Date.now(),
        };
        saveStatus(activeUserId, { ...prev, [recipeId]: updated });
        return { ...prev, [recipeId]: updated };
      });
    },
    [activeUserId],
  );

  const viewRecipe = useCallback(
    (recipeId) => {
      if (!activeUserId) return;
      setStatusMap((prev) => {
        const existing = prev[recipeId];
        const merged = migrateEntry(recipeId, existing);
        const updated = {
          ...merged,
          recipeId,
          lastActivity: Math.max(merged.lastActivity || 0, Date.now()),
        };
        return { ...prev, [recipeId]: updated };
      });
    },
    [activeUserId],
  );

  const validEntries = Object.values(statusMap).filter(isValidEntry);

  const savedRecipes = validEntries
    .filter((entry) => entry.isSaved)
    .map((entry) => entry.recipeId);

  const completedRecipes = validEntries
    .filter((entry) => entry.isCompleted)
    .map((entry) => entry.recipeId);

  return (
    <RecipeContext.Provider
      value={{
        savedRecipes,
        completedRecipes,
        history: statusMap,
        viewRecipe,
        toggleSave,
        toggleComplete,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within RecipeProvider");
  }
  return context;
}
