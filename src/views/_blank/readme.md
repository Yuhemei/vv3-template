# 文件说明

## 路由说明

以下划线 \_ 开头的文件夹名称会被忽略，不会出现在路由中，其下的文件会被聚合到上一级的路由中

### 文件夹结构

views
├── \_blank
│ ├── Register
│ │ └── index.vue

### 生成的路由

```js
{
  name: 'register',
  path: '/register',
  component: 'layout.base$view.register',
  meta: {
    title: 'register',
    icon: 'register', // icon需要 生成路由后后手动设置
  }
},
```
