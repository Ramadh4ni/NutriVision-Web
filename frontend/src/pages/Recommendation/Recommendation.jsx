import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Search } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ScanPreview from "../../components/scan/ScanPreview";
import ScanFoodModal from "../../components/scan/ScanFoodModal";
import RecipeCard from "../../components/cards/RecipeCard";
import { useScan } from "../../context/ScanContext";
import { useRecipe } from "../../context/RecipeContext";
import { useAuth } from "../../context/AuthContext";

export default function Recommendation() {
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { lastScan } = useScan();
  const { profile, refreshUserData } = useAuth();
  const {
    recipes,
    recipesLoading,
    viewRecipe,
    savedRecipes,
    toggleSave,
    generateRecommendations,
  } = useRecipe();
  const navigate = useNavigate();
  const [generatedForScanId, setGeneratedForScanId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRecommendations() {
      if (!lastScan?.id || generatedForScanId === lastScan.id) {
        return;
      }

      setIsGenerating(true);
      setPageError("");

      try {
        await generateRecommendations(profile?.goal, lastScan.id);
        await refreshUserData();
        if (isMounted) {
          setGeneratedForScanId(lastScan.id);
        }
      } catch (error) {
        if (isMounted) {
          setPageError(error.payload?.message || error.message);
        }
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    }

    void loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [
    generateRecommendations,
    generatedForScanId,
    lastScan?.id,
    profile?.goal,
  ]);

  const filteredRecipes = recipes
    .filter((r) => {
      if (lastScan?.id && r.raw?.scanId !== lastScan.id) {
        return false;
      }
      return (
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .slice(0, 8);

  const handleRecipeClick = (recipe) => {
    viewRecipe(recipe.id);
    navigate(`/recipe/${recipe.id}`);
  };

  const hasScan = !!lastScan;
  const detectedIngredients = lastScan?.ingredients || [];
  const detectedFoodName = lastScan?.foodName || "";

  return (
    <DashboardLayout>
      <ScanFoodModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
      />

      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6">
          <div className="flex-1">
            <span
              className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full mb-3 lg:mb-4"
              style={{ backgroundColor: "#ECFDF5", color: "#16A34A" }}
            >
              AI INGREDIENT ANALYSIS
            </span>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
              style={{ color: "#1E293B" }}
            >
              Ingredient Scan Results
            </h1>
            <p className="text-sm sm:text-base" style={{ color: "#64748B" }}>
              {hasScan
                ? "Personalized recipe recommendations based on your ingredient scan."
                : "Upload an ingredient photo to get started."}
            </p>
          </div>
          <div className="lg:shrink-0 lg:w-auto">
            <ScanPreview
              scan={lastScan}
              onScanAgain={() => setScanModalOpen(true)}
            />
          </div>
        </div>

        {hasScan && detectedIngredients.length > 0 && (
          <div
            className="bg-white rounded-3xl p-6 lg:p-8"
            style={{
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              border: "1px solid #F1F5F9",
            }}
          >
            <div className="mb-4">
              <h2
                className="text-base font-semibold mb-1"
                style={{ color: "#1E293B" }}
              >
                Detected Ingredients
              </h2>
              <p className="text-sm" style={{ color: "#64748B" }}>
                {detectedFoodName
                  ? `Based on: ${detectedFoodName}`
                  : "Ingredients identified from your scan"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {detectedIngredients.map((ingredient, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: "#F0FDF4", color: "#15803D" }}
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {!hasScan && (
          <div
            className="bg-white rounded-3xl p-10 text-center"
            style={{
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              border: "1px solid #F1F5F9",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              <Camera className="w-7 h-7" style={{ color: "#16A34A" }} />
            </div>
            <h3
              className="text-base font-semibold mb-2"
              style={{ color: "#1E293B" }}
            >
              No scan result available
            </h3>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
              Upload an ingredient photo to receive personalized recipe
              recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setScanModalOpen(true)}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#006D37" }}
              >
                Scan Food
              </button>
              <button
                onClick={() => navigate("/scan-food")}
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#F8FAFC",
                  color: "#64748B",
                  border: "1.5px solid #E2E8F0",
                }}
              >
                Go to Scan Page
              </button>
            </div>
          </div>
        )}

        {hasScan && (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: "#1E293B" }}
                  >
                    Recommended Recipes
                  </h2>
                  <p className="text-sm" style={{ color: "#64748B" }}>
                    Recipes matched to your detected ingredients
                  </p>
                  {detectedFoodName && (
                    <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                      For {detectedFoodName}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative mb-4 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                />
              </div>
            </div>

            {pageError && (
              <div
                className="rounded-2xl px-4 py-3 text-sm"
                style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                }}
              >
                {pageError}
              </div>
            )}

            {(isGenerating || recipesLoading) && (
              <div
                className="bg-white rounded-2xl p-8 text-center"
                style={{ border: "1px solid #F1F5F9" }}
              >
                <p className="text-sm" style={{ color: "#64748B" }}>
                  Generating recipe recommendations from your latest scan...
                </p>
              </div>
            )}

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    mealType={recipe.badge || recipe.category}
                    prepTime={recipe.prepTime}
                    calories={recipe.calories}
                    protein={recipe.protein}
                    carbs={recipe.carbs}
                    recipeId={recipe.id}
                    isSaved={savedRecipes.includes(recipe.id)}
                    onSave={() => toggleSave(recipe.id)}
                    onClick={() => handleRecipeClick(recipe)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl p-8 text-center"
                style={{ border: "1px solid #F1F5F9" }}
              >
                <p className="text-sm" style={{ color: "#64748B" }}>
                  {searchQuery
                    ? "No recipes match your search. Try different keywords."
                    : "No recommendations are available yet. Try scanning another meal."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
