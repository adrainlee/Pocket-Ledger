# Pocket Ledger

一个使用Next.js和PostgreSQL构建的个人记账应用。

## 环境要求

- Docker (推荐 20.10.0 或更高版本)
- Docker Compose (推荐 2.0.0 或更高版本)

## 快速启动指南

### 开发环境

1. 克隆项目后，复制环境配置文件：
```bash
# 应用配置
cp .env.example .env

# 数据库配置
cd docker
cp .env.example .env
cd ..
```

2. 配置环境变量：

在根目录的 `.env` 文件中：
```env
# 环境
NODE_ENV=development

# 数据库连接
DATABASE_URL="postgresql://pocket_ledger:your_password@localhost:5432/pocket_ledger?schema=public"
```

在 `docker/.env` 文件中：
```env
# 数据库配置
POSTGRES_DB=pocket_ledger
POSTGRES_USER=pocket_ledger
POSTGRES_PASSWORD=your_password
```

3. 启动开发环境：
```bash
# 启动数据库
cd docker
docker-compose up -d postgres

# 启动应用（开发模式）
cd ..
npm install
npm run dev
```

### 生产环境部署

1. 复制环境配置文件：
```bash
# 应用配置
cp .env.production.example .env

# 数据库配置
cd docker
cp .env.example .env
cd ..
```

2. 配置环境变量：

在根目录的 `.env` 文件中：
```env
# 环境
NODE_ENV=production

# 数据库连接（根据实际部署环境修改）
DATABASE_URL="postgresql://pocket_ledger:your_password@postgres:5432/pocket_ledger?schema=public"
```

在 `docker/.env` 文件中（设置安全的密码）：
```env
POSTGRES_DB=pocket_ledger
POSTGRES_USER=pocket_ledger
POSTGRES_PASSWORD=your_secure_password
```

3. 启动生产环境：
```bash
cd docker
docker-compose up -d
```

应用将在以下地址运行：
- Web应用：http://localhost:3000
- PostgreSQL：localhost:5432

## Docker环境说明

### 镜像版本

- 基础镜像：Alpine Linux 3.20
- Node.js：nodejs-current包（支持Node.js 20+）
- PostgreSQL：15

> 注意：由于Alpine软件包版本管理策略，实际运行的Node.js版本可能与目标版本(20.18.3)略有不同，但保证兼容性。

### Docker镜像优化

项目使用多阶段构建优化镜像大小：

1. 依赖阶段（deps）：
   - 只安装生产环境依赖
   - 使用npm ci确保依赖版本一致

2. 构建阶段（builder）：
   - 安装所有依赖
   - 生成Prisma客户端
   - 构建Next.js应用

3. 运行阶段（runner）：
   - 最小化基础镜像
   - 只包含必要的运行时文件
   - 使用非root用户运行

### 容器说明

1. pocket_ledger_app:
   - 运行Next.js应用
   - 使用非root用户(nextjs)运行
   - 包含数据库等待脚本确保正确启动顺序
   - 自动执行数据库迁移

2. pocket_ledger_db:
   - PostgreSQL数据库
   - 数据持久化存储
   - 自动执行初始化脚本

### 数据库迁移

1. Docker环境中的迁移：
   - 应用容器启动时会自动执行`prisma migrate deploy`
   - 迁移在数据库就绪后、应用启动前执行
   - 迁移失败会导致容器启动失败

2. 手动迁移（开发环境）：
   ```bash
   # 创建新的迁移（开发环境）
   npx prisma migrate dev

   # 应用现有迁移（生产环境）
   npx prisma migrate deploy
   ```

3. 重置数据库：
   ```bash
   # 停止容器
   docker-compose down

   # 删除数据卷
   docker volume rm docker_postgres_data

   # 重新启动（会重新执行迁移）
   docker-compose up -d
   ```

## 目录结构

```
.
├── Dockerfile              # 应用容器配置
├── docker/                 # Docker相关文件
│   ├── docker-compose.yaml # 容器编排配置
│   ├── .env.example       # 数据库环境变量模板
│   └── postgres/          # PostgreSQL初始化脚本
├── prisma/                # Prisma配置和迁移
│   ├── schema.prisma      # 数据库模型定义
│   └── migrations/        # 数据库迁移文件
├── .env.example           # 应用环境变量模板（开发环境）
└── .env.production.example # 应用环境变量模板（生产环境）
```

## 环境变量说明

### 应用环境变量（.env）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| NODE_ENV | 运行环境 | development/production |
| DATABASE_URL | 数据库连接URL | postgresql://pocket_ledger:pass@host:5432/pocket_ledger |

### Docker环境变量（docker/.env）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| POSTGRES_DB | 数据库名称 | pocket_ledger |
| POSTGRES_USER | 数据库用户名 | pocket_ledger |
| POSTGRES_PASSWORD | 数据库密码 | your_password |

## 开发说明

1. 开发环境和生产环境的主要区别：
   - 开发环境：
     * 使用本地数据库（localhost）
     * 支持热重载
     * 显示详细错误信息
   - 生产环境：
     * 使用容器化数据库
     * 优化的构建输出
     * 最小化错误信息

## 注意事项

1. 确保生产环境使用强密码
2. 不要将包含敏感信息的.env文件提交到代码仓库
3. 定期备份数据库数据
4. 在生产环境部署前测试所有环境变量配置

5. Docker镜像优化提示：
   ```bash
   # 构建优化后的镜像
   docker-compose build --no-cache

   # 查看镜像大小
   docker images

   # 清理未使用的镜像和缓存
   docker system prune -a
   ```

6. Node.js版本说明：
   - 项目目标版本：Node.js 20.18.3
   - 实际运行版本：nodejs-current（Alpine包）
   - 两者保持API兼容性，不影响应用运行

7. 数据库连接说明：
   - 所有配置统一使用pocket_ledger作为数据库用户名
   - 确保数据库密码在所有环境中保持一致
   - 生产环境建议使用更强的密码