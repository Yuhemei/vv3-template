<template>
  <swiper :slides-per-view="perViews" :space-between="0" :center-insufficient-slides="true">
    <swiper-slide v-for="item in swiperData" :key="item.id">
      <slot name="caseItem" :item="item"></slot>
    </swiper-slide>
    <SwiperInner v-if="swiperData.length > 5" />
  </swiper>
</template>

<script setup lang="ts">
import SwiperInner from './SwiperInner.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { PropType } from 'vue';
import 'swiper/css';

defineProps({
  swiperData: {
    type: Array as PropType<{ id: number }[]>,
    default: () => [],
  },
  perViews: {
    type: Number,
    default: 4,
  },
});
</script>

<style scoped lang="scss">
.op-btn {
  position: absolute;
  font-size: 24px;
  &.prev-btn {
    left: 60px;
    top: 50%;
    transform: translateY(-50%);
  }
  &.next-btn {
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.item {
  margin: 0 auto;
  background: url(@/assets/images/rect.png) no-repeat;
  background-size: 100% 100%;
}
.title {
  font-weight: 600;
}
.desc {
  opacity: 0.74;
  line-height: 20px;
}
</style>
