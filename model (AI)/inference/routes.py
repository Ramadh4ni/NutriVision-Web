from fastapi import APIRouter, UploadFile, File
from PIL import Image
import io

from inference.predictor import predict_and_generate

router = APIRouter()


@router.post("/analyze-food")
async def analyze_food(file: UploadFile = File(...)):

    image = Image.open(io.BytesIO(await file.read()))

    result = predict_and_generate(image)

    return result