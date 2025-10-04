FROM node:20-bookworm-slim AS base
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY docs ./docs
COPY server ./server
COPY netlify ./netlify
COPY build-v2.js ./build-v2.js

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["npm", "start"]
