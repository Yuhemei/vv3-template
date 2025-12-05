<template>
  <svg class="svg-icon" :class="className" aria-hidden="true">
    <use :xlink:href="`#icon-${iconClass}`" />
  </svg>
</template>

<script lang="ts" setup>
defineProps({
  // SVG 图标名称
  iconClass: {
    type: String,
    required: true,
  },
  // 图标类名
  className: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
