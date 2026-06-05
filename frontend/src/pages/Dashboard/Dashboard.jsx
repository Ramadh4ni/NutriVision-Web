import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, BookOpen, ChevronRight, Zap } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ScanFoodModal from "../../components/scan/ScanFoodModal";
import LastScanResult from "../../components/scan/LastScanResult";
import { useRecipe } from "../../context/RecipeContext";
import { useAuth } from "../../context/AuthContext";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const time = typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
  const diff = Date.now() - time;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function Dashboard() {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const navigate = useNavigate();
  const { dashboard } = useAuth();
  const { recipes } = useRecipe();

  const recentActivities = recipes.slice(0, 4);

  const handleActivityClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };
  const estimatedCalories =
    dashboard?.nutritionTarget?.estimatedDailyCalories || null;
  const stats = dashboard?.stats || {
    totalRecipesGenerated: recipes.length,
    totalFavorites: recipes.filter((recipe) => recipe.isSaved).length,
    totalCooked: recipes.filter((recipe) => recipe.isCompleted).length,
  };

  return (
    <DashboardLayout>
      <ScanFoodModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
      />

      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
          <div
            onClick={() => setIsScanModalOpen(true)}
            className="w-full rounded-2xl md:rounded-3xl p-6 md:p-7 cursor-pointer transition-all hover:opacity-90"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%), #4BCA78",
            }}
          >
            <div className="flex items-start justify-between mb-8 md:mb-10">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/15 flex items-center justify-center">
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
            <h3 className="text-xl md:text-2xl font-light mb-1 md:mb-2 text-white">
              Scan Food
            </h3>
            <p className="text-sm text-white/70">Identify macros in seconds</p>
          </div>

          <div
            className="w-full rounded-2xl md:rounded-3xl p-6 md:p-7 cursor-pointer transition-all hover:opacity-95"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="flex items-start justify-between mb-4 md:mb-5">
              <div
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
                }}
              >
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span
                className="px-2 py-0.5 md:px-2.5 md:py-0.5 text-[10px] font-bold rounded-full"
                style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
              >
                UPDATED
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1 text-slate-800">
              Recipe Guide
            </h3>
            <p
              className="text-sm mb-4 md:mb-5 leading-snug"
              style={{ color: "#94A3B8" }}
            >
              Browse healthy recipes
            </p>
            <div
              className="pt-3 md:pt-4 border-t"
              style={{ borderColor: "#F1F5F9" }}
            >
              <button
                onClick={() => navigate("/recipes")}
                className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: "#15803D" }}
              >
                Browse Library
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-start px-1 py-2">
            <h2
              className="text-xs font-semibold tracking-wider"
              style={{ color: "#64748B" }}
            >
              LAST SCAN RESULT
            </h2>
          </div>
          <LastScanResult onScanAgain={() => setIsScanModalOpen(true)} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Daily Calories",
              value: estimatedCalories ? `${estimatedCalories} kcal` : "Pending",
            },
            {
              label: "Recipes Generated",
              value: stats.totalRecipesGenerated,
            },
            {
              label: "Favorites / Cooked",
              value: `${stats.totalFavorites} / ${stats.totalCooked}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <p className="text-xs font-semibold tracking-wider mb-2" style={{ color: "#94A3B8" }}>
                {item.label.toUpperCase()}
              </p>
              <p className="text-2xl font-bold" style={{ color: "#1E293B" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 py-2">
            <h2
              className="text-xs font-semibold tracking-wider"
              style={{ color: "#64748B" }}
            >
              RECENT ACTIVITY
            </h2>
            <button
              onClick={() => navigate("/recipes")}
              className="flex items-center gap-1 text-xs font-medium tracking-wide"
              style={{ color: "#15803D" }}
            >
              View History
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentActivities.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center p-8 rounded-2xl text-center"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#F0FDF4" }}
              >
                <Zap className="w-5 h-5" style={{ color: "#16A34A" }} />
              </div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#1E293B" }}
              >
                No recent recipe activity
              </p>
              <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>
                Start exploring recipes to see your activity here.
              </p>
              <button
                onClick={() => navigate("/recipes")}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#006D37" }}
              >
                Browse Recipes
              </button>
            </div>
          ) : (
            recentActivities.map((recipe) => {
              const isCompleted = !!recipe.isCompleted;
              return (
                <div
                  key={recipe.id}
                  onClick={() => handleActivityClick(recipe.id)}
                  className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-5 py-4 rounded-2xl cursor-pointer transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#F0FDF4" }}
                    >
                      <Zap
                        className="w-4 h-4 md:w-5 md:h-5"
                        style={{ color: "#16A34A" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium leading-tight"
                        style={{ color: "#1E293B" }}
                      >
                        {recipe.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#94A3B8" }}
                      >
                        {formatRelativeTime(recipe.updatedAt || recipe.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="text-right hidden sm:block">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#64748B" }}
                      >
                        {recipe.calories} kcal
                      </p>
                      <p
                        className="text-[10px] font-medium tracking-wide"
                        style={{ color: "#94A3B8" }}
                      >
                        CALORIES
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#64748B" }}
                      >
                        {recipe.protein}g
                      </p>
                      <p
                        className="text-[10px] font-medium tracking-wide"
                        style={{ color: "#94A3B8" }}
                      >
                        PROTEIN
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#64748B" }}
                      >
                        {recipe.carbs}g
                      </p>
                      <p
                        className="text-[10px] font-medium tracking-wide"
                        style={{ color: "#94A3B8" }}
                      >
                        CARBS
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#64748B" }}
                      >
                        {recipe.fat ?? 18}g
                      </p>
                      <p
                        className="text-[10px] font-medium tracking-wide"
                        style={{ color: "#94A3B8" }}
                      >
                        FAT
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-full whitespace-nowrap"
                      style={
                        isCompleted
                          ? { backgroundColor: "#ECFDF5", color: "#16A34A" }
                          : { backgroundColor: "#FEF3C7", color: "#92400E" }
                      }
                    >
                      {isCompleted ? "Cooked" : "Not Cooked"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
