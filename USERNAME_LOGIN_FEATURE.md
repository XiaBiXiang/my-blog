# 用户名登录功能完整指南

## 功能说明

现在系统支持：

- ✅ 注册时输入自定义用户名
- ✅ 使用用户名登录
- ✅ 使用邮箱登录
- ✅ 详细的调试日志

## 测试步骤

### 第一步：注册新账户

1. **访问注册页面**：http://localhost:3000/register
2. **填写注册信息**：
   - 邮箱：`test@example.com`
   - 用户名：`xbx`（你想要的用户名）
   - 密码：`Test1234`（至少8位，包含大小写字母和数字）
   - 确认密码：`Test1234`
3. **打开浏览器控制台**（F12），查看日志
4. **点击"注册"按钮**

**预期日志输出：**

```
=== 开始注册 ===
注册数据: {email: "test@example.com", username: "xbx"}
使用的用户名: xbx
注册响应: {
  user: {...},
  metadata: {username: "xbx"},
  error: null
}
注册成功！用户ID: xxx
```

5. **等待跳转到登录页面**

### 第二步：使用用户名登录

1. **在登录页面输入**：
   - 邮箱或用户名：`xbx`
   - 密码：`Test1234`
2. **查看控制台日志**
3. **点击"登录"按钮**

**预期日志输出：**

```
=== 登录开始 ===
输入的标识符: xbx
检测到用户名，查询对应邮箱...
查询条件: username = xbx
查询结果: {profile: {email: "test@example.com"}, profileError: null}
找到对应邮箱: test@example.com
使用邮箱登录: test@example.com
登录响应: {hasData: true, hasUser: true, error: null}
=== 登录成功 ===
```

4. **应该成功登录并跳转到首页**

### 第三步：使用邮箱登录

1. **退出登录**（如果已登录）
2. **在登录页面输入**：
   - 邮箱或用户名：`test@example.com`
   - 密码：`Test1234`
3. **点击"登录"按钮**

**预期日志输出：**

```
=== 登录开始 ===
输入的标识符: test@example.com
检测到邮箱，直接登录
使用邮箱登录: test@example.com
登录响应: {hasData: true, hasUser: true, error: null}
=== 登录成功 ===
```

## 数据库验证

注册成功后，可以在数据库中验证数据：

```sql
-- 查看用户数据
SELECT
  u.email,
  u.raw_user_meta_data->>'username' as metadata_username,
  p.username as profile_username,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'test@example.com';
```

**预期结果：**
| email | metadata_username | profile_username | role |
|-------|-------------------|------------------|------|
| test@example.com | xbx | xbx | user |

## 技术实现

### 1. 注册流程

```
用户填写表单（邮箱 + 用户名 + 密码）
    ↓
调用 supabase.auth.signUp()
    ↓
传递 user_metadata: {username: "xbx"}
    ↓
触发器 handle_new_user 自动执行
    ↓
从 raw_user_meta_data 读取 username
    ↓
创建 profiles 记录
```

### 2. 登录流程

```
用户输入标识符（邮箱或用户名）+ 密码
    ↓
判断是邮箱还是用户名（包含 @ 符号）
    ↓
[如果是用户名]
    ↓
查询 profiles 表获取对应邮箱
    ↓
使用邮箱调用 signInWithPassword
    ↓
登录成功
```

### 3. 数据库触发器

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$function$
```

## 常见问题

### Q1: 注册时没有保存用户名？

**检查点：**

1. 确认注册表单有用户名输入框
2. 查看控制台日志，确认 `metadata` 中有 `username`
3. 检查数据库触发器是否正常工作

**解决方法：**

```sql
-- 检查触发器
SELECT * FROM pg_trigger WHERE tgname LIKE '%user%';

-- 手动修复用户名
UPDATE profiles
SET username = 'xbx'
WHERE email = 'test@example.com';
```

### Q2: 登录时提示"用户名或密码错误"？

**可能原因：**

1. 用户名输入错误
2. profiles 表中没有该用户名
3. 密码错误

**调试步骤：**

```sql
-- 查询用户名是否存在
SELECT username, email FROM profiles WHERE username = 'xbx';

-- 查看所有用户名
SELECT username, email FROM profiles ORDER BY created_at DESC;
```

### Q3: 登录时提示"数据库操作失败"？

**可能原因：**

1. RLS 策略问题
2. 网络连接问题
3. Supabase 配置错误

**解决方法：**

1. 检查 RLS 策略：

```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

2. 检查环境变量：

```bash
cat .env.local
```

3. 测试数据库连接

## 代码改进

### 注册表单改进

**之前：**

```typescript
options: {
  data: {
    username: data.username || data.email.split('@')[0],
  },
}
```

**现在：**

```typescript
const username = data.username?.trim() || data.email.split('@')[0]
console.log('使用的用户名:', username)

options: {
  emailRedirectTo: `${window.location.origin}/auth/callback`,
  data: {
    username: username,
  },
}
```

### 登录逻辑改进

**之前：**

```typescript
// 使用 Promise.race 和超时
const { data: profile } = await Promise.race([...])
```

**现在：**

```typescript
// 直接查询，更简单可靠
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('email')
  .eq('username', identifier)
  .maybeSingle()
```

## 清理旧数据

如果需要清理之前的测试数据：

```sql
-- 删除特定用户
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = '3331631570@qq.com';

  IF user_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = user_id;
    DELETE FROM auth.users WHERE id = user_id;
  END IF;
END $$;
```

## 总结

现在系统已经完全支持：

1. ✅ **注册时自定义用户名**
   - 用户可以输入自己想要的用户名
   - 用户名会保存到 `user_metadata` 和 `profiles` 表

2. ✅ **用户名登录**
   - 输入用户名会自动查询对应邮箱
   - 然后使用邮箱进行登录

3. ✅ **邮箱登录**
   - 直接使用邮箱登录
   - 无需额外查询

4. ✅ **详细日志**
   - 每一步都有清晰的日志输出
   - 方便调试和排查问题

## 下一步测试

1. 刷新浏览器页面
2. 访问注册页面
3. 使用你想要的用户名（如 `xbx`）注册
4. 使用用户名或邮箱登录
5. 查看控制台日志确认流程正确

如果还有问题，请提供控制台的完整日志！
