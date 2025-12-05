<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-11 21:31:22
 * @LastEditors: luyang<luyang@fengtaisec.com>
 * @LastEditTime: 2024-11-26 10:29:20
 * @Description: 
-->
<template>
  <v-chart class="chart" :option="option" autoresize @click="clickChart" />
</template>

<script setup lang="ts">
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { provide, watch } from 'vue';
import { option, modifyNodeStyle, labelNodes } from './index';

provide(THEME_KEY, 'dark');
use([TooltipComponent, TreeChart, CanvasRenderer]);

const props = defineProps({
  /** 树图数据 */
  data: {
    type: Array,
    default: () => [],
  },
  /** 连接关系列表 */
  labelNodes: {
    type: Array,
    default: () => [],
  },
});

/** 点击节点触发 */
function clickChart(value) {
  console.log(value);
}

/** 获取数据 */
const drawChart = () => {
  labelNodes.value = props.labelNodes;
  option.series[0].data = props.data.map(treeData => {
    return modifyNodeStyle(treeData, props.labelNodes);
  }); // 数据塞入
};
drawChart();
watch(
  () => props.data,
  () => {
    drawChart();
  },
);
</script>

<style scoped>
.chart {
  height: 80vh;
}
</style>
