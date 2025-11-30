# 四象限待办事项应用

基于艾森豪威尔矩阵的 Mac 风格高级待办事项应用。

## 功能

- **对话式捕捉**：通过对话添加任务。
- **艾森豪威尔矩阵**：自动将任务组织到 4 个象限中：
  - 先做 (重要且紧急)
  - 计划 (重要但不紧急)
  - 委派 (不重要但紧急)
  - 删除 (不重要且不紧急)
- **子任务**：将任务分解为更小的步骤。
- **持久化**：数据保存到浏览器的本地存储中。
- **高级 UI**：玻璃拟态、深色/浅色模式和流畅的动画。

## 快速开始

1. 安装依赖：
   ```bash
   npm install
   ```

2. 运行开发服务器：
   ```bash
   cd app
   npm run dev
   ```

3. 在浏览器中打开 `http://localhost:5173`。

## 技术栈

- React
- Vite
- Vanilla CSS (变量, Flexbox, Grid)

## 项目结构说明

以下是项目主要文件和文件夹的详细说明：

### 根目录 `app/`
- **`index.html`**: 应用的入口 HTML 文件，React 应用挂载于此。
- **`vite.config.js`**: Vite 构建工具的配置文件。
- **`package.json`**: 定义项目依赖（如 React, Framer Motion）和运行脚本。
- **`eslint.config.js`**: 代码规范检查配置。

### 源码目录 `app/src/`
这是核心代码所在的位置：

#### 入口与布局
- **`main.jsx`**: React 的 JavaScript 入口点，负责渲染根组件。
- **`App.jsx`**: 应用的主组件。包含**顶部导航栏**、视图切换逻辑（对话/矩阵）以及 Context Provider 的组合。
- **`index.css`**: 全局样式表。定义了 CSS 变量（颜色主题、字体）、玻璃拟态效果和通用工具类。

#### 组件 `components/`
- **`ChatInterface.jsx`**: **对话捕捉视图**。处理用户输入，通过自然语言交互添加任务。
- **`MatrixView.jsx`**: **矩阵视图**。包含艾森豪威尔矩阵的实现，以及 `Quadrant`（象限）、`TodoItem`（任务卡片）等子组件，处理拖拽逻辑。

#### 状态管理 `hooks/`
- **`useTodos.js`**: **核心业务逻辑**。自定义 Hook，管理所有待办事项的状态（增删改查）、本地存储（localStorage）同步以及子任务逻辑。

#### 上下文 `contexts/`
- **`LanguageContext.jsx`**: 负责多语言支持（中文/英文切换）及翻译字典。
- **`ThemeContext.jsx`**: 负责深色/浅色主题的切换逻辑。
