FROM node:20-alpine

WORKDIR /app

# 安装postgresql-client
RUN apk add --no-cache postgresql-client

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 生成Prisma客户端和构建应用
RUN npx prisma generate && npm run build

# 设置默认的PostgreSQL环境变量
ENV POSTGRES_DB=pocket_ledger \
    POSTGRES_USER=pocket_ledger \
    POSTGRES_PASSWORD=pocket_ledger_pass

EXPOSE 3000

# 默认命令（可以被docker-compose.yaml覆盖）
CMD ["node", "server.js"]