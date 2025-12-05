import path from 'path';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import ElegantVueRouter from '@elegant-router/vue/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig(config => {
  const { mode } = config;
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      // 允许你在 Vue 组件的 <script setup> 中使用 name 属性
      VueSetupExtend(),
      // 路由插件，自动生成路由配置
      ElegantVueRouter({
        alias: { '@': 'src' },
        layouts: {
          base: 'src/layouts/BaseLayout/index.vue',
          menu: 'src/layouts/MenuLayout/index.vue',
          blank: 'src/layouts/BlankLayout/index.vue',
        },
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg_icon')],
        // 指定symbolId格式
        symbolId: 'icon-[name]',
      }),
      // 允许在index.html中使用环境变量 VITE_BASE_URL，VITE_APP_TITLE
      createHtmlPlugin({
        inject: {
          data: { VITE_BASE_URL: env.VITE_BASE_URL, VITE_APP_TITLE: env.VITE_APP_TITLE },
        },
      }),
    ],
    resolve: {
      alias: { '@': '/src', '~': '/src/assets' },
    },
    server: {
      host: true,
      cors: true,
      proxy: {
        '^/proxyApi': {
          target: 'https://api.fengchuang.tech:55102/mock/2226',
          // target: 'https://172.17.2.153/',
          secure: false,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/proxyApi/, ''),
        },
      },
    },
    esbuild:
      mode === 'production'
        ? {
            drop: ['console', 'debugger'],
            legalComments: 'none',
          }
        : undefined,
    build: {
      // 设置最终构建的浏览器兼容目标
      target: 'es2015',
      // 构建后是否生成 source map 文件
      sourcemap: false,
      //  chunk 大小警告的限制（以 kbs 为单位）
      chunkSizeWarningLimit: 2000,
      // 启用/禁用 gzip 压缩大小报告
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          dir: 'dist' + env.VITE_BASE_URL,
          // 分别配置不同文件类型的输出路径
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.(css)$/.test(name ?? '')) {
              return 'static/css/[name]-[hash].[ext]';
            }
            if (/\.(png|jpe?g|gif|svg)$/.test(name ?? '')) {
              return 'static/images/[name]-[hash].[ext]';
            }
            // 默认情况下
            return 'static/assets/[name]-[hash].[ext]';
          },
        },
      },
    },
    define: {
      // 启用生产环境构建下激活不匹配的详细警告
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
  };
});
