<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="login-header">
        <div class="login-title">{{ title }}</div>
      </div>
      <el-form :model="param" :rules="rules" ref="login" size="large">
        <el-form-item prop="identity">
          <el-input v-model="param.identity" placeholder="用户名">
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="passwordType" placeholder="密码" v-model="param.password" @keyup.enter="submitForm(login)">
            <template #prepend>
              <el-icon><Lock /></el-icon>
            </template>
            <template #append>
              <el-icon class="cursor-pointer" @click="showPwd"><View /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item prop="captcha_code">
              <el-input
                class="verify-code-input"
                v-model="param.captcha_code"
                placeholder="验证码"
                @keyup.enter="submitForm(login)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <img class="verify-code" :src="captchaCodeImage" alt="验证码" @click="getCaptcha" />
          </el-col>
        </el-row>
        <el-button class="login-btn" type="primary" size="large" @click="submitForm(login)">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useTabsStore } from '@/store/tabs';
import type { FormInstance, FormRules } from 'element-plus';
// import { getCaptchaApi, getPostLoginApi } from '@/api/sso_login/index';
import { getToken, setToken, setUser } from '@/utils/cache';

const router = useRouter();
const title = FT_CONFIG.title;

if (getToken()) {
  router.push('/');
}

interface LoginInfo {
  identity: string;
  password: string;
  captcha_id: string;
  captcha_code: string;
  service_ip: string;
}

const passwordType = ref<string>('password');
const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text';
  } else {
    passwordType.value = 'password';
  }
};

const param = reactive<LoginInfo>({
  identity: 'admin',
  password: 'admin',
  captcha_id: '',
  captcha_code: '1234',
  service_ip: window.location.hostname,
});

const rules: FormRules = {
  identity: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
};
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('登录成功');
      router.push('/');
      setUser(param.identity);
      // getPostLoginApi(param).then((res: any) => {
      //   setToken(res.token);
      //   setUser(res.name);
      //   ElMessage.success('登录成功');
      //   router.push('/');
      // });
    }
  });
};

const tabs = useTabsStore();
tabs.clearTabs();

// 验证码
const captchaCodeImage = ref<string>('');

const getCaptcha = () => {
  // getCaptchaApi().then((res: any) => {
  //   const { image, captcha_id } = res;
  //   captchaCodeImage.value = image;
  //   param.captcha_id = captcha_id;
  // });
};

getCaptcha();

defineOptions({
  name: 'Login',
});
</script>

<style scoped lang="scss">
$box: #fff;
.login-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: url(@/assets/img/login-bg.jpg) center/cover no-repeat;
  .login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }

  .login-title {
    font-size: 32px;
    letter-spacing: 2px;
    color: #3a3a3a;
    font-weight: bold;
  }

  .login-container {
    position: absolute;
    left: 55%;
    top: 50%;
    transform: translateY(-50%);
    width: 450px;
    border-radius: var(--el-card-border-radius);
    background: $box;
    padding: 40px 50px 50px;
    box-sizing: border-box;
  }

  .pwd-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin: -10px 0 10px;
  }

  .pwd-checkbox {
    height: auto;
  }

  .login-btn {
    display: block;
    width: 100%;
  }

  .login-tips {
    font-size: 12px;
    color: #999;
  }

  .login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
  }
  .verify-code {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    background-color: #f3f3f3;
    display: inline-block;
  }
}
:deep(.el-input-group__append) {
  padding: 0 10px;
  cursor: pointer;
  user-select: none;
}
</style>
