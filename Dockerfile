# 依赖阶段
FROM alpine:3.20 AS deps
ENV NODE_VERSION 20.18.3
RUN apk add --no-cache nodejs-current npm

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

# 构建阶段
FROM alpine:3.20 AS builder
ENV NODE_VERSION 20.18.3
RUN apk add --no-cache nodejs-current npm
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 构建应用
RUN npm run build

# 生产阶段
FROM alpine:3.20 AS runner
ENV NODE_VERSION 20.18.3
RUN apk add --no-cache nodejs-current postgresql-client

WORKDIR /app

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制等待脚本并设置权限
COPY docker/wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# 只复制必要的文件
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置权限
RUN chown -R nextjs:nodejs .

USER nextjs

# 暴露3000端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]