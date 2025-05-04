# Stage 1: Build React app
FROM node:18-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine AS production
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/build .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
