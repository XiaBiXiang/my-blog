# 登录测试指南

## 🎯 当前问题

显示"数据库操作失败，请稍后重试"

## 🔍 可能的原因

1. **RLS 策略问题** - 客户端无法查询 profiles 表
2. **Supabase 连接问题** - 网络或配置问题
3. **用户名查询失败** - 查询超时或权限问题

## ✅ 解决方案：直接使用邮箱登录

### 方法 1：使用邮箱登录（推荐）

**不要输入用户名 `xbx`，直接输入邮箱：**

1. 访问：http://localhost:3000/login
2. 输入：
   - **邮箱**：`3331631570@qq.com`（不是用户名！）
   - 密码：你的密码
3. 点击登录

这样会跳过查询 profiles 表的步骤，直接用邮箱登录。

### 方法 2：检查浏览器控制台

打开浏览器控制台（F12），查看具体错误：

1. 切换到 Console 标签
2. 尝试登录
3. 查看红色错误信息
4. 告诉我具体的错误内容

### 方法 3：测试 Supabase 连接

在浏览器控制台运行：

```javascript
// 测试能否查询 profiles 表
const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
const supabase = createClient(
  'https://nnoubbhfkhgguezbgggg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub3ViYmhma2hnZ3VlemJnZ2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTg4OTgsImV4cCI6MjA3OTQ3NDg5OH0.eZtHZxSooEHMZHK8q0TnX8RiKoqhd3ijTCmf1KtcMug'
)

const { data, error } = await supabase
  .from('profiles')
  .select('email')
  .eq('username', 'xbx')
  .maybeSingle()

console.log('查询结果:', { data, error })
```

## 🚀 立即尝试

### 步骤 1：使用邮箱登录

**重要：输入邮箱，不是用户名！**

- 邮箱：`3331631570@qq.com`
- 密码：你的密码

### 步骤 2：如果还是失败

请提供以下信息：

1. **浏览器控制台的错误信息**（F12 → Console）
2. **Network 标签中失败的请求**（F12 → Network）
3. **具体显示的错误文字**

## 📊 数据验证

你的账户数据是完整的：

```sql
SELECT
  u.email,
  p.username,
  p.role
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = '3331631570@qq.com';
```

结果：

- 邮箱：3331631570@qq.com ✅
- 用户名：xbx ✅
- 角色：user ✅

## 💡 为什么用邮箱登录可能会成功？

**用户名登录流程：**

```
输入 xbx
  ↓
查询 profiles 表 (可能失败 ❌)
  ↓
获取邮箱
  ↓
登录
```

**邮箱登录流程：**

```
输入 3331631570@qq.com
  ↓
直接登录 (跳过查询 ✅)
```

## 🔧 如果邮箱登录也失败

那可能是：

1. **密码错误** - 确认密码是否正确
2. **Supabase 连接问题** - 检查网络
3. **环境变量问题** - 重启开发服务器

### 重启开发服务器

```bash
# 停止服务器（Ctrl+C）
npm run dev
```

### 清除浏览器缓存

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## 总结

**现在立即尝试：**

1. 访问登录页面
2. 输入邮箱：`3331631570@qq.com`（不是用户名）
3. 输入密码
4. 点击登录

如果还是失败，请告诉我浏览器控制台显示了什么错误！
