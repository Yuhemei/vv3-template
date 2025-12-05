<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:58:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-07-22 09:54:09
 * @Description:
-->

# 大唐培训系统后台

## 介绍

S&E前端工程支撑组 V3 开发模板,核心功能以及组件封装在main分支上开发，开发完成以后再rebase到个个子分支

## 安装

推荐使用 pnpm 安装

```bash
pnpm i
```

## 运行

```bash
pnpm run dev 或者 vite
```

## 打包

```bash
pnpm run build
```

## 格式化

```bash
pnpm run format
```

## 目录结构

### src

```sh
src
├── App.vue # 入口文件
├── api # api接口
├── assets # 静态资源
│   ├── css # 样式文件
│   │   ├── icon.css # 图标样式
│   │   └── main.css  # 全局样式
│   ├── img # 图片资源
│   └── svg_icons # svg图标
├── components # 公共组件
│   ├── CardCom # 卡片组件
│   ├── Charts # 图表组件
│   ├── CountUp # 数字动画组件
│   ├── ElementPlus # ElementPlus组件
│   │   ├── DatePickerRange.vue # 日期范围选择器
│   │   └── PageHeader.vue # 页面头部
│   ├── Markdown # Markdown组件
│   │   └── Edit.vue # Markdown编辑器
│   ├── PageCom # 页面组件
│   │   └── TableTemplate.vue # 表格模板
│   ├── RowSelect # 行选择组件
│   ├── SvgIcon # Svg图标组件
│   ├── SwiperCom # 轮播图组件
│   ├── Table # 表格组件
│   │   ├── TableCustom.vue # 自定义表格
│   │   ├── TableDetail.vue # 表格详情
│   │   ├── TableEdit.vue # 表格编辑
│   │   └── TableSearch.vue # 表格搜索
│   ├── ToggleIcon # 切换图标组件
│   ├── Unity # Unity组件
│   ├── Uploader # 上传组件
│   ├── VideoPlayer # 视频播放组件
│   └── common # 公共组件单独抽离
│       ├── attackNoticeMessage.vue
│       ├── guacamole
│       │   ├── LICENSE
│       │   ├── NOTICE
│       │   ├── README.md
│       │   ├── dist
│       │   │   ├── guacamole-common.js
│       │   │   └── guacamole-common.min.js
│       │   └── package.json
│       ├── guacamolePlay.vue
│       ├── noticeMessage.vue
│       └── renderPdf.vue
├── layouts # 布局
│   ├── BaseLayout # 基础布局
│   └── BlankLayout # 空白布局
├── main.ts # 入口文件
├── router # 路由
│   ├── elegant #  路由配置(通过elegant-router插件自动生成)
│   │   ├── imports.ts # 导入路由
│   │   ├── routes.ts # 路由配置
│   │   └── transform.ts # 路由转换
│   ├── index.ts # 路由入口
│   ├── menu.ts # 菜单配置
│   └── routes # 路由配置
│       └── index.ts # 路由配置
├── store # 状态管理(Pinia)
├── types # 类型定义
├── typings # 类型定义(针对自动路由)
│   └── elegant-router.d.ts # 自动路由类型定义
├── utils # 工具函数
│   ├── cache.ts # 缓存工具
│   ├── china.ts # 中国行政区划工具
│   ├── datetime.ts # 日期时间工具
│   ├── index.ts # 工具函数入口
│   └── request.ts # 请求工具(axios封装)
├── views # 页面
└── vite-env.d.ts # vite环境变量
```

## 检查项目中的依赖项是否有新版本

```bash
pnpm outdated


┌──────────────────────────┬─────────┬─────────┐
│ Package                  │ Current │ Latest  │
├──────────────────────────┼─────────┼─────────┤
│ typescript (dev)         │ 5.5.4   │ 5.7.2   │
├──────────────────────────┼─────────┼─────────┤
│ @types/node (dev)        │ 20.17.8 │ 22.10.0 │
├──────────────────────────┼─────────┼─────────┤
│ @vitejs/plugin-vue (dev) │ 3.2.0   │ 5.2.1   │
├──────────────────────────┼─────────┼─────────┤
│ @vueuse/core             │ 10.11.1 │ 11.3.0  │
├──────────────────────────┼─────────┼─────────┤
│ md-editor-v3             │ 2.11.3  │ 5.0.2   │
├──────────────────────────┼─────────┼─────────┤
│ vite (dev)               │ 3.2.11  │ 6.0.0   │
├──────────────────────────┼─────────┼─────────┤
│ vue-echarts              │ 6.7.3   │ 7.0.3   │
├──────────────────────────┼─────────┼─────────┤
│ vue-tsc (dev)            │ 0.38.9  │ 2.1.10  │
└──────────────────────────┴─────────┴─────────┘

```

## 更新依赖项

```bash
pnpm update
```

## 版本控制

使用git进行版本控制，推荐使用`git cz`命令进行提交，提交代码时请遵循以下规范：

1. 提交信息格式：`<type>: <short summary>`，其中`<type>`为提交类型，`<short summary>`为简短的描述。
2. 提交类型：
   - feat: 新功能（feature）
   - fix: 修复bug
   - docs: 文档更新
   - style: 代码格式（不影响代码运行的变动）
   - refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
   - perf: 性能优化
   - test: 增加测试用例
   - chore: 构建过程或辅助工具的变动
   - revert: 回滚到上一个版本
3. 提交信息示例：
   - feat: 添加用户登录功能
   - fix: 修复登录页面样式问题
   - docs: 更新README.md文件
4. git命令示例：

   ```bash
   git add .
   git commit -m "feat: 添加用户登录功能"
   git fetch origin/main
   git rebase origin/main
   git push origin main
   ```

   或者

   ```bash
   git add .
   git commit -m "feat: 添加用户登录功能"
   git pull origin main
   git push origin main
   ```

## 项目配置

### 1. 配置文件

1. 项目根目录下有一个`.env`文件，用于配置环境变量。你可以根据需要修改其中的配置项。
2. `public/configure/config.js`文件，用于配置项目配置项。

### 2. 路由配置

项目使用`elegant-router`插件自动生成路由配置。你可以在`src/router/elegant/routes.ts`文件中添加或修改路由配置。

### 3. 状态管理

1. 项目使用`pinia`进行状态管理。你可以在`src/store`文件夹中添加或修改状态管理。
   a. 用户鉴权信息信息存储在`src/store/user.ts`文件中。
2. 项目使用`vue-router`进行路由管理。你可以在`src/router`文件夹中添加或修改路由管理。

## 项目结构

```

## 常见问题&&解决办法

## 相关资料

```
