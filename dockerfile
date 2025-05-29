FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV PORT=3001
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV PORT=3001
EXPOSE 3001
CMD ["npm", "start"]