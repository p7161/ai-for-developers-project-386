# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ENV VITE_USE_MOCK=false
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE ${PORT:-3000}

CMD ["node", "backend/src/index.js"]
