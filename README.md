# 人力资源后台管理系统

## 项目简介

基于 [Vue Element Admin](https://github.com/PanJiaChen/vue-admin-template) 框架开发的完整人力资源管理系统，包含组织架构、角色管理、员工管理、权限控制等核心模块，适合企业级后台管理系统开发。

## 技术栈

- **前端**: Vue.js 2.7.0 + Element UI 2.15.13
- **状态管理**: Vuex 3.6.5
- **路由**: Vue Router 3.5.3
- **网络请求**: Axios + Vue CLI 代理
- **图表**: ECharts
- **文件上传**: Tencent Cloud Object Storage (COS)
- **构建工具**: Webpack 4.56.1
- **部署**: Nginx 1.23.3

## 目录结构

```bash
├── src/                  # 源代码目录
│   ├── api/               # API 请求模块
│   ├── assets/            # 静态资源
│   ├── components/         # 全局组件
│   ├── icons/             # SVG 图标资源
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── store/              # Vuex 状态管理
│   └── views/             # 业务页面
├── public/                # 静态资源（生产环境）
├── .env.*                 # 环境变量配置
├── package.json           # 项目依赖
└── vue.config.js          # Webpack 配置
```

## 快速开始

### 1. 本地开发环境准备（从零开发准备）

```bash
# 克隆项目模板
git clone https://github.com/PanJiaChen/vue-admin-template.git heimahr

# 修改 core-js 版本
npm install core-js@3.25.5 --save

# 安装依赖
yarn install

# 接口文档
https://apifox.com/apidoc/shared-e2644216-aad4-4529-a630-78f0631ab076/api-45197376
```

### 2. 启动开发服务器

```bash
npm run dev
```

> 启动前nodejs版本降级到16；方法见文档末尾

### 3. 生产环境构建

```bash
yarn build:prod
```

## 核心功能模块

### 1. 权限控制系统

- **RBAC 动态路由**：基于用户权限生成可访问路由
- **按钮级权限**：通过自定义指令 `v-permission` 控制功能按钮显示
- **数据级权限**：在查询接口中自动过滤敏感数据

### 2. 主要业务模块


| 模块名称 | 功能描述                     |
| -------- | ---------------------------- |
| 组织架构 | 树形结构展示部门层级         |
| 角色管理 | 角色创建、权限分配           |
| 员工管理 | 员工信息维护、Excel 导入导出 |
| 权限管理 | 权限点增删改、角色权限分配   |
| 工资管理 | （预留扩展接口）             |

### 3. 技术亮点

- **跨域解决方案**：Vue CLI 代理开发环境，Nginx 反向代理生产环境
- **表单验证**：集成 Element UI 表单校验规则
- **树形组件**：递归渲染组织架构树
- **动态图表**：基于 ECharts 的实时数据可视化
- **第三方存储**：集成腾讯云 COS 文件上传

## 运行与部署

### 开发环境配置

在 `vue.config.js` 中配置代理：

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://heimahr.itheima.net',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
```

### 生产环境部署

1. 将 `dist/` 文件夹部署到 Nginx 服务器
2. 修改 Nginx 配置文件 `nginx.conf` 添加反向代理：

```nginx
location /prod-api/ {
  proxy_pass https://heimahr.itheima.net/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
```

> # 安装nodejs
>
> 1.清空文件夹，卸载nvm及nodejs
>
> 2.下载安装包 https://github.com/coreybutler/nvm-windows/releases （也下载有）
>
> 3.安装nvm 地址写D:/nvm和D:/nodejs
>
> 4.安装nodejs
>
> ```bash
> nvm ls available  //查询版本
> nvm install 16.20.2  //安装对应版本号
> nvm use 16.20.2  //使用对应版本号nodejs
> node -v  
> nvm -v  //查看版本号
> ```
>
> 5.设置缓存和全局路径
>
> ```
> ①在nodejs目录下创建 node_cache 和 node_global 文件夹，执行下列代码
> ```
>
> ```bash
> npm config set prefix "D:\nodejs\node_global"
> npm config set cache "D:\nodejs\node_cache"
> ```
>
> 并将全局添加至path环境变量
>
> 安装yarn
>
> ```
> npm install --global yarn
> ```
>
> # 切换
>
> 若是要切换node版本无需卸载重新安装，以下步骤
>
> 1. 安装指定node.js版本
>
>    ```
>    nvm install 16.14.0
>    ```
> 2. `nvm use` 切换node版本。(如果报错，用管理员身份打开重新 `nvm use` 指定的版本）
>
>    ```
>    nvm use 16.14.0
>    ```
> 3. `nvm list` 查看当前已安装的node.js版本，带*号的是正在使用的
>
>    ```
>    nvm list或者nvm ls
>    ```
> 4. 删除某node.js版本
>
>    ```
>    nvm uninstall node版本号  //例如：nvm uninstall 16.14.0）即可删除对应版本
>    ```
