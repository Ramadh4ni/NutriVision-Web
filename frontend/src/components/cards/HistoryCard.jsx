import { CheckCircle2, Clock, Calendar, Flame } from "lucide-react";

export default function HistoryCard({
  title,
  date,
  mealType,
  calories,
  protein,
  status = "completed",
  onClick,
}) {
  const statusConfig = {
    completed: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Completed",
    },
    analyzing: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      label: "Analyzing",
    },
    saved: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Saved",
    },
  };

  const config = statusConfig[status] || statusConfig.completed;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Content Section */}
      <div className="flex-1 min-w-0">
        {mealType && (
          <span className="inline-block mb-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full"
            style={{ backgroundColor: '#ECFDF5', color: '#16A34A' }}>
            {mealType}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1.5 leading-tight">
          {title}
        </h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{date}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Flame className="w-3.5 h-3.5 text-gray-400" />
            <span>{calories} kcal</span>
          </div>
          {protein && (
            <>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="text-gray-400 font-medium">{protein}g</span>
                <span>Protein</span>
              </div>
            </>
          )}
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bg} rounded-full`}
        >
          {status === "completed" && (
            <CheckCircle2 className={`w-3 h-3 ${config.text}`} />
          )}
          {status === "analyzing" && (
            <Clock className={`w-3 h-3 ${config.text}`} />
          )}
          <span className={`text-[11px] font-medium ${config.text}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Arrow Button */}
      <button className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors group-hover:bg-emerald-50">
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}