from fastapi import FastAPI
from inference.routes import router

app = FastAPI(
    title="NutriVision AI Service",
    version="1.0"
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "NutriVision AI Running"
    }