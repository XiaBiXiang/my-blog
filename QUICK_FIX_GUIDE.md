# 快速修复指南 - "Failed to fetch" 错误

## 🔍 问题分析

"Failed to fetch" 错误通常由以下原因引起：

1. **网络连接问题**
2. **Supabase 服务暂时不可用**
3. **浏览器缓存问题**
4. **开发服务器需要重启**

## ✅ 解决步骤

### 步骤 1：重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

### 步骤 2：清除浏览器缓存

1. 打开浏览器开发者工具（F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

或者使用快捷键：

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 步骤 3：检查网络连接

打开浏览器控制台（F12），查看 Network 标签：

1. 刷新页面
2. 查找失败的请求
3. 点击查看详细错误信息

### 步骤 4：验证 Supabase 配置

打开控制台，应该看到：

```
Supabase URL: https://nnoubbhfkhgguezbgggg.supabase.co
Supabase Key exists: true
```

如果看到 `undefined` 或 `false`，说明环境变量没有加载。

### 步骤 5：测试 Supabase 连接

在浏览器控制台运行：

```javascript
fetch('https://nnoubbhfkhgguezbgggg.supabase.co/rest/v1/')
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error)
```

如果返回错误，说明 Supabase 服务有问题。

## 🎯 现在尝试

### 方式 1：直接登录（推荐）

你的账户已经创建好了，直接登录：

1. 访问：http://localhost:3000/login
2. 输入：
   - 用户名：`xbx`
   - 密码：你的密码
3. 点击登录

### 方式 2：重新注册

如果想测试注册功能：

1. **重启开发服务器**
2. **清除浏览器缓存**
3. 访问注册页面
4. 填写信息
5. 查看控制台日志

## 📊 调试信息

现在注册时会显示详细的调试信息：

```
=== 开始注册 ===
注册数据: {email: "...", username: "..."}
Supabase URL: https://...
Supabase Key exists: true
调用 Supabase signUp...
Supabase 响应: {...}
```

如果看到 "网络请求失败"，说明是网络问题。

## 🔧 常见错误及解决

### 错误 1: "Failed to fetch"

**原因：**

- 网络连接问题
- Supabase 服务暂时不可用
- 浏览器缓存问题

**解决：**

1. 检查网络连接
2. 重启开发服务器
3. 清除浏览器缓存
4. 等待几分钟后重试

### 错误 2: "网络连接失败"

**原因：**

- 无法连接到 Supabase

**解决：**

1. 检查 `.env.local` 文件是否存在
2. 确认 Supabase URL 正确
3. 测试网络连接
4. 尝试访问 Supabase Dashboard

### 错误 3: 环境变量未定义

**原因：**

- `.env.local` 文件未加载
- 开发服务器未重启

**解决：**

```bash
# 停止服务器
# 检查 .env.local 文件
cat .env.local

# 重新启动
npm run dev
```

## 💡 最佳实践

### 开发时

1. **保持开发服务器运行**
2. **定期清除浏览器缓存**
3. **查看控制台日志**
4. **检查 Network 标签**

### 遇到问题时

1. **先查看控制台日志**
2. **检查 Network 标签**
3. **重启开发服务器**
4. **清除浏览器缓存**
5. **检查网络连接**

## 🚀 快速测试

### 测试 1：登录现有账户

```
URL: http://localhost:3000/login
用户名: xbx
密码: 你的密码
```

### 测试 2：检查 Supabase

```bash
# 在终端运行
curl https://nnoubbhfkhgguezbgggg.supabase.co/rest/v1/
```

应该返回 JSON 响应。

### 测试 3：查看环境变量

```bash
# 在终端运行
cat .env.local
```

应该看到 Supabase URL 和 Key。

## 📝 下一步

1. **重启开发服务器**

   ```bash
   npm run dev
   ```

2. **清除浏览器缓存**
   - 硬刷新：Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)

3. **尝试登录**
   - 使用 `xbx` 和你的密码

4. **查看控制台**
   - 打开 F12
   - 查看 Console 和 Network 标签

如果还有问题，请提供：

- 控制台的完整错误信息
- Network 标签中失败请求的详情
- 浏览器类型和版本

这样我可以更准确地帮你解决问题！
