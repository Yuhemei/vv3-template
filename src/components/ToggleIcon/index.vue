<template>
  <div class="change-btn">
    <el-tooltip content="切换" placement="top" effect="light">
      <SvgIcon class="icon" icon-class="change" @click="actionToggle" />
    </el-tooltip>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon/index.vue';
import 'virtual:svg-icons-register';

const emit = defineEmits(['toToggle']);

const actionToggle = () => {
  emit('toToggle');
};
</script>

<style lang="scss" scoped>
.change-btn {
  position: absolute;
  font-size: 30px;
  right: 40px;
  top: 40px;
  cursor: pointer;
  z-index: 2000;
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
