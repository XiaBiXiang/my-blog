# Command Palette

命令面板是一个全局快捷导航工具，允许用户通过键盘快捷键快速访问网站的各个功能。

## 功能特性

### 1. 快捷键触发

- **Mac**: `⌘ + K`
- **Windows/Linux**: `Ctrl + K`

### 2. 命令搜索

- 实时过滤命令
- 支持中英文关键词搜索
- 模糊匹配命令标签、描述和关键词

### 3. 键盘导航

- `↑` / `↓`: 上下选择命令
- `Enter`: 执行选中的命令
- `ESC`: 关闭命令面板

### 4. 鼠标交互

- 悬停高亮命令
- 点击执行命令
- 点击外部区域关闭面板

## 可用命令

### 导航命令

- 首页
- 留言板
- 时间胶囊
- 管理时间胶囊
- 登录
- 注册

### 主题命令

- 切换深色/浅色模式

## 技术实现

### 组件结构

```
CommandPalette (主组件)
├── useCommandPalette (自定义 Hook)
└── CommandPaletteProvider (全局提供者)
```

### 核心文件

- `src/components/features/CommandPalette.tsx` - 主组件
- `src/lib/hooks/useCommandPalette.ts` - 快捷键监听 Hook
- `src/components/providers/CommandPaletteProvider.tsx` - 全局提供者

### 集成方式

命令面板通过 `CommandPaletteProvider` 集成到根布局中，确保在整个应用中可用。

## 扩展命令

要添加新命令，在 `CommandPalette.tsx` 的 `commands` 数组中添加新的命令对象：

```typescript
{
  id: 'unique-id',
  label: '命令标签',
  description: '命令描述',
  icon: '🎯',
  action: () => {
    // 执行操作
    onClose()
  },
  keywords: ['关键词1', '关键词2'],
  category: 'navigation' | 'theme' | 'action',
}
```

## 验证需求

该实现满足以下需求：

- ✅ 需求 4.1: CMD+K / CTRL+K 快捷键触发
- ✅ 需求 4.2: 显示可用命令列表
- ✅ 需求 4.3: 实时搜索和过滤
- ✅ 需求 4.4: 命令执行后关闭面板
- ✅ 需求 4.5: ESC 和外部点击关闭
