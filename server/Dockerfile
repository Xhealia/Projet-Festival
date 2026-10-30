FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production PORT=3001 UPLOAD_DIR=/data/uploads
EXPOSE 3001
CMD node src/index.js