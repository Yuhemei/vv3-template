<template>
  <el-date-picker type="daterange" v-model="valueRef" :value-format="format" clearable v-bind="bind" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  start: { type: String, default: '' },
  end: { type: String, default: '' },
  format: { type: String, default: 'YYYY-MM-DD' },
  bind: { type: Object, default: () => ({}) },
});
const $emit = defineEmits(['update:start', 'update:end', 'change']);
// 初始化值
const initValue = (): [string, string] => {
  if (props.start || props.end) {
    return [props.start, props.end];
  }
  return ['', ''];
};

const valueRef = ref<[string, string]>(initValue());

// 监听 props 变化
watch(
  () => [props.start, props.end],
  () => {
    if (props.start === '') {
      valueRef.value = ['', ''];
    } else {
      valueRef.value = [props.start, props.end];
    }
  },
);

// 监听 valueRef 变化
watch(
  valueRef,
  newValue => {
    if (newValue) {
      console.log('===< ' + 41 + ' >===', newValue);
      $emit('update:start', newValue[0] || '');
      $emit('update:end', newValue[1] || '');
      $emit('change', newValue);
    } else {
      $emit('update:start', '');
      $emit('update:end', '');
      $emit('change', []);
    }
  },
  { deep: true },
);
</script>

<style scoped lang="scss"></style>
