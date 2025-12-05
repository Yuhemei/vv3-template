<template>
  <div class="header collapse">
    <!-- 折叠按钮 -->
    <div class="header-left">
      <Logo />
    </div>
    <HeaderRight is-home />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useSidebarStore } from '@/store/sidebar';
import 'virtual:svg-icons-register';

import HeaderRight from '@/layouts/components/HeaderRight/index.vue';
import Logo from '@/layouts/components/Logo/index.vue';

const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChange = () => {
  sidebar.handleCollapse();
};

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChange();
  }
});
</script>
<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: var(--header-height);
  color: var(--header-text-color);
  background-color: var(--header-bg-color);
  // border-bottom: 1px solid var(--border-color);
  box-shadow: 0px 2px 4px 0 rgb(29, 35, 41, 0.1);
  transition: all 0.3s ease-in-out;
}

.header.collapse {
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
