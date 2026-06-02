from recommendation import generate_recipe

dummy_labels = [
    "ayam",
    "cabai",
    "bawang merah"
]

result = generate_recipe(dummy_labels)

print(result)