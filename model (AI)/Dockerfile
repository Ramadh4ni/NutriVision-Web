FROM python:3.10-slim

# Set working directory
WORKDIR /code

# Copy requirements file first to leverage Docker cache
COPY requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy application files
COPY . /code

# Set permissions (required for Hugging Face Spaces environment)
RUN chmod -R 777 /code

# Expose the port HF Spaces expects (7860)
EXPOSE 7860

# Run the FastAPI server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
