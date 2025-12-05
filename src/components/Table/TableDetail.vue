<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-08-26 11:06:02
 * @LastEditors: luyang<luyang@fengtaisec.com>
 * @LastEditTime: 2024-11-26 10:14:15
 * @Description: 
-->
<template>
  <el-descriptions
    :title="props.data.title"
    :column="props.data.column"
    :label-width="props.labelWidth"
    border
    :align="props.align"
  >
    <el-descriptions-item
      v-for="item in props.data.list"
      :span="item.span"
      :key="item.prop"
      :label="item.label"
      :label-width="item.labelWidth"
      align="center"
    >
      <slot v-if="item.prop === 'image'" :name="item.prop" :row="props.data.row">
        <img class="table-img" :src="props.data.row[item.value || item.prop]" alt="" />
      </slot>
      <el-rate
        v-else-if="item.type === 'rate'"
        v-model="props.data.row[item.prop]"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        allow-half
        disabled
        v-bind="item.bind"
      />
      <slot v-else-if="item.formatter" :name="item.prop" :row="props.data.row">
        {{ item.formatter(props.data.row) }}{{ item.suffix }}
      </slot>
      <slot v-else :name="item.prop" :row="props.data.row">
        {{ item.value || props.data.row[item.prop] }}{{ item.suffix }}
      </slot>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { number } from 'echarts';
import { PropType } from 'vue';
export interface TableDetailProps {
  title?: string;
  column?: number;
  row: any;
  list: Array<{
    label: string;
    prop: string;
    value?: string;
    span?: number;
    type?: string;
    suffix?: string;
    formatter?: (row: any) => string;
    bind?: any;
  }>;
}
const props = defineProps({
  labelWidth: {
    type: [String, Number],
    default: '120px',
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'center',
  },
  data: {
    type: Object as PropType<TableDetailProps>,
    required: true,
  },
});
</script>
<style scope>
.table-img {
  max-width: 400px;
  max-height: 300px;
}
</style>
