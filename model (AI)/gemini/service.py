import json
import inspect
import google.api_core.exceptions
from pydantic import BaseModel, Field
from typing import List
from gemini.config import model

# =====================================================
# SCHEMA VALIDATION (Struktur Data Output)
# =====================================================
class Nutrition(BaseModel):
    calories: int = Field(..., description="Estimasi total kalori dalam kcal")
    protein: int = Field(..., description="Estimasi protein dalam gram")
    carbs: int = Field(..., description="Estimasi karbohidrat dalam gram")
    fat: int = Field(..., description="Estimasi lemak dalam gram")

class RecipeItem(BaseModel):
    title: str = Field(..., description="Nama resep makanan sehat khas Indonesia")
    description: str = Field(..., description="Deskripsi singkat keunggulan gizi resep")
    ingredients: List[str] = Field(..., description="Daftar bahan baku beserta takaran kasarnya")
    instructions: List[str] = Field(..., description="Langkah pembuatan berurutan")
    tags: List[str] = Field(..., description="Kategori masakan (cth: Tumis, Kukus, Tinggi Protein)")
    nutrition: Nutrition

class FoodAnalysisResponse(BaseModel):
    recipes: List[RecipeItem] = Field(..., description="Harus berisi tepat 8 resep masakan sehat yang berbeda")


# =====================================================
# CORE FUNCTION
# =====================================================
def generate_food_analysis(ingredients: list) -> dict:
    ingredients_text = ", ".join(ingredients)

    # Menggunakan inspect.cleandoc untuk menghapus whitespaces/indentasi yang memakan token input
    prompt = inspect.cleandoc(f"""
        SYSTEM ROLE:
        Kamu adalah AI Food Intelligence System untuk aplikasi NutriVision. Bertindaklah sebagai ahli gizi klinis dan chef profesional makanan sehat.
        
        TUGAS UTAMA:
        Analisis bahan makanan mentah berikut: [{ingredients_text}].
        Hasilkan tepat 8 variasi resep makanan sehat khas rumahan Indonesia (seperti metode rebus, tumis, panggang, atau kukus) yang realistis untuk dikonsumsi sehari-hari.
        
        ATURAN KUALITAS:
        - WAJIB menghasilkan 8 resep unik (tidak boleh kurang atau lebih).
        - Fokus pada hidangan seimbang, rendah minyak, dan rendah gula.
        - Gunakan Bahasa Indonesia yang natural, rapi, dan menggugah selera.
    """)

    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.4,  # Diturunkan sedikit lagi ke 0.4 agar model lebih patuh pada instruksi jumlah (8 resep)
                "top_p": 0.9,
                "response_mime_type": "application/json",
                "response_schema": FoodAnalysisResponse,
            }
        )
        
        # response.text dijamin bersih dari markdown block ```json karena menggunakan response_schema
        return json.loads(response.text)

    except google.api_core.exceptions.ResourceExhausted as e:
        print(f"⚠️ Quota Terbatas / Rate Limit Tercapai: {e}")
        # Fallback response instan tanpa merusak struktur data di sisi Express.js/Frontend
        return {
            "recipes": [
                {
                    "title": f"Tumis {ingredients[0].capitalize() if ingredients else 'Bahan'} Sehat Simpel",
                    "description": "Layanan AI sedang sibuk (Quota Limit). Ini adalah rekomendasi otomatis sistem.",
                    "ingredients": ingredients if ingredients else ["Bahan dasar makanan"],
                    "instructions": ["Cuci bersih semua bahan baku.", "Tumis dengan sedikit minyak zaitun.", "Sajikan selagi hangat."],
                    "tags": ["Sistem Sibuk", "Sehat", "Tumis"],
                    "nutrition": {"calories": 150, "protein": 5, "carbs": 10, "fat": 3}
                }
            ],
            "note": "Kuota harian API lokal habis. Silakan coba kembali dalam beberapa saat."
        }
        
    except Exception as e:
        print(f"❌ Terjadi kesalahan pada system server AI: {e}")
        return {
            "recipes": [],
            "error": "Gagal memproses data makanan.",
            "details": str(e)
        }