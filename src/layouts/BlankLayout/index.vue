<template>
  <div class="wrapper">
    <router-view v-slot="{ Component }">
      <transition name="move" mode="out-in">
        <!-- 测试开启keep-alive时，热更新表格渲染会有问题，暂时关闭keep-alive -->
        <!-- <keep-alive :include="tabs.nameList"> -->
        <component :is="Component"></component>
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </div>
</template>
<script setup lang="ts"></script>

<style></style>
