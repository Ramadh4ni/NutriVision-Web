import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import RecipeHero from "../../components/recipe-detail/RecipeHero";
import { getRecipeById } from "../../data/recipes";
import { useRecipe } from "../../context/RecipeContext";

export default function RecipeDetail() {
  const { id } = useParams();
  const { viewRecipe } = useRecipe();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const found = getRecipeById(id);
    if (found) {
      setRecipe(found);
      viewRecipe(id);
    } else {
      setRecipe(null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm" style={{ color: '#64748B' }}>
              Loading recipe...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!recipe) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-base font-semibold mb-2" style={{ color: '#1E293B' }}>
              Recipe not found
            </p>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              This recipe may no longer be available.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#006D37' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <RecipeHero recipe={recipe} />
    </DashboardLayout>
  );
}
