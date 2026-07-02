# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend and combine
FROM python:3.12-slim
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ backend/

# Ensure uploads directory exists
RUN mkdir -p uploads

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/dist

# Set environment variables
ENV PYTHONPATH=/app
ENV DATA_DIR=/data

# Expose the API port
EXPOSE 8000

# Run the app
CMD ["python", "backend/run.py"]
