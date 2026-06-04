const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api/v1";

const STORAGE_KEYS = {
  accessToken: "nutrivision_access_token",
  refreshToken: "nutrivision_refresh_token",
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function setSessionTokens(tokens) {
  if (tokens?.accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
  }

  if (tokens?.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
  }
}

export function clearSessionTokens() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
}

async function request(endpoint, options = {}) {
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  const requestHeaders = { ...headers };
  const accessToken = getAccessToken();

  if (accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const fetchOptions = {
    method,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    if (isFormData) {
      fetchOptions.body = body;
    } else {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
  const responseText = await response.text();

  let payload = null;

  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = {
        success: response.ok,
        message: responseText,
      };
    }
  }

  if (!response.ok) {
    const error = new Error(
      payload?.message || `Request failed with status ${response.status}.`,
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function register(body) {
  return request("/auth/register", {
    method: "POST",
    body,
  });
}

export function login(body) {
  return request("/auth/login", {
    method: "POST",
    body,
  });
}

export function loginGoogle(body) {
  // body can be { credential } (GSI token) or { email, fullName, googleId } (legacy)
  return request("/auth/google", {
    method: "POST",
    body,
  });
}

export function getMe() {
  return request("/auth/me");
}

export function refreshSession(refreshToken = getRefreshToken()) {
  return request("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
    body: { refreshToken: getRefreshToken() },
  });
}

export function saveOnboarding(body) {
  return request("/onboarding", {
    method: "POST",
    body,
  });
}

export function getDashboard() {
  return request("/dashboard");
}

export function scanFood(file, notes = "Uploaded from frontend") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("notes", notes);

  return request("/scan-food", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export function recommendRecipes(body = {}) {
  return request("/recipes/recommend", {
    method: "POST",
    body,
  });
}

export function getRecipeHistory() {
  return request("/recipes/history");
}

export function saveRecipe(recipeId) {
  return request(`/recipes/${recipeId}/favorite`, {
    method: "POST",
  });
}

export function unsaveRecipe(recipeId) {
  return request(`/recipes/${recipeId}/favorite`, {
    method: "DELETE",
  });
}

export function markRecipeCooked(recipeId) {
  return request(`/recipes/${recipeId}/cooked`, {
    method: "PATCH",
  });
}

export function updateAccountProfile(body) {
  return request("/account/profile", {
    method: "PATCH",
    body,
  });
}

export function updateAccountPassword(body) {
  return request("/account/password", {
    method: "PATCH",
    body,
  });
}

function normalizeEnum(value) {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function titleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildMacroCards(nutrition) {
  const calories = Number(nutrition.calories || 0);
  const protein = Number(nutrition.protein || 0);
  const carbs = Number(nutrition.carbs || 0);
  const fat = Number(nutrition.fat || 0);

  return [
    {
      label: "Protein",
      value: protein,
      max: 60,
      unit: "g",
      color: "#3B82F6",
      ring: "#BFDBFE",
    },
    {
      label: "Carbohydrates",
      value: carbs,
      max: 80,
      unit: "g",
      color: "#A855F7",
      ring: "#E9D5FF",
    },
    {
      label: "Fat",
      value: fat,
      max: 40,
      unit: "g",
      color: "#F59E0B",
      ring: "#FDE68A",
    },
    {
      label: "Calories",
      value: calories,
      max: 800,
      unit: "kcal",
      color: "#F97316",
      ring: "#FED7AA",
    },
  ];
}

function mapIngredients(ingredients) {
  return (ingredients || []).map((ingredient) => {
    if (typeof ingredient === "string") {
      return {
        name: titleCase(ingredient),
        amount: "-",
      };
    }

    return {
      name: ingredient.name || titleCase(String(ingredient)),
      amount: ingredient.amount || "-",
    };
  });
}

function mapSteps(instructions) {
  return (instructions || []).map((instruction, index) => {
    const description = String(instruction || "").trim();
    const shortTitle = description.split(".")[0]?.trim();

    return {
      step: index + 1,
      title: shortTitle || `Step ${index + 1}`,
      description: description || `Complete step ${index + 1}.`,
    };
  });
}

export function mapRecipeFromApi(recipe) {
  const nutrition = recipe?.nutritionJson || {};
  const tags = Array.isArray(recipe?.tags) ? recipe.tags : [];
  const sourceFlags = new Set(
    String(recipe?.source || "")
      .split("|")
      .filter(Boolean),
  );
  const category =
    titleCase(
      tags.find((tag) => !["cutting", "maintenance", "bulking"].includes(tag)),
    ) || "Personalized";
  const ingredients = mapIngredients(recipe?.ingredients);

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    category,
    badge: tags.length > 0 ? titleCase(tags[0]) : category,
    prepTime: `${Math.max(15, ingredients.length * 5)} min`,
    difficulty: ingredients.length > 5 ? "Medium" : "Easy",
    ingredients,
    steps: mapSteps(recipe?.instructions),
    macros: buildMacroCards(nutrition),
    calories: Number(nutrition.calories || 0),
    protein: Number(nutrition.protein || 0),
    carbs: Number(nutrition.carbs || 0),
    fat: Number(nutrition.fat || 0),
    isSaved: sourceFlags.has("favorite:true"),
    isCompleted: sourceFlags.has("cooked:true"),
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    raw: recipe,
  };
}

export function mapProfileFromApi(profile, user = null) {
  return {
    fullName: user?.fullName || "",
    email: user?.email || "",
    age: profile?.age ? String(profile.age) : "",
    gender: normalizeEnum(profile?.gender),
    weight: profile?.weightKg ? String(profile.weightKg) : "",
    height: profile?.heightCm ? String(profile.heightCm) : "",
    goal: normalizeEnum(profile?.goal),
    activityLevel: normalizeEnum(profile?.activityLevel),
  };
}

export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("blob:") ||
    pathOrUrl.startsWith("data:")
  ) {
    return pathOrUrl;
  }
  const filename = pathOrUrl.split(/[/\\]/).pop();
  const baseUrl = API_BASE_URL.replace("/api/v1", "");
  return `${baseUrl}/uploads/${filename}`;
}
