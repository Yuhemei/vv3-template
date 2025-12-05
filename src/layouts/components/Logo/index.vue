<template>
  <div class="logo cursor-pointer" @click="goHome">
    <img :src="logoUrl" :class="{ collapse: props.isCollapse }" alt="" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useViewStore from '@/store/vi';

const viewStore = useViewStore();
const router = useRouter();
const goHome = () => {
  window.open(FT_CONFIG.homeUrl, '_blank');
};

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});
const logoUrl = computed(() => {
  return props.isCollapse ? viewStore.sLogo : viewStore.logo;
});
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--side-width);
  height: var(--header-height);
  text-align: center;
  transition: 0.3s all ease-in-out;
  background-color: var(--header-bg-color);

  img {
    max-width: 60%;
    max-height: 60%;
    vertical-align: middle;
  }

  &:after {
    content: '';
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
