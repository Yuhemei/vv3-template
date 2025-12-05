<template>
  <div class="nav-list">
    <div class="web-title">{{ viewStore.name }}</div>
    <div class="nav-list-container">
      <div
        v-for="menu in menuList"
        :key="menu.text"
        :class="{
          active: route.fullPath.startsWith(menu.path.toLowerCase()),
        }"
        class="nav-list-item flex items-center"
        @click="changeCurrentMenu(menu)"
        style="gap: 5px"
        text
      >
        <SvgIcon v-if="menu.icon" :icon-class="menu.icon" />
        <SvgIcon v-else icon-class="comp" />
        {{ menu.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useViewStore from '@/store/vi';
import useUserStore from '@/store/user';
import SvgIcon from '@/components/SvgIcon/index.vue';
import 'virtual:svg-icons-register';

const userStore = useUserStore();

const viewStore = useViewStore();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  menuList: {
    type: Array as PropType<HeaderMenu[]>,
    default: () => [],
  },
});

const menuList = computed(() => {
  return props.menuList.filter(item => userStore.inPermissionList(item.path));
});

const changeCurrentMenu = (menu: HeaderMenu) => {
  router.push(menu.redirect || menu.path);
};
</script>

<style scoped lang="scss">
.nav-list {
  display: flex;
  align-items: center;
  padding-left: 24px;
}

.web-title {
  margin: 0;
  padding: 0 8px;
  font-size: 22px;
  text-align: center;
  color: var(--header-text-color);
}

.active {
  color: var(--header-active-color);
}

.nav-list-container {
  display: flex;
  align-items: center;
  gap: 20px;
  overflow-x: auto;
  width: 100%;
  .nav-list-item {
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 20px;
    &:hover {
      color: var(--header-active-color);
    }
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', 微软雅黑, sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 16px;
    text-align: left;
  }
}
</style>
