/*
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-29 10:51:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-07-22 11:18:28
 * @Description:
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus, { ElButton, ElTable } from 'element-plus';
import App from './App.vue';
import router from './router';
import 'element-plus/dist/index.css';
import '@/styles/index.scss';

/** global ElementPlus setting */
ElButton.props.plain = { type: Boolean, default: true };
ElTable.TableColumn.props.align = { type: String, default: 'center' };

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
