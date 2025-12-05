<template>
  <div class="header" :class="{ collapse: sidebar.collapse }">
    <!-- 折叠按钮 -->
    <div class="header-left">
      <div class="collapse-btn" @click="collapseChange">
        <el-icon v-if="sidebar.collapse">
          <Expand />
        </el-icon>
        <el-icon v-else>
          <Fold />
        </el-icon>
      </div>
      <NavList :menuList="props.menuList" />
    </div>
    <HeaderRight />
  </div>
</template>
<script setup lang="ts">
import { onMounted, PropType } from 'vue';
import { useSidebarStore } from '@/store/sidebar';
import HeaderRight from '@/layouts/components/HeaderRight/index.vue';
import NavList from '@/layouts/components/NavList/index.vue';

const props = defineProps({
  /** header中的菜单列表 */
  menuList: {
    type: Array as PropType<HeaderMenu[]>,
    default: () => [],
  },
});

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
  width: calc(100% - var(--sider-width));
  height: var(--header-height);
  transform: translateX(var(--sider-width));
  color: var(--header-text-color);
  background-color: var(--header-bg-color);
  // border-bottom: 1px solid var(--border-color);
  box-shadow: 0px 2px 4px 0 rgb(29, 35, 41, 0.1);
  transition: all 0.3s ease-in-out;
}

.header.collapse {
  width: calc(100% - var(--collapsed-width));
  transform: translateX(var(--collapsed-width));
}

.header-left {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
}

.collapse-btn {
  position: absolute;
  left: -4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  cursor: pointer;
  opacity: 0.8;
  font-size: 22px;
}

.collapse-btn:hover {
  opacity: 1;
}
</style>
