<!--
 * Copyright (c) 2025  FengTaiSEC Corporation. 
 * @brief: 
 * @Author: 杨博宇<yangboyu@tianchuangsec.com>
 * @Date: 2025-01-13 13:56:27
 * @history: 
-->
<template>
  <div ref="chartBarDom" style="width: 100%; height: 400px" />
</template>

<script setup lang="ts">
import { onMounted, nextTick, onUnmounted, watch, shallowRef } from 'vue';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
// 创建一个响应式引用来保存DOM元素
const chartBarDom = shallowRef<HTMLElement | null>(null);
const chartInstance = shallowRef<EChartsType | null>(null);
const props = defineProps({
  /** x轴数据 */
  xAxis: {
    type: Array,
    default: () => ['类别1', '类别2', '类别3', '类别4', '类别5'],
  },
  /** 系列数据 */
  series: {
    type: Array,
    default: () => [
      {
        name: 'Y轴数据',
        type: 'bar',
        data: [120, 200, 150, 80, 70],
        barMaxWidth: 20,
      },
    ],
  },
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 图表名称 */
  name: {
    type: String,
    default: 'bar',
  },
  /** y轴名称 */
  yLabel: {
    type: String,
    default: '小节完成数',
  },
  /** x轴名称 */
  xLabel: {
    type: String,
    default: '统计日期',
  },
  /** 单位 */
  unit: {
    type: String,
    default: '',
  },
  /** 最大值 */
  max: {
    type: Number,
    default: 100,
  },
});

const drawChart = () => {
  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartBarDom.value);
  }
  const option = {
    // 这里是ECharts的配置项，可以根据需要绘制不同类型的图表
    title: {
      text: props.title,
    },
    legend: {},
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        var tooltipHtml = '<div style="font-family: Arial, sans-serif; color: #333;">';

        // 第 1 行显示 xAxis 类目（即 x 轴的类别数据）
        tooltipHtml += '<div style="font-weight: bold; font-size: 14px;">' + params[0].name + '</div>';

        // 遍历每个数据项，显示系列数据
        params.forEach(function (item) {
          tooltipHtml += '<div style="margin-bottom: 5px;">';
          tooltipHtml += '<span style="color: ' + item.color + ';">' + item.marker + '</span>';
          tooltipHtml += '<span style="font-weight: bold;">' + item.seriesName + ':</span> ';
          tooltipHtml += '<span style="font-size: 16px; font-weight: bold;">' + item.value + props.unit + '</span>';
          tooltipHtml += '</div>';
        });

        tooltipHtml += '</div>';
        return tooltipHtml; // 返回自定义的 HTML 内容
      },
    },
    xAxis: {
      name: props.xLabel,
      data: props.xAxis,
    },
    yAxis: {
      name: props.yLabel,
      minInterval: 1,
      max: props.series.reduce(
        (max: number, item: any) =>
          Math.max(
            max,
            item.data.reduce((max: number, d: number) => Math.max(max, d), 0),
          ),
        props.max,
      ),
      splitLine: {
        show: false,
      },
    },
    series: props.series,
  };
  chartInstance.value && chartInstance.value.setOption(option);
  window.addEventListener('resize', () => {
    chartInstance.value && chartInstance.value.resize();
  });
};
watch(
  () => [props.xAxis, props.series, props.title],
  () => {
    drawChart();
  },
  { deep: true, immediate: false },
);

onMounted(async () => {
  await nextTick(); // 确保DOM已经渲染完成
  drawChart();
});
// 销毁ECharts实例
onUnmounted(() => {
  if (chartInstance.value != null && chartInstance.value.dispose) {
    chartInstance.value.dispose();
  }
});
</script>

<style lang="scss" scoped></style>
