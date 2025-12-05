<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="login-header">
        <div class="login-title">后台管理系统</div>
      </div>
      <el-form :model="param" :rules="rules" ref="register" size="large">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="param.email" placeholder="邮箱">
            <template #prepend>
              <el-icon>
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter="submitForm(register)">
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-button class="login-btn" type="primary" size="large" @click="submitForm(register)">注册</el-button>
        <p class="login-text">
          已有账号，
          <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Register } from '@/types/user';

const router = useRouter();
const param = reactive<Register>({
  username: '',
  password: '',
  email: '',
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
};
const register = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('注册成功，请登录');
      router.push('/login');
    } else {
      return false;
    }
  });
};

defineOptions({
  name: 'Register',
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
