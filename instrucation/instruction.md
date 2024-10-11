# 产品需求文档 (PRD)

## 项目概述

**项目名称**: Reddit AI 分析平台

**技术栈**: Next.js 14, Shadcn UI, TailwindCSS, Lucid Icons

**项目描述**:
Reddit AI 分析平台旨在为用户提供不同子版块的分析数据，用户可以查看顶级内容、分析帖子类别等。平台将利用 Reddit API 获取数据，并结合 OpenAI 的自然语言处理能力，对帖子内容进行主题分类分析。

## 目标

- **用户友好**: 提供简洁直观的界面，方便用户浏览和分析 Reddit 子版块的数据。
- **高效数据处理**: 使用 `snoowrap` 库高效抓取 Reddit 数据，并利用 OpenAI API 进行并发主题分析。
- **可扩展性**: 设计模块化的文件结构，便于未来功能扩展和维护。
- **性能优化**: 实现数据缓存和优化的 API 请求，确保平台响应迅速。

## 目标用户

- Reddit 爱好者
- 数据分析师
- 市场研究人员
- 社区管理者

## 核心功能

### 1. 查看可用的子版块并添加新子版块

#### 功能描述

1. **展示现有子版块**:
    - 显示已创建的子版块列表，采用卡片式布局。
    - 展示常见子版块，如 "ollama"、"openai" 等。

2. **添加新子版块**:
    - 用户点击“添加 Reddit”按钮，弹出模态框，输入 Reddit 链接以添加新子版块。
    - 成功添加后，新子版块以卡片形式展示在列表中。

#### 用户流程

1. 用户访问首页，查看现有的子版块列表。
2. 用户点击“添加 Reddit”按钮，弹出添加子版块的模态框。
3. 用户输入 Reddit 子版块的 URL 链接并提交。
4. 系统验证链接有效性，添加子版块并在界面上展示新的卡片。

### 2. 子版块页面

#### 功能描述

1. **导航至子版块页面**:
    - 用户点击某一子版块卡片，进入该子版块的详细页面。

2. **页面内导航标签**:
    - 页面包含“顶级帖子”(Top posts) 和 “主题分析”(Themes) 两个标签页，用户可在其中切换查看不同内容。

#### 用户流程

1. 用户在首页点击某个子版块卡片。
2. 用户进入该子版块页面，默认展示“顶级帖子”标签内容。
3. 用户切换到“主题分析”标签，查看帖子类别分析结果。

### 3. 抓取“顶级帖子”数据

#### 功能描述

1. **抓取最近 24 小时内的 Reddit 帖子**。
2. **使用 `snoowrap` 库与 Reddit API 交互**，获取帖子数据。
3. **展示帖子信息**:
    - 标题、评分、内容、URL、创建时间（UTC）、评论数。
4. **在表格中展示帖子**，并可根据评分进行排序。

#### 用户流程

1. 用户进入子版块的“顶级帖子”标签页。
2. 系统通过 `snoowrap` 抓取该子版块最近 24 小时内的热帖。
3. 帖子数据以表格形式展示，用户可按评分排序查看。

### 4. 在“主题分析”中分析帖子数据

#### 功能描述

1. **将每个帖子数据发送至 OpenAI 进行主题分类**：
    - 分类类别包括“解决方案请求”、“痛苦与愤怒”、“建议请求”、“金钱讨论”。
2. **并发处理**，加快分析速度。
3. **在“主题分析”页面展示分类结果**：
    - 每个类别以卡片形式展示，包含标题、描述及数量统计。
4. **点击类别卡片，弹出侧边面板显示该类别下所有帖子**。

#### 用户流程

1. 用户进入子版块的“主题分析”标签页。
2. 系统并发将每个帖子的标题和内容发送至 OpenAI 进行分类分析。
3. 分析结果通过卡片展示各类别的统计信息。
4. 用户点击某一类别卡片，侧边面板打开，显示该类别下的所有帖子详情。

### 5. 添加新卡片并触发分析

#### 功能描述

1. **用户添加新的子版块卡片**。
2. **系统自动触发对新子版块帖子的主题分析**。

#### 用户流程

1. 用户在首页添加新的子版块。
2. 系统抓取该子版块的帖子数据，并进行主题分析。
3. 新子版块的分析结果在相应页面展示。

## 技术需求

### 前端

- **Framework**: Next.js 14
- **UI 库**: Shadcn UI
- **样式**: TailwindCSS
- **图标库**: Lucid Icons
- **数据获取**: SWR
- **状态管理**: React Hooks

### 后端

- **API 框架**: Next.js API Routes
- **Reddit API 客户端**: `snoowrap`
- **AI 处理**: OpenAI API
- **环境变量管理**: `dotenv`

### 安全性

- **环境变量保护**: API 密钥和凭证仅在服务器端访问，不在客户端暴露。
- **输入验证**: 验证用户添加的子版块 URL 的有效性，防止恶意输入。

## 文件结构 (File Structure)

以下为推荐的项目文件结构，旨在简化文件数量，同时保持清晰的组织和可维护性。

```
reddit-ai-analysis
├── README.md
├── app
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── subreddit
│   │   ├── [id]
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── top-posts
│   │   │   │   └── page.tsx
│   │   │   └── themes
│   │   │       └── page.tsx
├── components
│   ├── ui
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Tabs.tsx
│   │   └── AddRedditButton.tsx
│   └── LayoutComponents.tsx
├── lib
│   ├── reddit.ts
│   └── openai.ts
├── pages
│   └── api
│       ├── add-subreddit.ts
│       ├── fetch-subreddit-posts.ts
│       └── analyze-posts.ts
├── hooks
│   └── useSubreddits.ts
├── public
│   ├── favicon.ico
│   └── assets
│       └── icons
├── styles
│   └── globals.css
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── next.config.mjs
├── package.json
└── package-lock.json
```

### 详细说明

#### 1. **app/**

- **layout.tsx**: 根布局，包含全局组件如导航栏、页脚等。
- **globals.css**: 全局 CSS，包括 TailwindCSS 的指令。
- **page.tsx**: 首页，展示子版块列表和添加子版块功能。
- **subreddit/[id]/**: 动态路由，处理各个子版块的详细页面。
  - **layout.tsx**: 子版块页面的布局，包含“顶级帖子”和“主题分析”标签。
  - **page.tsx**: 默认子版块页面，可能重定向到“顶级帖子”。
  - **top-posts/page.tsx**: 显示子版块的顶级帖子。
  - **themes/page.tsx**: 显示子版块的主题分析。

#### 2. **components/**

- **ui/**: 通用 UI 组件，利用 Shadcn UI 和 Lucid Icons。
  - **Card.tsx**: 通用卡片组件，用于展示子版块信息和主题类别。
  - **Modal.tsx**: 模态框组件，用于添加新子版块。
  - **Table.tsx**: 表格组件，用于展示帖子数据。
  - **Tabs.tsx**: 标签组件，用于切换“顶级帖子”和“主题分析”。
  - **AddRedditButton.tsx**: 添加子版块按钮组件，触发模态框。
- **LayoutComponents.tsx**: 其他布局相关组件。

#### 3. **lib/**

- **reddit.ts**: 配置和初始化 `snoowrap`，与 Reddit API 交互。
- **openai.ts**: 配置和初始化 OpenAI 客户端，用于帖子分类分析。

#### 4. **pages/api/**

- **add-subreddit.ts**: API 端点，处理添加新子版块的请求。
- **fetch-subreddit-posts.ts**: API 端点，抓取指定子版块的帖子数据并进行分析。
- **analyze-posts.ts**: API 端点，将帖子数据发送给 OpenAI 进行分类分析。

#### 5. **hooks/**

- **useSubreddits.ts**: 自定义 React Hook，管理子版块列表的状态和操作。

#### 6. **public/**

- **favicon.ico**: 网站图标。
- **assets/icons/**: 存放图标资源。

#### 7. **styles/**

- **globals.css**: 全局样式文件。

#### 8. **配置文件**

- **tailwind.config.ts**: TailwindCSS 配置。
- **postcss.config.mjs**: PostCSS 配置。
- **tsconfig.json**: TypeScript 配置。
- **next.config.mjs**: Next.js 配置。
- **package.json**: 项目依赖及脚本。
- **package-lock.json**: 锁定依赖版本。

## 文档和背景资料

### 1. **使用 Snoowrap 抓取 Reddit 帖子数据的文档**

#### 代码示例

```javascript
import Snoowrap from 'snoowrap';
import dotenv from 'dotenv';
import { PostCategoryAnalysis, analyzePostCategory } from './postCategoryAnalysis';

// 加载环境变量
dotenv.config();

// 创建 Snoowrap 实例
const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || 'Your User Agent',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  created_utc: number;
  categoryAnalysis?: PostCategoryAnalysis;
}

async function fetchRedditPosts(keyword: string, limit?: number): Promise<RedditPost[]> {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;

  const posts = await reddit.search({
    query: keyword,
    time: 'day',
    sort: 'new',
    limit: limit || 20,
  });

  const analyzedPosts = await Promise.all(posts
    .filter((post) => post.created_utc >= oneDayAgo)
    .map(async (post) => ({
      title: post.title,
      selftext: post.selftext,
      score: post.score,
      num_comments: post.num_comments,
      created_utc: post.created_utc,
      categoryAnalysis: await analyzePostCategory(post.title, post.selftext),
    })));

  return analyzedPosts;
}

// 使用示例
(async () => {
  try {
    const keyword = 'ollama'; // 关键词可更改
    const redditPosts = await fetchRedditPosts(keyword, 5);

    console.log(`找到 ${redditPosts.length} 个与"${keyword}"相关的帖子`);
    redditPosts.forEach((post) => {
      console.log(`标题: ${post.title}`);
      console.log(`评分: ${post.score}`);
      console.log(`评论数: ${post.num_comments}`);
      console.log(`创建时间: ${new Date(post.created_utc * 1000).toLocaleString()}`);
      console.log('分类分析:');
      console.log(JSON.stringify(post.categoryAnalysis, null, 2));
      console.log('---');
    });
  } catch (error) {
    console.error('获取帖子时出错:', error);
  }
})();
```

#### 示例响应

```
找到 5 个与"ollama"相关的帖子
标题: Example Post Title
评分: 123
评论数: 45
创建时间: 2024-04-27 10:37:51
分类分析:
{
  "solutionRequests": true,
  "painAndAnger": false,
  "adviceRequests": true,
  "moneyTalk": false
}
---
```

### 2. **使用 OpenAI 结构化输出进行帖子类别分析的文档**

#### 代码示例

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
    baseURL: process.env.OPENAI_BASE_URL,
});

const PostCategoryAnalysisSchema = z.object({
    solutionRequests: z.boolean(),
    painAndAnger: z.boolean(),
    adviceRequests: z.boolean(),
    moneyTalk: z.boolean()
});

type PostCategoryAnalysis = z.infer<typeof PostCategoryAnalysisSchema>;

async function analyzePostCategory(title: string, content: string): Promise<PostCategoryAnalysis> {
    const prompt = `
        Analyze the title and content of the following Reddit post and determine if it falls into the following categories (answer true or false).
        1. "Solution requests": Posts where people are seeking solutions for problems
        2. "Pain & anger": Posts where people are expressing pains or anger
        3. "Advice requests": Posts where people are seeking advice
        4. "Money talk": Posts where people are talking about spending money

        Title: ${title}
        Content: ${content}

        Please answer in JSON format, for example.
        {
            "solutionRequests": true,
            "painAndAnger": false,
            "adviceRequests": true,
            "moneyTalk": false
        }
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        functions: [
            {
                name: "analyze_post",
                description: "Analyze the post and categorize it",
                parameters: zodToJsonSchema(PostCategoryAnalysisSchema)
            }
        ],
        function_call: { name: "analyze_post" }
    });

    const functionCall = response.choices[0].message.function_call;
    if (!functionCall || functionCall.name !== "analyze_post") {
        throw new Error("Unexpected response format");
    }

    const result = PostCategoryAnalysisSchema.parse(JSON.parse(functionCall.arguments));
    return result;
}

export { PostCategoryAnalysis, analyzePostCategory };
```

#### 示例响应

```
{
  "solutionRequests": true,
  "painAndAnger": false,
  "adviceRequests": true,
  "moneyTalk": false
}
```

## 文件结构纳入目标和实现细节

项目文件结构经过精心设计，以确保代码的模块化、可维护性和可扩展性。以下是各目录和文件的详细说明，帮助开发人员快速上手并理解项目架构。

### 根目录

- **README.md**: 项目说明文档，包含项目概述、安装步骤、使用说明等。
- **package.json** & **package-lock.json**: 项目依赖管理和脚本配置。

### app/

Next.js 的 `app` 目录用于存放页面和布局，利用嵌套路由实现页面结构的清晰划分。

- **layout.tsx**: 根布局组件，定义应用的整体布局，包括导航栏和页脚。
- **globals.css**: 全局样式文件，包含 TailwindCSS 的基础配置。
- **page.tsx**: 首页，展示子版块列表和添加子版块功能。
- **subreddit/[id]/**: 动态路由目录，处理不同子版块的详细页面。
  - **layout.tsx**: 子版块页面的布局，包含标签导航。
  - **page.tsx**: 子版块首页，可能重定向到“顶级帖子”。
  - **top-posts/page.tsx**: 展示子版块的顶级帖子。
  - **themes/page.tsx**: 展示子版块的主题分析结果。

### components/

存放所有可复用的 React 组件，分为通用 UI 组件和布局相关组件。

- **ui/**: 通用 UI 组件目录。
  - **Card.tsx**: 用于展示子版块信息和主题类别的卡片组件。
  - **Modal.tsx**: 通用模态框组件，用于添加新子版块等功能。
  - **Table.tsx**: 表格组件，用于展示帖子数据，支持排序。
  - **Tabs.tsx**: 标签组件，用于页面内导航“顶级帖子”和“主题分析”。
  - **AddRedditButton.tsx**: 添加子版块按钮组件，触发模态框。
- **LayoutComponents.tsx**: 其他布局相关的通用组件。

### lib/

存放与外部服务交互的工具库和配置文件。

- **reddit.ts**: 配置和初始化 `snoowrap`，用于与 Reddit API 进行交互。
- **openai.ts**: 配置和初始化 OpenAI 客户端，处理帖子分类分析。

### pages/api/

存放所有 API 路由，用于处理前端请求，进行数据抓取和处理。

- **add-subreddit.ts**: 处理添加新子版块的请求，将新子版块信息保存到数据库或状态管理中。
- **fetch-subreddit-posts.ts**: 抓取指定子版块的帖子数据，并调用 OpenAI 进行分类分析。
- **analyze-posts.ts**: 将帖子数据发送给 OpenAI，获取分类结果。

### hooks/

存放自定义的 React Hooks，便于在各组件中复用逻辑。

- **useSubreddits.ts**: 自定义 Hook，管理子版块列表的状态和操作，如获取、添加子版块。

### public/

存放静态资源，如图片、图标等。

- **favicon.ico**: 网站图标。
- **assets/icons/**: 存放应用使用的图标资源。

### styles/

存放样式文件。

- **globals.css**: 全局样式文件，包含 TailwindCSS 的基础样式。

### 配置文件

- **tailwind.config.ts**: TailwindCSS 的配置文件，定义主题、插件等。
- **postcss.config.mjs**: PostCSS 的配置文件，配置 TailwindCSS 和其他插件。
- **tsconfig.json**: TypeScript 的配置文件，定义编译选项和路径别名。
- **next.config.mjs**: Next.js 的配置文件，定义构建选项和自定义设置。

## 实施细节

### 1. **项目初始化**

- **创建项目**：
  ```bash
  npx create-next-app@latest reddit-ai-analysis --typescript
  cd reddit-ai-analysis
  ```

- **安装依赖**：
  ```bash
  npm install snoowrap openai zod zod-to-json-schema swr shadcn-ui lucid-icons tailwindcss postcss autoprefixer dotenv
  ```

- **初始化 TailwindCSS**：
  ```bash
  npx tailwindcss init -p
  ```

- **配置 `tailwind.config.ts`**：
  ```typescript
  // tailwind.config.ts
  import { Config } from 'tailwindcss';

  const config: Config = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };

  export default config;
  ```

### 2. **配置环境变量**

创建 `.env.local` 文件，添加必要的环境变量：

```env
REDDIT_USER_AGENT=your-user-agent
REDDIT_CLIENT_ID=your-client-id
REDDIT_CLIENT_SECRET=your-client-secret
REDDIT_REFRESH_TOKEN=your-refresh-token
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com
```

### 3. **创建 API 路由**

根据 `pages/api/` 目录下的文件说明，创建相应的 API 路由处理逻辑，用于添加子版块、抓取帖子和分析帖子。

### 4. **构建前端组件**

根据 `components/` 目录下的组件说明，创建各个 UI 组件，如卡片、模态框、表格、标签和按钮等。

### 5. **数据获取与展示**

利用 `swr` 进行数据获取和缓存管理，使用自定义 Hook `useSubreddits` 进行子版块列表的管理。

### 6. **集成 OpenAI 进行帖子分析**

在 API 路由中，集成 OpenAI 的函数 `analyzePostCategory`，并确保并发处理提高分析速度。

### 7. **状态管理与导航**

使用 React Hooks 管理组件状态，利用 Next.js 的路由系统处理页面导航，如添加子版块、切换标签页和展示分类结果。

## 实施步骤

### 步骤 1: 设置项目

1. 按照上述初始化步骤创建和配置项目。
2. 确保所有依赖安装完毕，并配置好 TailwindCSS。

### 步骤 2: 配置环境变量

1. 在项目根目录创建 `.env.local` 文件。
2. 添加 Reddit 和 OpenAI 所需的环境变量。

### 步骤 3: 实现 API 路由

1. **添加子版块 API (`add-subreddit.ts`)**:
    - 接收用户提交的 Reddit URL，提取子版块名称。
    - 验证子版块的有效性，并将其添加到数据库或状态管理中。
  
2. **抓取子版块帖子 API (`fetch-subreddit-posts.ts`)**:
    - 接收子版块名称，使用 `snoowrap` 抓取最近 24 小时内的帖子。
    - 调用 `analyzePostCategory` 对每个帖子进行分类分析。
    - 返回分析后的帖子数据。

3. **分析帖子 API (`analyze-posts.ts`)**:
    - 接收帖子的标题和内容，调用 OpenAI 进行分类分析。
    - 返回分类结果。

### 步骤 4: 构建前端页面与组件

1. **首页 (`app/page.tsx`)**:
    - 展示子版块列表，使用卡片组件。
    - 添加“添加 Reddit”按钮，触发模态框。

2. **子版块页面 (`app/subreddit/[id]/` )**:
    - 布局包含“顶级帖子”和“主题分析”两个标签。
    - 分别展示对应的内容页面。

3. **UI 组件**:
    - 创建卡片、模态框、表格、标签和按钮等通用组件。
    - 确保组件样式统一，并符合用户体验设计。

### 步骤 5: 数据获取与管理

1. **使用 `swr` 进行数据获取**:
    - 在首页使用 `useSubreddits` Hook 获取子版块列表。
    - 在子版块页面使用 `useSWR` 获取帖子数据。

2. **状态管理**:
    - 使用 React Hooks 管理组件内部状态，如模态框的显示状态、新增子版块的加载状态等。

### 步骤 6: 集成 OpenAI 进行帖子分析

1. 在 API 路由中，实现将帖子数据并发发送至 OpenAI 进行分类分析。
2. 处理 OpenAI 的响应，确保数据结构符合预期。

### 步骤 7: 测试与优化

1. **功能测试**:
    - 确保所有核心功能按预期工作，如添加子版块、抓取帖子、分类分析等。

2. **性能优化**:
    - 优化 API 请求和数据处理流程，确保平台响应迅速。
    - 使用缓存策略减少不必要的数据抓取。

3. **用户体验优化**:
    - 添加加载指示器、错误提示等，提高用户体验。
    - 确保界面在不同设备和屏幕尺寸下均表现良好。

## 里程碑

1. **项目初始化与环境配置** (1 周)
    - 创建项目、安装依赖、配置 TailwindCSS 和环境变量。

2. **实现 API 路由** (2 周)
    - 实现添加子版块、抓取帖子和分析帖子的 API 端点。

3. **构建前端页面与组件** (3 周)
    - 创建首页、子版块页面及通用 UI 组件。

4. **集成数据获取与管理** (2 周)
    - 使用 `swr` 进行数据获取，管理状态。

5. **集成 OpenAI** (2 周)
    - 实现帖子分类分析功能，并处理并发请求。

6. **测试与优化** (2 周)
    - 功能测试、性能优化、用户体验优化。

7. **部署与发布** (1 周)
    - 部署应用至生产环境，发布上线。

## 风险与缓解措施

1. **API 限制**:
    - **风险**: Reddit API 和 OpenAI API 的请求限制可能影响数据抓取和分析速度。
    - **缓解措施**: 实现请求节流和缓存机制，优化 API 请求频率。

2. **数据隐私与安全**:
    - **风险**: 用户提交的 Reddit URL 可能包含敏感信息。
    - **缓解措施**: 对用户输入进行严格验证，确保数据安全。

3. **性能瓶颈**:
    - **风险**: 大量数据抓取和并发分析可能导致性能下降。
    - **缓解措施**: 使用高效的数据处理方法，优化并发请求，使用 CDN 进行静态资源加速。

4. **用户体验问题**:
    - **风险**: 界面复杂或响应迟缓可能影响用户体验。
    - **缓解措施**: 进行用户测试，优化界面设计和交互流程。

## 总结

本产品需求文档详细描述了 Reddit AI 分析平台的核心功能、技术需求、文件结构及实施步骤。通过清晰的项目结构和详细的功能规划，开发团队能够高效地进行开发与协作，确保项目按时、按质完成。

在实施过程中，务必遵循文档中的指导，保持代码整洁和模块化设计，以便于未来的维护和扩展。进一步的优化和功能扩展可以基于此基础进行，提升平台的竞争力和用户满意度。

如有任何疑问或建议，请及时与项目负责人沟通，共同推动项目顺利进行。