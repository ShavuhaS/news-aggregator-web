# Етап 1: Збірка
FROM node:22-alpine AS build

# Встановлюємо pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копіюємо файли залежностей
COPY package.json pnpm-lock.yaml ./

# Встановлюємо залежності
RUN pnpm install --frozen-lockfile

# Копіюємо вихідний код
COPY . .

# Передаємо змінні оточення для Vite (можна перевизначити через --build-arg)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Збірка проєкту
RUN pnpm build

# Етап 2: Роздача статики
FROM nginx:alpine

# Копіюємо конфігурацію Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копіюємо зібрані файли з першого етапу
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
