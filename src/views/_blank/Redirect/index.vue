<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-12-04 19:54:58
 * @LastEditors: kim
 * @LastEditTime: 2024-12-05 11:23:39
 * @Description: 
-->
<template>
  <div class="load-box">
    <span class="loader"></span>
  </div>
</template>

<script setup lang="ts">
import { goLogin, makeLogin } from '@/utils/cache';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();

/** 解析url并验证登录流程 */
const checkLogin = async () => {
  /** 获取url中的token和hash */
  const { sso_token, redirect } = route.query; // 获取url中的token和hash
  const urlHash = redirect || ''; // 获取url中的hash
  if (sso_token) {
    makeLogin(sso_token as string, urlHash as string);
  } else {
    goLogin(401, urlHash as string);
  }
};

onMounted(() => {
  checkLogin();
});
</script>

<style>
.load-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  --d: 44px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  color: #25b09b;
  box-shadow:
    calc(1 * var(--d)) calc(0 * var(--d)) 0 0,
    calc(0.707 * var(--d)) calc(0.707 * var(--d)) 0 1px,
    calc(0 * var(--d)) calc(1 * var(--d)) 0 2px,
    calc(-0.707 * var(--d)) calc(0.707 * var(--d)) 0 3px,
    calc(-1 * var(--d)) calc(0 * var(--d)) 0 4px,
    calc(-0.707 * var(--d)) calc(-0.707 * var(--d)) 0 5px,
    calc(0 * var(--d)) calc(-1 * var(--d)) 0 6px;
  animation: l27 1s infinite steps(8);
}
@keyframes l27 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
