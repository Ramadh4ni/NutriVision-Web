import { Bookmark, Clock, Star, Lightbulb } from 'lucide-react';
import { useRecipe } from '../../context/RecipeContext';

export default function RecipeHero({ recipe }) {
  const { savedRecipes, completedRecipes, toggleSave, toggleComplete } = useRecipe();

  if (!recipe) return null;

  const saved = savedRecipes.includes(recipe.id);
  const isCooked = completedRecipes.includes(recipe.id);

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", width: "100%", padding: "0 40px" }}>

        {/* Category Text */}
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#16A34A",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {recipe.category}
        </p>

        {/* Title + Save Button Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 lg:gap-8">

          {/* Left: Title + Meta */}
          <div className="flex-1 lg:max-w-[820px] w-full">
            {/* Title */}
            <h1
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "clamp(28px, 4.5vw, 56px)",
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "#111827",
                marginBottom: "20px",
              }}
            >
              {recipe.title}
            </h1>

            {/* Metadata Pills */}
            <div className="flex items-center flex-wrap" style={{ gap: "8px" }}>
              <span
                className="flex items-center gap-1.5"
                style={{
                  backgroundColor: "#F3F4F5",
                  padding: "8px 14px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  color: "#16A34A",
                }}
              >
                <Clock className="w-3 h-3" strokeWidth={2} />
                {recipe.prepTime}
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{
                  backgroundColor: "#F3F4F5",
                  padding: "8px 14px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  color: "#16A34A",
                }}
              >
                {recipe.difficulty}
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{
                  backgroundColor: "#F3F4F5",
                  padding: "8px 14px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  color: "#16A34A",
                }}
              >
                <Star className="w-3 h-3" strokeWidth={2} style={{ color: "#F59E0B" }} />
                4.8
              </span>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">

            {/* Save Recipe Button */}
            <button
              onClick={() => toggleSave(recipe.id)}
              className="h-[52px] px-7 rounded-full flex items-center justify-center gap-3 w-full sm:w-auto"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "'Manrope', sans-serif",
                letterSpacing: "0.01em",
                border: saved ? "none" : "1px solid #E4E4E4",
                backgroundColor: saved ? "#16A34A" : "#F3F4F6",
                color: saved ? "#FFFFFF" : "#4B5563",
                boxShadow: saved
                  ? "0 2px 10px rgba(22, 163, 74, 0.18)"
                  : "0 2px 10px rgba(15, 23, 42, 0.04)",
                transition: "all 0.2s ease",
              }}
            >
              <Bookmark
                className="w-4 h-4"
                strokeWidth={1.75}
                style={{ fill: saved ? "#FFFFFF" : "none" }}
              />
              Save Recipe
            </button>

            {/* Cook Button */}
            <button
              onClick={() => toggleComplete(recipe.id)}
              className="w-full sm:w-[168px] h-[52px] rounded-full flex items-center justify-center"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "'Manrope', sans-serif",
                letterSpacing: "0.01em",
                border: "none",
                backgroundColor: isCooked ? "#BBF7D0" : "#16A34A",
                color: isCooked ? "#15803D" : "#FFFFFF",
                boxShadow: isCooked
                  ? "none"
                  : "0 2px 10px rgba(22, 163, 74, 0.18)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {isCooked ? "Completed" : "Cook"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #E8E8E8", marginTop: "48px" }} />

        {/* Statistics Cards Section */}
        <div style={{ marginTop: "48px" }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: "20px" }}>
            {[
              { label: "Calories", value: recipe.calories, unit: "kcal" },
              { label: "Protein", value: recipe.protein, unit: "grams" },
              { label: "Carbs", value: recipe.carbs, unit: "grams" },
              { label: "Fats", value: recipe.fat ?? 18, unit: "grams" },
            ].map((card) => (
              <div
                key={card.label}
                className="hidden md:block"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EFEFEF",
                  borderRadius: "28px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  padding: "24px 28px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#B7C3B6",
                    marginBottom: "8px",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "40px",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "#111827",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  {card.value}
                </p>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#16A34A",
                  }}
                >
                  {card.unit}
                </p>
              </div>
            ))}

            {/* Mobile: 2-column stat cards */}
            {[
              { label: "Calories", value: recipe.calories, unit: "kcal" },
              { label: "Protein", value: recipe.protein, unit: "grams" },
              { label: "Carbs", value: recipe.carbs, unit: "grams" },
              { label: "Fats", value: recipe.fat ?? 18, unit: "grams" },
            ].map((card) => (
              <div
                key={`mobile-${card.label}`}
                className="md:hidden"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EFEFEF",
                  borderRadius: "20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  padding: "20px 24px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#B7C3B6",
                    marginBottom: "6px",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "32px",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "#111827",
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}
                >
                  {card.value}
                </p>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#16A34A",
                  }}
                >
                  {card.unit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients Section */}
        <div
          className="hidden md:block"
          style={{
            backgroundColor: "#F6F7F7",
            borderRadius: "32px",
            padding: "40px 48px",
            marginTop: "48px",
          }}
        >
          {/* Header Row */}
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "22px",
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.01em",
              marginBottom: "32px",
            }}
          >
            Ingredients
          </h2>

          {/* Ingredients Grid */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 24px" }}>
            {(recipe.ingredients || []).map((ingredient) => (
              <div
                key={ingredient.name}
                className="flex items-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "18px",
                  padding: "14px 18px",
                  gap: "14px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                {/* Circle indicator */}
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "1.5px solid #E5E7EB",
                    background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#374151",
                    lineHeight: 1.4,
                  }}
                >
                  {ingredient.amount} {ingredient.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Ingredients — 1 column */}
        <div
          className="md:hidden"
          style={{
            backgroundColor: "#F6F7F7",
            borderRadius: "24px",
            padding: "24px 24px",
            marginTop: "32px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.01em",
              marginBottom: "20px",
            }}
          >
            Ingredients
          </h2>
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "10px" }}>
            {(recipe.ingredients || []).map((ingredient) => (
              <div
                key={`mob-${ingredient.name}`}
                className="flex items-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  gap: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1.5px solid #E5E7EB",
                    background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#374151",
                    lineHeight: 1.4,
                  }}
                >
                  {ingredient.amount} {ingredient.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Process Section */}
        <div
          className="hidden md:block"
          style={{
            backgroundColor: "#FFFFFF",
            padding: "48px 48px 40px",
            marginTop: "32px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "40px",
              letterSpacing: "-0.02em",
            }}
          >
            Cooking Process
          </h2>

          {/* Steps */}
          {recipe.steps.map((item, index) => (
            <div
              key={item.step}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                marginBottom: index === recipe.steps.length - 1 ? "0" : "44px",
              }}
            >
              {/* Step Number */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#EEF2EF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "3px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#16A34A",
                  }}
                >
                  {item.step}
                </span>
              </div>

              {/* Step Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.85,
                    color: "#6B7280",
                    maxWidth: "560px",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {/* Tip Box */}
          <div
            style={{
              backgroundColor: "#EEF6F1",
              borderRadius: "16px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginTop: "24px",
              maxWidth: "520px",
            }}
          >
            <Lightbulb
              className="w-3.5 h-3.5"
              style={{ color: "#16A34A", flexShrink: 0, marginTop: "2px" }}
            />
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "#4B5563",
                lineHeight: 1.6,
              }}
            >
              For best flavor, let the chicken marinate for 10–15 minutes before cooking. You can also substitute turkey breast for a lighter alternative.
            </p>
          </div>
        </div>

        {/* Mobile Cooking Process — 1 column */}
        <div
          className="md:hidden"
          style={{
            backgroundColor: "#FFFFFF",
            padding: "32px 20px 28px",
            marginTop: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "28px",
              letterSpacing: "-0.02em",
            }}
          >
            Cooking Process
          </h2>

          {recipe.steps.map((item, index) => (
            <div
              key={`mob-${item.step}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                marginBottom: index === recipe.steps.length - 1 ? "0" : "28px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#EEF2EF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#16A34A",
                  }}
                >
                  {item.step}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: 1.8,
                    color: "#6B7280",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          <div
            style={{
              backgroundColor: "#EEF6F1",
              borderRadius: "14px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginTop: "20px",
              maxWidth: "520px",
            }}
          >
            <Lightbulb
              className="w-3.5 h-3.5"
              style={{ color: "#16A34A", flexShrink: 0, marginTop: "2px" }}
            />
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "#4B5563",
                lineHeight: 1.6,
              }}
            >
              For best flavor, let the chicken marinate for 10–15 minutes before cooking.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
