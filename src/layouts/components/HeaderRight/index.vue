<script setup lang="ts">
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/SvgIcon/index.vue';
import 'virtual:svg-icons-register';
import { ref } from 'vue';
import useUserStore from '@/store/user';

const userStore = useUserStore();
const props = defineProps({
  isHome: {
    type: Boolean,
    default: false,
  },
});
const router = useRouter();
const message: number = 2;

const handleCommand = (command: string) => {
  if (command == 'logout') {
    userStore.logout('logout');
  } else if (command == 'user') {
    router.push('/ucenter');
  } else if (command == 'login') {
    userStore.login('login');
  }
};
const setFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    isFullScreen.value = false;
  } else {
    document.body.requestFullscreen.call(document.body);
    isFullScreen.value = true;
  }
};

/** 判断现在是否为全屏 */
const isFullScreen = ref(false);
</script>
<template>
  <div class="header-right">
    <div class="header-user-con">
      <!-- <div v-if="!props.isHome" class="btn-icon" @click="router.push('/theme')">
        <el-tooltip effect="dark" content="设置主题" placement="bottom">
          <SvgIcon class="icon" icon-class="theme" />
        </el-tooltip>
      </div>
      <div v-if="!props.isHome" class="btn-icon" @click="router.push('/ucenter')">
        <el-badge :is-dot="!!message" class="badge-item">
          <el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
            <SvgIcon class="icon" icon-class="message" />
          </el-tooltip>
        </el-badge>
      </div> -->
      <div v-if="!props.isHome" class="btn-icon" @click="setFullScreen">
        <el-tooltip effect="dark" :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
          <SvgIcon class="icon" :icon-class="isFullScreen ? 'exit-fullscreen' : 'fullscreen'" />
        </el-tooltip>
      </div>
      <!-- 用户头像 -->
      <el-avatar class="user-avatar" :size="30" :src="userStore.getAvatar" />
      <!-- 用户名下拉菜单 -->
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userStore.getUser.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="userStore.isLogin" command="user">个人中心</el-dropdown-item>
            <el-dropdown-item v-if="userStore.isLogin" divided command="logout">退出登录</el-dropdown-item>
            <el-dropdown-item v-else command="login">登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  cursor: pointer;
  opacity: 0.8;
  font-size: 22px;
}

.collapse-btn:hover {
  opacity: 1;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: var(--header-height);
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-icon {
  position: relative;
  width: 30px;
  height: 20px;
  text-align: center;
  cursor: pointer;
  display: flex;
  // align-items: center;
  color: var(--header-text-color);
  margin: 0 5px;
  font-size: 20px;
}

.user-avatar {
  margin: 0 10px 0 20px;
}

.el-dropdown-link {
  color: var(--header-text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
