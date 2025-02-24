FROM node:20-alpine
WORKDIR /app

# 设置生产环境
ENV NODE_ENV=production

# 设置PostgreSQL连接环境变量的默认值
ENV POSTGRES_DB=pocket_ledger
ENV POSTGRES_USER=pocket_ledger
ENV POSTGRES_PASSWORD=pocket_ledger_pass
ENV DATABASE_URL=postgres://pocket_ledger:pocket_ledger_pass@postgres:5432/pocket_ledger

# 安装postgresql-client
RUN apk add --no-cache postgresql-client

# 复制package文件和锁文件
COPY package*.json ./

# 只安装生产依赖
RUN npm ci --omit=dev --no-audit --prefer-offline --retry 5

# 复制构建好的文件和必要的运行时文件
COPY .next ./.next
COPY prisma ./prisma
COPY server.js ./
COPY next.config.js ./
COPY docker/wait-for-postgres.sh ./

# 确保wait-for-postgres.sh有执行权限
RUN chmod +x ./wait-for-postgres.sh

# 生成Prisma客户端
RUN npx prisma generate && \
    npm cache clean --force

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl --fail http://localhost:3000/api/health || exit 1

EXPOSE 3000
CMD [ "./wait-for-postgres.sh", "node", "server.js" ]