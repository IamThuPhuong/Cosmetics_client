FROM node:20-alpine AS builder

WORKDIR /app

# Copy các file khai báo dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Cài đặt pnpm và dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

# Biến môi trường API URL khi build Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm run build

# Stage chạy ứng dụng
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["pnpm", "start"]