FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
COPY index.html /app/public/index.html
EXPOSE 8080
CMD ["npm", "start"]
