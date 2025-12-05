/$$ $ @Date: 2025-07-30 14:35:10 $/
<template>
  <div
    class="logo cursor-pointer"
    :style="{ backgroundColor: theme.headerBgColor }"
    @click="router.push({ path: '/' })"
  >
    <img :src="`/images/${logoUrl}`" :class="{ collapse: props.isCollapse }" alt="" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getDeltaE } from '@sa/color';
import { useThemeStore } from '@/store/theme.ts';
import { useRouter } from 'vue-router';

const theme = useThemeStore();
const router = useRouter();

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});
const logoUrl = computed(() => {
  let logoName = 'logo_black.png';
  const delta = getDeltaE('#ffffff', theme.headerBgColor);
  // 当前背景色与白色背景色差异大于0.1则使用白色logo
  if (delta > 0.1) {
    logoName = 'logo_white.png';
  }
  return props.isCollapse ? 'logo_small.png' : logoName;
});
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sider-width);
  height: var(--header-height);
  text-align: center;
  transition: 0.3s all ease-in-out;

  img {
    max-width: 90%;
    max-height: 90%;
    vertical-align: middle;
  }

  &:after {
    content: '';
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
