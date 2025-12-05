<template>
  <div class="tabs-container">
    <el-tabs v-model="activePath" class="tabs" type="card" closable @tab-click="clickTabs" @tab-remove="closeTabs">
      <el-tab-pane
        v-for="item in tabs.list"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        @click="setTags(item)"
      >
        <template #label>
          <ChromeTabBg class="tab-bg" />
          <p class="tab-title" @contextmenu.prevent.native="actionContextmenu($event, item)">
            <SvgIcon v-if="item.icon" class="icon" :iconClass="item.icon || ''" />
            <span>{{ item.title }}</span>
          </p>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="fixed" :style="{ top: `${y}px`, left: `${x}px` }">
      <ElDropdown ref="dropdown" popper-class="arrow-hide" trigger="click" @command="handleTags">
        <!-- Avoid waning: [ElOnlyChild] no valid child node found -->
        <span></span>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem v-for="{ key, label, icon } in options" :key="key" :command="key">
              <SvgIcon v-if="icon" class="icon" :iconClass="icon || ''" />
              <span class="ml-5px">{{ label }}</span>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChromeTabBg from './ChromeTabBg.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import 'virtual:svg-icons-register';
import { ref, watch } from 'vue';
import { useTabsStore } from '@/store/tabs';
import { onBeforeRouteUpdate, onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import type { DropdownInstance, TabPaneName } from 'element-plus';
import { tabsListExceptConfig, tabsListAddConfig } from '@/config';

const route = useRoute();
const router = useRouter();
const activePath = ref(route.fullPath);
const tabs = useTabsStore();

const selectedRoute = ref(null);
/**
 * 设置标签
 */
const setTags = (route: any) => {
  const isExist = tabs.list.some(item => {
    return item.path === route.fullPath;
  });
  // 判断是否需要添加标签页
  if (!isExist && !tabsListExceptConfig.some(item => route.path.startsWith(item))) {
    if (tabsListAddConfig.find(item => item.path === route.path)) {
      const tabItem = tabsListAddConfig.find(item => item.path === route.path) || {
        meta: { title: route.meta.title || '未命名', icon: route.meta.icon || '' },
      };
      tabs.setTabsItem({
        ...route,
        ...tabItem,
      });
    } else {
      tabs.setTabsItem(route);
    }
  }
};
setTags(route);

// 同级别路由切换触发,如/system/user=>/system/role
onBeforeRouteUpdate(setTags);

// 不同级的路由切换触发,如/system/user=>/table/basetable
onBeforeRouteLeave(setTags);

// 关闭全部标签
const closeAll = () => {
  tabs.clearTabs(router);
};
// 关闭其他标签
const closeOther = () => {
  const curItem = tabs.list.filter(item => {
    return item.path === route.fullPath;
  });
  tabs.closeTabsOther(curItem);
};
const handleTags = (command: string) => {
  const routeJson = selectedRoute.value || route;
  switch (command) {
    case 'closeCurrent':
      // 关闭当前页面的标签页
      tabs.closeCurrentTag({
        $router: router,
        $route: routeJson,
      });
      break;
    case 'closeAll':
      closeAll();
      break;
    case 'closeOther':
      closeOther();
      break;
    case 'closeLeft':
      tabs.closeLeftTabs({
        $router: router,
        $route: routeJson,
      });
      break;
    case 'closeRight':
      tabs.closeRightTabs({
        $router: router,
        $route: routeJson,
      });
      break;
  }
};

const clickTabs = (item: any) => {
  router.push(item.props.name);
};
const closeTabs = (path: TabPaneName) => {
  const index = tabs.list.findIndex(item => item.path === path);
  tabs.delTabsItem(index);
  const item = tabs.list[index] || tabs.list[index - 1];
  router.push(item ? item.path : '/');
};

watch(
  () => route.fullPath,
  (newVal, _oldVal) => {
    activePath.value = newVal;
  },
);

const options = [
  { key: 'closeCurrent', label: '关闭', icon: 'close' },
  { key: 'closeOther', label: '关闭其它', icon: 'close_other' },
  { key: 'closeLeft', label: '关闭左侧', icon: 'close_left' },
  { key: 'closeRight', label: '关闭右侧', icon: 'close_right' },
  { key: 'closeAll', label: '关闭所有', icon: 'close_all' },
];

const x = ref(0);
const y = ref(0);
const dropdown = ref<DropdownInstance>();
/** 右键菜单呼出 */
const actionContextmenu = (e: MouseEvent, item: any) => {
  selectedRoute.value = item;
  dropdown.value!.handleClose();
  setTimeout(() => {
    x.value = e.clientX + 55;
    y.value = e.clientY - 10;
    dropdown.value!.handleOpen();
  }, 100);
};
</script>

<style lang="scss">
.arrow-hide {
  .el-popper__arrow {
    display: none;
  }
}
.ml-5px {
  margin-left: 5px;
}
.tabs-container {
  position: relative;
  overflow: hidden;
  background: var(--content-bg);
  padding: 2px 10px 0 0;

  .tab-title,
  .el-icon {
    position: relative;
    left: 8px;
    top: 4px;
    z-index: 20;
  }

  .tab-title {
    .icon {
      vertical-align: top;
      font-size: 18px;
      margin-right: 10px;
      display: inline-block;
    }
  }

  .el-icon {
    left: 12px;

    &.el-icon--right {
      left: 6px;
      top: 0;
    }
  }

  .tab-bg {
    color: transparent;
  }

  .tab-title {
    color: var(--color900);
  }

  svg {
    display: inline-block;
  }

  .tabs {
    .el-tabs__header {
      margin-bottom: 0;
      border: none;

      .el-tabs__nav {
        height: 38px;
        border: none;
      }

      .el-tabs__item {
        border: none;
        padding: 0 16px !important;

        .is-icon-close {
          width: 14px;
        }

        &::after {
          content: '';
          position: absolute;
          right: -11px;
          top: 11px;
          width: 2px;
          height: 20px;
          background-color: rgba(0, 0, 0, 0.1);
        }

        &:hover {
          .tab-bg {
            color: var(--side-hover-bg-color);
          }
        }

        &.is-active {
          .tab-bg {
            color: var(--main-bg);
            z-index: 15;
          }

          &::after {
            opacity: 0;
          }
        }
      }
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: 32px;
    }

    &.el-tabs {
      --el-tabs-header-height: 38px;
      padding-left: 20px;
    }
  }
}

.Tabs-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 40px;
  background: var(--content-bg-color);
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;

  .el-dropdown {
    margin-top: 6px;
  }
}
</style>
