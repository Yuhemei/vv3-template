<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:34:30
 * @LastEditors: kim
 * @LastEditTime: 2024-12-03 12:36:37
 * @Description: 
-->
<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useThemeStore } from './store/theme';
import useUserStore from './store/user';
import { getToken } from './utils/cache';
import { onMounted } from 'vue';

const theme = useThemeStore();
theme.initTheme();

onMounted(() => {
  // 如果token存在，则初始化用户信息
  if (getToken()) {
    const userStore = useUserStore();
    userStore.initUser();
  }
});
</script>
