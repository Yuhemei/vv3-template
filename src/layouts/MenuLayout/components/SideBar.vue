<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '@/store/sidebar';
import { useRoute, useRouter } from 'vue-router';
import SvgIcon from '@/components/SvgIcon/index.vue';
import 'virtual:svg-icons-register';
import { Menus } from '@/types/menu';
import Logo from '@/layouts/components/Logo/index.vue';

const props = defineProps({
  menuData: {
    type: Array as () => Menus[],
    default: () => [],
  },
});

// 合并路由权限
const router = useRouter();
const routes = router.getRoutes();

updateMenuData(props.menuData);

/** 递归循环menuData，设置icon */
function updateMenuData(menuData: Menus[]) {
  for (const item of menuData) {
    setIcon(item);
    if (item.children) {
      updateMenuData(item.children);
    }
  }
}
/** 设置icon */
function setIcon(item: Menus) {
  const routeItem = routes.find(route => route.path === item.index);
  if (routeItem) {
    // icon与图标相关，使用svg图标
    item.icon = item.icon || (routeItem.meta.icon as string) || 'system';

    // id与权限相关，如没有id则使用路由meta.permiss
    item.id = item.id || (routeItem.meta.permiss as string);
  }
}

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<template>
  <div class="sidebar" :class="{ collapse: sidebar.collapse }">
    <Logo :is-collapse="sidebar.collapse" />
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      :background-color="sidebar.bgColor"
      :text-color="sidebar.textColor"
      router
    >
      <template v-for="item in menuData">
        <template v-if="item.children">
          <el-sub-menu :index="item.index" :key="item.index">
            <template #title>
              <SvgIcon class="icon" :icon-class="item.icon || 'menu_son'" />
              <span class="title-span1-i">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-sub-menu v-if="subItem.children" :index="subItem.index" :key="subItem.index">
                <template #title>
                  <SvgIcon class="icon" :icon-class="subItem.icon || 'menu_son'" />
                  <span class="title-span2-i">{{ subItem.title }}</span>
                </template>
                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.index">
                  <template #title>
                    <SvgIcon class="icon" :icon-class="threeItem.icon || 'menu_son'" />
                    <span class="title-span3">{{ threeItem.title }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index">
                <template #title>
                  <SvgIcon class="icon" :icon-class="subItem.icon || 'menu_son'" />
                  <span class="title-span2">{{ subItem.title }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <SvgIcon class="icon" :icon-class="item.icon || 'menu_son'" />
            <template #title>
              <span class="title-span1">{{ item.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<style scoped lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  z-index: 100;
  box-shadow: 2px 0 8px 0 rgb(29, 35, 41, 0.05);
  background-color: var(--sidebar-bg-color);
  color: var(--sidebar-text-color);

  &.collapse {
    .logo {
      width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2 + 16px);
    }
  }

  .icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: var(--side-width);
}

.sidebar-el-menu {
  min-height: calc(100vh - 70px);
  padding: 0 8px;
  border: none;

  &.el-menu--collapse {
    width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2 + 16px);
  }

  .el-sub-menu {
    &.is-active {
      :deep(.el-sub-menu__title) {
        color: var(--el-menu-active-color);
      }
    }
  }

  .el-menu-item,
  :deep(.el-sub-menu__title) {
    // width: 100%;
    margin-bottom: 1px;

    &.is-active,
    &:hover {
      color: var(--sidebar-active-color);
      border-radius: var(--el-card-border-radius);
      //background-color: var(--side-hover-bg-color);
    }

    .icon {
      font-size: 20px;
      margin-right: 5px;
    }
  }

  .title-span1,
  .title-span1-i,
  .title-span2,
  .title-span2-i,
  .title-span3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title-span1 {
    width: calc(var(--side-width) - 90px);
  }

  .title-span1-i {
    width: calc(var(--side-width) - 110px);
  }

  .title-span2 {
    width: calc(var(--side-width) - 110px);
  }

  .title-span2-i {
    width: calc(var(--side-width) - 130px);
  }

  .title-span3 {
    width: calc(var(--side-width) - 125px);
  }
}
</style>
