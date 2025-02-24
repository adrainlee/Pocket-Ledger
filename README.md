# Pocket Ledger

一个使用Next.js和PostgreSQL构建的个人记账应用。

## 环境要求

- Docker (推荐 20.10.0 或更高版本)
- Docker Compose (推荐 2.0.0 或更高版本)
- Node.js (开发环境需要，推荐 20.18.3 或更高版本)
- npm (开发环境需要，推荐 9.0.0 或更高版本)

## 部署指南

### 环境变量配置说明

不同部署方式需要不同的环境变量配置：

#### 1. 本地开发环境（npm run dev）

在根目录的 `.env` 文件中：
```env
# 环境
NODE_ENV=development

# 数据库连接 - 使用 localhost，因为应用直接在宿主机运行
DATABASE_URL="postgresql://pocket_ledger:pocket_ledger_pass@localhost:5432/pocket_ledger?schema=public"
```

在 `docker/.env` 文件中：
```env
# 数据库配置
POSTGRES_DB=pocket_ledger
POSTGRES_USER=pocket_ledger
POSTGRES_PASSWORD=pocket_ledger_pass
```

#### 2. Docker 部署环境（docker compose up）

在根目录的 `.env` 文件中：
```env
# 环境
NODE_ENV=production

# 数据库连接 - 使用 postgres（容器服务名）作为主机名
DATABASE_URL="postgresql://pocket_ledger:pocket_ledger_pass@postgres:5432/pocket_ledger?schema=public"
```

在 `docker/.env` 文件中：
```env
# 数据库配置
POSTGRES_DB=pocket_ledger
POSTGRES_USER=pocket_ledger
POSTGRES_PASSWORD=pocket_ledger_pass
```

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
# 确保 DATABASE_URL 使用 localhost 而不是 postgres
```

3. 启动开发环境：
```bash
# 启动数据库（仅启动 PostgreSQL 容器）
cd docker && docker compose up -d postgres && cd ..

# 运行数据库迁移
npx prisma migrate deploy

# 生成 Prisma 客户端
npx prisma generate

# 启动开发服务器
npm run dev
```

4. 访问应用：
- 开发服务器：http://localhost:3000

### 生产环境部署

#### 方式一：使用 Docker Compose（推荐）

1. 准备生产环境配置：
```bash
# 复制生产环境配置文件
cp .env.production.example .env
cd docker && cp .env.example .env && cd ..

# 确保 DATABASE_URL 使用 postgres 作为主机名
```

2. 使用 Docker Compose 部署：
```bash
# 构建并启动所有服务
cd docker
docker compose up -d --build

# 查看日志
docker compose logs -f
```

#### 方式二：独立部署

1. 构建生产环境：
```bash
# 安装依赖
npm install

# 生成 Prisma 客户端
npx prisma generate

# 构建应用
npm run build
```

2. 启动应用：
```bash
# 启动生产服务器
npm start
```

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
     * 检查 5432 端口是否被占用
   - 生产环境连接失败：
     * 确保使用 postgres 作为主机名
     * 检查环境变量是否正确配置
     * 确保数据库容器已经完全启动

3. 容器问题
   - 容器无法启动：
     * 检查端口占用情况
     * 查看容器日志 `docker compose logs`
     * 确保数据库密码配置一致
   - 应用容器启动但无法访问：
     * 检查 3000 端口是否被占用
     * 确认防火墙配置
     * 检查网络配置是否正确

## 项目功能

1. 支出记录
   - 添加日常支出记录
   - 支持自定义分类
   - 支持备注和日期选择

2. 数据统计
   - 日支出统计
   - 周支出统计
   - 月支出统计
   - 按分类统计占比

3. 分类管理
   - 内置常用分类
   - 自定义分类添加
   - 分类删除（仅自定义分类）

## 技术栈

- 前端：
  * Next.js 14
  * React 18
  * TailwindCSS
  * TypeScript

- 后端：
  * Node.js
  * PostgreSQL
  * Prisma ORM

- 部署：
  * Docker
  * Docker Compose

## 目录结构

```
.
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   │   ├── expenses/     # 支出相关 API
│   │   ├── settings/     # 设置相关 API
│   │   └── stats/        # 统计相关 API
│   ├── bills/            # 账单页面
│   ├── settings/         # 设置页面
│   └── page.tsx          # 首页
├── modules/              # 业务模块
│   ├── bills/           # 账单模块
│   │   ├── components/  # 组件
│   │   ├── hooks/       # 自定义 hooks
│   │   ├── services/    # 服务
│   │   └── types/       # 类型定义
│   └── expense/         # 支出模块
│       ├── components/  # 组件
│       ├── hooks/       # 自定义 hooks
│       ├── services/    # 服务
│       └── types/       # 类型定义
├── shared/              # 共享代码
│   ├── components/      # 共享组件
│   ├── config/         # 配置
│   └── utils/          # 工具函数
├── prisma/             # Prisma 配置
│   ├── schema.prisma   # 数据库模型
│   └── migrations/     # 数据库迁移
├── docker/             # Docker 配置
│   ├── docker-compose.yaml
│   └── postgres/       # PostgreSQL 配置
└── [其他配置文件]
```

## 开发规范

1. 代码规范
   - 使用 ESLint 进行代码检查
   - 使用 Prettier 进行代码格式化
   - 遵循 TypeScript 严格模式

2. Git 提交规范
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档变更
   - style: 代码格式
   - refactor: 代码重构
   - test: 测试相关
   - chore: 构建过程或辅助工具的变动

## 性能优化

1. 前端优化
   - 使用 Next.js App Router
   - 组件级别的代码分割
   - 图片优化和懒加载

2. 后端优化
   - 数据库索引优化
   - API 响应缓存
   - 批量数据处理

## 安全建议

1. 生产环境配置
   - 使用强密码
   - 定期更新依赖
   - 启用日志监控

2. 数据安全
   - 定期备份数据
   - 使用环境变量存储敏感信息
   - 控制数据库访问权限

## 贡献指南

1. 提交 Pull Request
   - Fork 项目
   - 创建特性分支
   - 提交变更
   - 发起 Pull Request

2. 报告问题
   - 使用 Issue 模板
   - 提供复现步骤
   - 附加错误日志

## 许可证

MIT License