# USG-LEGO

USG-LEGO 是一个基于 Go 和 Gin 框架开发的单文件托管服务，专门为 iOS 代理工具（如 Surge、Shadowrocket 等）提供规则和配置文件托管。

## 功能特性

- **文件托管服务**: 为 iOS 代理工具提供规则和配置文件托管
- **权限控制**: 支持公共和私有路径，私有文件需要 API 密钥访问
- **API 密钥认证**: 基于 API 密钥的访问控制机制
- **安全防护**: 防止路径遍历攻击，确保文件访问安全
- **多种响应格式**: 支持文件流和 JSON 元数据响应
- **环境变量配置**: 通过环境变量进行灵活配置
- **日志记录**: 使用 zerolog 记录结构化日志
- **Docker 支持**: 提供多架构 Docker 镜像

## 技术栈

- **后端**: Go + Gin 框架
- **数据库**: SQLite（用于存储 API 密钥）
- **日志库**: zerolog
- **前端**: 嵌入式 SPA（单页应用）

## 目录结构

```
.
├── README.md
├── go.mod
├── go.sum
├── cmd/
│   └── server/
│       └── main.go          # 应用入口
├── internal/
│   ├── config/
│   │   └── config.go        # 配置管理
│   ├── auth/
│   │   ├── auth.go          # 认证逻辑
│   │   └── apikey/
│   │       └── apikey.go    # API 密钥管理
│   ├── files/
│   │   ├── handler.go       # 文件处理接口
│   │   └── service.go       # 文件服务逻辑
│   ├── routes/
│   │   └── routes.go        # 路由注册
│   └── logger/
│       └── logger.go        # 日志处理
├── pkg/
│   └── utils/
│       └── utils.go         # 工具函数
├── web/
│   └── dist/                # 前端静态文件
```

## 环境变量配置

- `ROOT_DIR`: 配置文件根目录（默认: ./configs）
- `LISTEN`: 监听地址（默认: :8080）
- `LOG_LEVEL`: 日志级别（默认: info）
- `API_KEY`: API 密钥（用于生产环境）

## 路径规则配置

可以通过在 `ROOT_DIR` 目录下创建 `.usg-lego.yml` 文件来配置公共和私有路径规则：

```yaml
public:
  - "/public/**"
  - "/assets/**"

private:
  - "/private/**"
  - "/conf/**"
```

## API 接口

### 获取文件内容

```
GET /api/files?path=<文件路径>[&api=<API密钥>]
```

- 公共文件无需 API 密钥
- 私有文件需要有效的 API 密钥

### 健康检查

```
GET /health
```

## 权限控制

- 公共路径下的文件可直接访问
- 私有路径下的文件需要提供有效的 API 密钥

## 安全机制

- 路径遍历防护
- API 密钥验证
- 时序攻击防护（使用常量时间比较）

## 日志格式

使用 zerolog 输出 JSON 格式日志，包含以下字段：
- `time`: 时间戳
- `level`: 日志级别
- `msg`: 日志消息
- `method`: HTTP 方法
- `path`: 请求路径
- `status`: HTTP 状态码
- `ip`: 客户端 IP
- `latency`: 请求处理耗时

## 快速启动

### 本地运行

```bash
# 设置环境变量并运行
ROOT_DIR=./configs LISTEN=:8080 go run cmd/server/main.go
```

### Docker 运行

```bash
# 构建镜像
docker build -t usg-lego .

# 运行容器
docker run -d \
  -p 8080:8080 \
  -v ./configs:/configs \
  -e ROOT_DIR=/configs \
  --name usg-lego \
  usg-lego
```

## 生产环境部署建议

1. **设置强密码**：使用环境变量 `API_KEY` 设置强密码
2. **配置 HTTPS**：在生产环境中使用 HTTPS
3. **配置路径规则**：通过 `.usg-lego.yml` 文件精确控制访问权限
4. **监控日志**：定期检查日志以发现异常访问
5. **定期更新**：及时更新依赖和应用版本

## 构建和测试

### 构建应用

```bash
# 构建二进制文件
go build -o usg-lego cmd/server/main.go
```

### 运行测试

```bash
# 测试公共文件访问
curl http://localhost:8080/api/files?path=/public/public.conf

# 测试私有文件访问
curl http://localhost:8080/api/files?path=/private.rules&api=test-key
```

## Docker 支持

提供多架构 Docker 镜像支持，可运行在 AMD64 和 ARM64 架构上。

## 开发规范

- 函数长度限制：不超过 60 行
- 错误处理：尽早 return
- 上下文传递：统一使用 ctx 传递 request-scoped 值
- 外部依赖：必须加 go.sum 校验
- 使用 golangci-lint 全规则检查