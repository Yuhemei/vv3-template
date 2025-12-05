<template>
  <div class="prev-btn op-btn">
    <el-icon @click="swiper.slidePrev()"><ArrowLeftBold /></el-icon>
  </div>
  <div class="next-btn op-btn">
    <el-icon @click="swiper.slideNext()"><ArrowRightBold /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { useSwiper } from 'swiper/vue';
const swiper = useSwiper();
</script>

<style scoped lang="scss">
.op-btn {
  position: absolute;
  font-size: 24px;
  z-index: 10;
  cursor: pointer;
  &.prev-btn {
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
  &.next-btn {
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
