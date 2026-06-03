import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, Camera } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import RecipeCard from '../../components/cards/RecipeCard';
import { recipes } from '../../data/recipes';
import { useRecipe } from '../../context/RecipeContext';

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'saved', label: 'Saved' },
  { id: 'completed', label: 'Completed' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'calories-high', label: 'Highest Calories' },
  { id: 'calories-low', label: 'Lowest Calories' },
  { id: 'protein-high', label: 'Highest Protein' },
  { id: 'carbs-high', label: 'Highest Carbs' },
];


export default function Recipe() {
  const navigate = useNavigate();
  const { history, savedRecipes, completedRecipes, viewRecipe, toggleSave, toggleComplete } = useRecipe();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('newest');
  const [sortAscending, setSortAscending] = useState(false);

  const historyEntries = Object.values(history);

  const featuredEntry = historyEntries.length > 0
    ? historyEntries.reduce((best, curr) =>
        curr.lastActivity > best.lastActivity ? curr : best
      )
    : null;

  const searched = historyEntries.filter((entry) => {
    const recipe = recipes.find((r) => r.id === entry.recipeId);
    if (!recipe) return false;
    return (
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const tabFiltered = searched.filter((entry) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'saved') return savedRecipes.includes(entry.recipeId);
    if (activeFilter === 'completed') return completedRecipes.includes(entry.recipeId);
    return true;
  });

  const sorted = [...tabFiltered].sort((a, b) => {
    const asc = sortAscending ? 1 : -1;
    if (activeSort === 'newest') return (b.lastActivity - a.lastActivity) * asc;
    if (activeSort === 'oldest') return (a.lastActivity - b.lastActivity) * asc;
    const recA = recipes.find((r) => r.id === a.recipeId) || {};
    const recB = recipes.find((r) => r.id === b.recipeId) || {};
    if (activeSort === 'calories-high') return (recB.calories - recA.calories) * asc;
    if (activeSort === 'calories-low') return (recA.calories - recB.calories) * asc;
    if (activeSort === 'protein-high') return ((recB.protein || 0) - (recA.protein || 0)) * asc;
    if (activeSort === 'carbs-high') return ((recB.carbs || 0) - (recA.carbs || 0)) * asc;
    return 0;
  });

  const handleRecipeClick = (entry) => {
    viewRecipe(entry.recipeId);
    navigate(`/recipe/${entry.recipeId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">

        <div>
          <p
            className="text-xs font-semibold uppercase"
            style={{ color: '#16A34A', letterSpacing: '0.12em' }}
          >
            Recipes
          </p>
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            style={{ color: '#1E293B', letterSpacing: '-0.02em' }}
          >
            Recipe
          </h2>
        </div>

        {historyEntries.length === 0 ? (
          /* First-time user empty state */
          <div
            className="bg-white rounded-2xl p-10 text-center"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#F0FDF4' }}
            >
              <Camera className="w-7 h-7" style={{ color: '#16A34A' }} />
            </div>
            <h3 className="text-base font-semibold mb-2" style={{ color: '#1E293B' }}>
              No recipe activity yet
            </h3>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              Browse recipes, save your favorites, and track meals you have cooked.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/scan-food')}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#006D37' }}
              >
                Scan Food
              </button>
              <button
                onClick={() => navigate('/recipes')}
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#F8FAFC', color: '#64748B', border: '1.5px solid #E2E8F0' }}
              >
                Browse Recipes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select
                    value={activeSort}
                    onChange={(e) => setActiveSort(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => setSortAscending((v) => !v)}
                  className="p-2.5 h-[44px] w-[44px] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title={sortAscending ? 'Ascending' : 'Descending'}
                >
                  <ArrowUpDown
                    className={`w-4 h-4 ${sortAscending ? 'text-emerald-600 rotate-180' : 'text-gray-500'}`}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

                        <div className="flex gap-2 flex-wrap">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

                        <div>
              {sorted.length === 0 ? (
                <div
                  className="bg-white rounded-2xl p-10 text-center"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: '#F0FDF4' }}
                  >
                    <Camera className="w-7 h-7" style={{ color: '#16A34A' }} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#1E293B' }}>
                    {activeFilter === 'saved'
                      ? 'No saved recipes yet'
                      : activeFilter === 'completed'
                      ? 'No completed recipes yet'
                      : 'No recipes in your history yet'}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                    {searchQuery
                      ? 'Try adjusting your search.'
                      : activeFilter === 'saved'
                      ? 'Save recipes from the recipe guide or detail page.'
                      : activeFilter === 'completed'
                      ? 'Mark recipes as cooked to see them here.'
                      : 'Interact with recipes to populate this section.'}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => navigate('/scan-food')}
                      className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#006D37' }}
                    >
                      Scan Food
                    </button>
                    <button
                      onClick={() => navigate('/recipes')}
                      className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: '#F8FAFC', color: '#64748B', border: '1.5px solid #E2E8F0' }}
                    >
                      Browse Recipes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeFilter === 'all'
                        ? 'All Recipes'
                        : activeFilter === 'completed'
                        ? 'Completed'
                        : 'Saved'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {sorted.length} recipe{sorted.length === 1 ? '' : 's'} found
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {sorted.map((entry) => {
                      const recipe = recipes.find((r) => r.id === entry.recipeId);
                      if (!recipe) return null;

                      return (
                        <div key={entry.recipeId} className="relative">
                          <RecipeCard
                            title={recipe.title}
                            description={recipe.description}
                            mealType={recipe.badge || recipe.category}
                            prepTime={recipe.prepTime}
                            calories={recipe.calories}
                            protein={recipe.protein}
                            carbs={recipe.carbs}
                            recipeId={entry.recipeId}
                            isSaved={savedRecipes.includes(entry.recipeId)}
                            isCompleted={completedRecipes.includes(entry.recipeId)}
                            onSave={() => toggleSave(entry.recipeId)}
                            onComplete={() => toggleComplete(entry.recipeId)}
                            onClick={() => handleRecipeClick(entry)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}