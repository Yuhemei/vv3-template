<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:34:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-11 17:51:13
 * @Description: 菜单layout header
-->
<script setup lang="ts">
import { useSidebarStore } from '@/store/sidebar';
import Header from './components/Header.vue';
import Sidebar from './components/SideBar.vue';
import RouteTabs from '../components/RouteTabs/index.vue';
import { menuData } from '@/config/menu';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { menuListConfig } from '@/config';

const sidebar = useSidebarStore();
// const tabs = useTabsStore();
/** header列表 */
const menuListShow = menuListConfig.filter(item => item.isHeaderVisible);
const menuList = ref<HeaderMenu[]>(menuListShow);

/** 当前菜单 */
const sideBarList = ref();

/** 切换头部路由 */
const changeMenu = (path: string) => {
  sideBarList.value = menuData.find(item => item.index === path)?.children;
};

/** 监听路由变化,切换sideBar菜单 */
const route = useRoute();
watch(
  () => route.matched[0].path,
  newVal => {
    changeMenu(newVal);
  },
  { immediate: true },
);

const keepAliveList = computed(() => {
  return ['edu_subject_list', 'edu_question_list', 'edu_course_list', 'edu_test_list'];
});
</script>

<template>
  <div class="wrapper">
    <Header :menu-list="menuList" />
    <Sidebar :menu-data="sideBarList" />
    <div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
      <RouteTabs />
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <!-- 测试开启keep-alive时，热更新表格渲染会有问题，暂时关闭keep-alive -->
            <keep-alive :include="keepAliveList">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  height: 100vh;
  overflow: hidden;
}

.content-box {
  height: calc(100vh - 72px);
  overflow: auto;
  position: absolute;
  left: var(--side-width);
  right: 0;
  top: calc(var(--header-height) + 2px);
  bottom: 0;
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
}

.content {
  width: auto;
  height: calc(100% - 40px);
  padding: 20px;
  overflow-y: scroll;
  box-sizing: border-box;
}

.content::-webkit-scrollbar {
  width: 0;
}

.content-collapse {
  left: 65px;
}
</style>
