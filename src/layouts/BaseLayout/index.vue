<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:34:30
 * @LastEditors: zhangfei<zhangfei@fengtaisec.com>
 * @LastEditTime: 2024-12-07 17:04:40
 * @Description: 菜单layout header
-->
<script setup lang="ts">
import Header from './components/Header.vue';
import RouteTabs from '../components/RouteTabs/index.vue';
import { ref } from 'vue';
import { menuListConfig } from '@/config';

/** header列表 */
const menuListShow = menuListConfig.filter(item => item.isHeaderVisible);
const menuList = ref<HeaderMenu[]>(menuListShow);
</script>

<template>
  <div class="wrapper">
    <Header :menu-list="menuList" />
    <div class="content-box">
      <RouteTabs />
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <!-- 测试开启keep-alive时，热更新表格渲染会有问题，暂时关闭keep-alive -->
            <!-- <keep-alive :include="tabs.nameList"> -->
            <component :is="Component"></component>
            <!-- </keep-alive> -->
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
  left: 0;
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
</style>
