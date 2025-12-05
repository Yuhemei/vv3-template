<template>
  <el-row class="item-container" :gutter="20">
    <el-col :span="span" v-for="item in swiperData" :key="item.id">
      <div class="item">
        <slot name="caseItem" :item="item"></slot>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { CardItemType } from '@/api/interface';
import { getSpans } from '@/utils';
import { PropType } from 'vue';

const props = defineProps({
  swiperData: {
    type: Array as PropType<CardItemType[]>,
    default: () => [],
  },
  perViews: {
    type: Number,
    default: 4,
  },
});

//  计算每行显示的列数
const span = getSpans(props.perViews);
</script>

<style scoped lang="scss">
.item-container {
  height: calc(100vh - 230px);
  overflow: auto;
  .item {
    margin-bottom: 20px;
  }
}
</style>
