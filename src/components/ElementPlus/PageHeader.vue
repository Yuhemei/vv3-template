<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-10 18:19:10
 * @LastEditors: luyang<luyang@fengtaisec.com>
 * @LastEditTime: 2024-11-26 10:51:09
 * @Description: 
-->
<template>
  <el-page-header @back="goBack" class="mb-3">
    <template #content>
      <span class="text-large font-600 mr-3 mb-5">{{ props.title }}</span>
    </template>
  </el-page-header>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});

const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>
