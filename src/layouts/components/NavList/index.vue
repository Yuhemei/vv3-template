/$$ $ @Date: 2025-07-30 11:42:01 $/
<template>
  <div class="nav-list">
    <div class="web-title">{{ title }}</div>
    <el-button
      v-for="menu in props.menuList"
      :key="menu.text"
      :type="route.fullPath.startsWith(menu.path.toLowerCase()) ? 'primary' : 'default'"
      @click="changeCurrentMenu(menu)"
      text
    >
      {{ menu.text }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const title = FT_CONFIG.title;

const props = defineProps({
  menuList: {
    type: Array as PropType<HeaderMenu[]>,
    default: () => [],
  },
});

const changeCurrentMenu = (menu: HeaderMenu) => {
  router.push(menu.path);
};
</script>

<style scoped lang="scss">
.nav-list {
  display: flex;
  align-items: center;
  padding-left: 24px;
}

.web-title {
  margin: 0 40px 0 10px;
  font-size: 22px;
}
</style>
