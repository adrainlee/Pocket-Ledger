# Pocket Ledger

一个使用Next.js和PostgreSQL构建的个人记账应用。

## 环境要求

- Docker (推荐 20.10.0 或更高版本)
- Docker Compose (推荐 2.0.0 或更高版本)
- Node.js (开发环境需要，推荐 20.18.3 或更高版本)
- npm (开发环境需要，推荐 9.0.0 或更高版本)

## 部署指南

### 开发环境部署

1. 克隆项目并安装依赖：
```bash
# 克隆项目
git clone <repository-url>
cd pocket-ledger

# 安装依赖
npm install
```

2. 准备环境配置：
```bash
# 复制环境配置文件
cp .env.example .env
cd docker && cp .env.example .env && cd ..

# 修改 .env 文件
# 确保 DATABASE_URL 使用 localhost 而不是 postgres：
DATABASE_URL="postgresql://pocket_ledger:pocket_ledger_pass@localhost:5432/pocket_ledger?schema=public"
```

3. 启动开发环境：
```bash
# 启动数据库（仅启动 PostgreSQL 容器）
cd docker && docker compose up -d postgres && cd ..

# 运行数据库迁移
npx prisma migrate deploy

# 启动开发服务器
npm run dev
```

4. 访问应用：
- 开发服务器：http://localhost:3000

### 生产环境部署

1. 准备生产环境配置：
```bash
# 复制生产环境配置文件
cp .env.production.example .env
cd docker && cp .env.example .env && cd ..

# 修改生产环境配置
# 在 .env 中设置：
NODE_ENV=production
DATABASE_URL="postgresql://pocket_ledger:your_secure_password@postgres:5432/pocket_ledger?schema=public"

# 在 docker/.env 中设置安全的数据库密码：
POSTGRES_PASSWORD=your_secure_password
```

2. 使用 Docker Compose 部署：
```bash
# 构建并启动所有服务
cd docker
docker compose up -d --build

# 查看日志
docker compose logs -f
```

3. 访问应用：
- 生产环境：http://localhost:3000

### 部署后的维护操作

1. 查看日志：
```bash
# 查看应用日志
docker compose logs -f app

# 查看数据库日志
docker compose logs -f postgres
```

2. 数据库备份：
```bash
# 创建数据库备份
docker compose exec postgres pg_dump -U pocket_ledger pocket_ledger > backup.sql

# 恢复数据库备份
cat backup.sql | docker compose exec -T postgres psql -U pocket_ledger -d pocket_ledger
```

3. 更新应用：
```bash
# 拉取最新代码
git pull

# 重新构建并部署
cd docker
docker compose down
docker compose up -d --build
```

### 常见问题处理

1. 样式问题
   - 开发环境（npm run dev）下样式正常但生产环境下丢失：
     * 确保运行 `npm run build` 成功
     * 检查 tailwind.config.ts 中的 content 配置是否正确
     * 确保所有样式文件都被正确引入

2. 数据库连接问题
   - 开发环境连接失败：
     * 确保使用 localhost 而不是 postgres 作为主机名
     * 检查数据库容器是否正常运行
   - 生产环境连接失败：
     * 确保使用 postgres 作为主机名
     * 检查环境变量是否正确配置

3. 容器问题
   - 容器无法启动：
     * 检查端口占用情况
     * 查看容器日志 `docker compose logs`
     * 确保数据库密码配置一致

## 目录结构

```
.
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   └── ...               # 其他页面组件
├── modules/               # 业务模块
│   ├── bills/            # 账单模块
│   ├── expense/          # 支出模块
│   └── ...              # 其他模块
├── shared/               # 共享组件和工具
├── prisma/               # Prisma 配置和迁移
├── docker/               # Docker 相关配置
└── ...                  # 其他配置文件
```

[原有的其他内容保持不变...]