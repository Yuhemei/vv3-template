/*
 * @Description: tabs标签
 */
import { matchMenuByPath } from '@/config/menu';
import { defineStore } from 'pinia';
import { Router } from 'vue-router';
import { tabsListExceptConfig } from '@/config';

interface ListItem {
  name: string;
  path: string;
  title: string;
  icon: string;
}

export const useTabsStore = defineStore('tabs', {
  state: () => {
    return {
      list: <ListItem[]>[],
    };
  },
  getters: {
    show: state => {
      return state.list.length > 0;
    },
    nameList: state => {
      return state.list.map(item => item.name);
    },
  },
  actions: {
    delTabsItem(index: number) {
      this.list.splice(index, 1);
    },
    setTabsItem(route: any) {
      const obj = matchMenuByPath(route.path);
      /** 获取标题后缀, 如果存在titleSuffix，则添加到标题后面
       * 例如：
       * 1. 路由配置：router.push({path:'/user/list',meta:{ title: '用户管理',titleSuffix:'123' }})
       * 2. 路由地址：/user/list?meta={"title":"用户管理","titleSuffix":"123"}
       * 3. 最终显示的标题：用户管理-123
       * 4. 如果meta中没有titleSuffix，则不添加后缀，显示标题为：用户管理
       */
      const titleSuffix = route.query.meta ? '-' + JSON.parse(route.query.meta).titleSuffix : '';
      const json: ListItem = {
        name: route.name,
        title: (obj.title || route.meta.title) + titleSuffix,
        path: route.fullPath,
        icon: obj.icon || route.meta.icon,
      };
      /** 如果路由地址在tabsListExceptConfig中，则不添加到tabs中 */
      if (tabsListExceptConfig.includes(route.fullPath)) return;
      this.list.push(json);
    },
    clearTabs(router: Router) {
      this.list = [];
      router.push('/');
    },
    closeTabsOther(data: ListItem[]) {
      this.list = data;
    },
    closeCurrentTag(data: any) {
      for (let i = 0, len = this.list.length; i < len; i++) {
        const item = this.list[i];
        if (item.path === data.$route.path) {
          if (i < len - 1) {
            data.$router.push(this.list[i + 1].path);
          } else if (i > 0) {
            data.$router.push(this.list[i - 1].path);
          } else {
            data.$router.push('/');
          }
          this.list.splice(i, 1);
          break;
        }
      }
    },
    closeLeftTabs(data: any) {
      const len = this.list.length;
      if (len === 1) return;
      for (let i = 0; i < len; i++) {
        const item = this.list[i];
        if (item.path === data.$route.path) {
          this.list.splice(0, i);
          break;
        }
      }
      data.$router.push(this.list[0].path);
    },
    closeRightTabs(data: any) {
      const len = this.list.length;
      if (len === 1) return;
      for (let i = 0; i < len; i++) {
        const item = this.list[i];
        if (item.path === data.$route.path) {
          this.list.splice(i + 1);
          break;
        }
      }
      data.$router.push(this.list[this.list.length - 1].path);
    },
  },
});
