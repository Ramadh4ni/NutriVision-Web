import google.generativeai as genai
import json
from prompt import build_prompt

genai.configure(api_key="API_KEY_KAMU")
model = genai.GenerativeModel("gemini-1.5-flash")


def generate_recipe(labels):
    prompt = build_prompt(labels)
    response = model.generate_content(prompt)
    text = response.text
    data = json.loads(text)
    return data