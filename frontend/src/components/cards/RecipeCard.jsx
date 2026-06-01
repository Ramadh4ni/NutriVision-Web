import { Clock, Flame, Bookmark, Check } from 'lucide-react';

export default function RecipeCard({
  title,
  description,
  mealType,
  prepTime,
  calories,
  protein,
  carbs,
  recipeId,
  isSaved,
  isCompleted,
  onSave,
  onComplete,
  onClick,
}) {
  const handleSave = (e) => {
    e.stopPropagation();
    onSave?.();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col"
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          {mealType && (
            <span
              className="inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full leading-none"
              style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
            >
              {mealType}
            </span>
          )}
          <button
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ml-auto ${
              isSaved
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={handleSave}
          >
            <Bookmark
              className={`w-4 h-4 transition-colors duration-200 ${
                isSaved ? 'text-white fill-white' : 'text-gray-500'
              }`}
            />
          </button>
        </div>

        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
          {description}
        </p>

        <div className="flex-1" />

        <div className="flex flex-wrap gap-1.5 mb-4">
          {protein && (
            <span
              className="px-2 py-0.5 text-[11px] font-medium rounded-full leading-none"
              style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}
            >
              {protein}g Protein
            </span>
          )}
          {carbs && (
            <span
              className="px-2 py-0.5 text-[11px] font-medium rounded-full leading-none"
              style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}
            >
              {carbs}g Carbs
            </span>
          )}
          <span
            className="px-2 py-0.5 text-[11px] font-medium rounded-full leading-none flex items-center gap-1"
            style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}
          >
            <Flame className="w-3 h-3" />
            {calories} kcal
          </span>
          {isCompleted && (
            <span
              className="px-2 py-0.5 text-[11px] font-semibold rounded-full flex items-center gap-1 leading-none"
              style={{ backgroundColor: '#ECFDF5', color: '#16A34A' }}
            >
              <Check className="w-3 h-3" />
              Cooked
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{prepTime}</span>
          </div>
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete?.();
              }}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Mark as cooked
            </button>
          )}
          {isCompleted && (
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Cooked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
