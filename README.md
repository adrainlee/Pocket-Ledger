# 个人记账应用

一个简洁实用的个人记账应用,专注于支出记录和统计功能。

## 功能特点

- 支出记录(金额、分类、日期、备注)
- 日统计(分类统计)
- 周统计(分类统计)
- 月统计(分类统计)
- 账单管理(查看、编辑、删除)
- 移动端优先的响应式设计

## 技术栈

- 前端框架: Next.js 15
- UI框架: Tailwind CSS
- 数据库: PostgreSQL
- ORM: Prisma
- 状态管理: @tanstack/react-query
- UI组件: @heroicons/react
- 工具库:
  - date-fns (日期处理)
  - clsx & tailwind-merge (样式管理)
  - TypeScript (类型系统)

## 开发环境设置

1. 克隆项目并安装依赖:

```bash
git clone <repository-url>
cd expense-tracker
npm install
```

2. 配置环境变量:

```bash
cp .env.example .env
```

编辑 .env 文件,设置数据库连接信息。

3. 启动数据库:

```bash
npm run compose:up
```

4. 生成 Prisma 客户端并同步数据库架构:

```bash
npm run db:generate
npm run db:push
```

5. 启动开发服务器:

```bash
npm run dev
```

应用将在 http://localhost:3000 运行。

## 数据库管理

- 启动 Prisma Studio (数据库管理界面):
```bash
npm run db:studio
```

- 更新数据库架构:
```bash
npm run db:push
```

## 项目结构

```
expense-tracker/
├── app/                    # Next.js 应用路由
│   ├── api/               # API 路由
│   │   ├── expenses/     # 支出相关API
│   │   └── stats/        # 统计相关API
│   ├── bills/            # 账单页面
│   └── settings/         # 设置页面
├── modules/               # 功能模块
│   ├── bills/            # 账单模块
│   │   ├── components/   # 账单相关组件
│   │   ├── hooks/        # 自定义Hook
│   │   ├── services/     # 业务逻辑
│   │   └── types/        # 类型定义
│   └── expense/          # 支出模块
│       ├── components/   # 支出相关组件
│       ├── hooks/        # 自定义Hook
│       ├── services/     # 业务逻辑
│       └── types/        # 类型定义
├── shared/               # 共享资源
│   ├── components/       # 通用组件
│   │   ├── Navigation/  # 导航组件
│   │   └── ui/          # UI基础组件
│   ├── config/          # 全局配置
│   └── utils/           # 工具函数
├── lib/                  # 核心库
│   └── db/              # 数据库配置
├── prisma/              # Prisma配置
│   └── migrations/      # 数据库迁移
└── docker/              # Docker配置
    └── postgres/        # PostgreSQL配置
```

## 开发工具

- 代码格式化:
```bash
npm run format
```

- 代码检查:
```bash
npm run lint
```

- 类型检查:
```bash
npm run type-check
```

## Docker 命令

- 启动服务:
```bash
npm run compose:up
```

- 停止服务:
```bash
npm run compose:down
```

## 生产环境部署

1. 安装PM2:
```bash
npm install -g pm2
```

2. 构建应用:
```bash
npm run build
```

3. 使用PM2启动应用:
```bash
pm2 start npm --name "expense-tracker" -- start
```

## PM2进程管理

PM2是Node.js应用程序的生产进程管理器，具有内置的负载均衡器。以下是常用的PM2命令：

### 基本操作

- 启动应用:
```bash
pm2 start npm --name "expense-tracker" -- start
```

- 停止应用:
```bash
pm2 stop expense-tracker
```

- 重启应用:
```bash
pm2 restart expense-tracker
```

- 删除应用:
```bash
pm2 delete expense-tracker
```

### 监控和日志

- 查看应用状态:
```bash
pm2 status
```

- 监控CPU和内存使用:
```bash
pm2 monit
```

- 查看日志:
```bash
pm2 logs expense-tracker
```

### 集群模式

- 启动集群模式(根据CPU核心数):
```bash
pm2 start npm --name "expense-tracker" -i max -- start
```

- 指定进程数量:
```bash
pm2 start npm --name "expense-tracker" -i 4 -- start
```

### 自动重启

- 设置开机自启:
```bash
pm2 startup
pm2 save
```

- 配置文件(ecosystem.config.js)示例:
```javascript
module.exports = {
  apps: [{
    name: "expense-tracker",
    script: "npm",
    args: "start",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production"
    }
  }]
}
```

启动配置文件:
```bash
pm2 start ecosystem.config.js
```

## 系统要求

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- PM2 (生产环境)

## 许可证

MIT