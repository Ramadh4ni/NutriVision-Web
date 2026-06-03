def build_prompt(labels):
    bahan = ", ".join(labels)

    prompt = f"""
    Buat rekomendasi resep makanan berdasarkan bahan berikut:
    {bahan}

    Gunakan Bahasa Indonesia.

    Jawab HANYA dengan JSON valid.
    Jangan gunakan markdown.
    Jangan tambahkan penjelasan lain.

    Gunakan struktur berikut:

    {{
      "recipe_name": "",
      "category": "",
      "tags": [],
      "time_minutes": 0,
      "difficulty": "",
      "rating": 0,
      "nutrition": {{
        "calories": 0,
        "protein": "",
        "carbs": "",
        "fats": ""
      }},
      "ingredients": [
        {{
          "name": "",
          "amount": ""
        }}
      ],
      "steps": [
        {{
          "step": 1,
          "title": "",
          "description": "",
          "tip": ""
        }}
      ]
    }}
    """

    return prompt