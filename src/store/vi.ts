/*
 * @Date: 2025-08-01 15:04:44
 */
import { defineStore } from 'pinia';
import { getSystemConfigApi } from '@/api/home';

export const useViewStore = defineStore('vi', {
  state: () => ({
    copyright: '',
    icon: '',
    logo: '',
    name: '',
    sLogo: '',
  }),
  actions: {
    initView() {
      getSystemConfigApi().then((res: SystemConfigResponse) => {
        this.copyright = res.data.copyright;
        this.icon = res.data.icon;
        this.logo = res.data.logo;
        this.name = res.data.name;
        this.sLogo = res.data.sLogo;
        // 修改网页ico
        document.querySelector('link[rel="icon"]')?.setAttribute('href', this.icon);
        // 修改网页标题
        document.title = this.name;
      });
    },
  },
});

export default useViewStore;
