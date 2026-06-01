import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import RecipeCard from '../../components/cards/RecipeCard';
import { Search, Clock, Flame, ArrowUpDown } from 'lucide-react';
import { recipes } from '../../data/recipes';
import { useRecipe } from '../../context/RecipeContext';

const sortOptions = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'calories-high', label: 'Highest Calories' },
  { id: 'calories-low', label: 'Lowest Calories' },
  { id: 'protein-high', label: 'Highest Protein' },
  { id: 'carbs-high', label: 'Highest Carbs' },
];

export default function RecipeGuide() {
  const navigate = useNavigate();
  const { savedRecipes, completedRecipes, toggleSave, toggleComplete, viewRecipe } = useRecipe();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('newest');
  const [sortAscending, setSortAscending] = useState(false);

  const filteredRecipes = recipes
    .filter((r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const asc = sortAscending ? 1 : -1;
      switch (activeSort) {
        case 'calories-high': return (b.calories - a.calories) * asc;
        case 'calories-low': return (a.calories - b.calories) * asc;
        case 'protein-high': return (b.protein - a.protein) * asc;
        case 'carbs-high': return (b.carbs - a.carbs) * asc;
        default: return 0;
      }
    });

  const handleRecipeClick = (recipe) => {
    viewRecipe(recipe.id);
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

                <div>
          <p
            className="text-xs font-semibold uppercase"
            style={{ color: '#16A34A', letterSpacing: '0.12em' }}
          >
            Recipe Library
          </p>
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            style={{ color: '#1E293B', letterSpacing: '-0.02em' }}
          >
            Browse Recipes
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Discover healthy meals tailored for your goals
          </p>
        </div>

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
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
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

                {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                isCompleted={completedRecipes.includes(recipe.id)}
                onSave={() => toggleSave(recipe.id)}
                onComplete={() => toggleComplete(recipe.id)}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
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
              No recipes found
            </h3>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Upload your first food image to get personalized recipe recommendations.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/scan-food')}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#006D37' }}
              >
                Upload Food
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}