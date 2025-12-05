/*
 * @Date: 2025-04-08 14:22:57
 */
import { defineStore } from 'pinia';
import { RoleId } from '@/types/role.ts';

/** 用户权限映射 */
const userPermissionMap = {
  manager: ['/system'],
  teacher: ['/system'],
  student: ['/system'],
};

const useUserStore = defineStore('user', {
  state: () => ({
    /** 用户信息 */
    info: {
      id: 1,
      name: '管理员',
      email: 'admin@example.com',
      phone: '12345678901',
      role: 'manager',
      date: '2021-01-01',
      nickName: '管理员',
      avatar: 'https://example.com/avatar.png',
      roleList: ['manager'],
    },
    /** 角色id列表 */
    role: ['manager'] as RoleId[],
    /** 角色名称列表 */
    roleName: '管理员',
    /** 权限列表 */
    permissionList: ['/system'],
    /** 白名单 */
    whiteList: ['/403', '/404', '/500', '/redirect', '/layout', '/ucenter', '/401'],
  }),
  getters: {
    getUser: state => state.user,
    getRole: state => state.role,
    getRoleName: state => state.roleName,
    homePagePath: state => FT_CONFIG.redirectPageMap[state.role[0]],
    getPermissionList: state => state.permissionList,
    getWhiteList: state => state.whiteList,
  },
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    setRole(role: string[]) {
      this.role = role;
      // 根据用户角色列表获取权限列表
      role.forEach(item => {
        this.permissionList.push(...userPermissionMap[item as keyof typeof userPermissionMap]);
      });
      // 去重
      this.permissionList = Array.from(new Set(this.permissionList));
    },
    setRoleName(roleName: string[]) {
      this.roleName = roleName;
    },
    initUser() {
      /** todo 获取用户信息 */
    },
  },
});

export default useUserStore;
