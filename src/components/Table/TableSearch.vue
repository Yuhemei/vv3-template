<template>
  <div class="search-container">
    <el-form ref="searchRef" :model="query" :inline="true" @submit.prevent="search()">
      <el-form-item v-for="item in options" :label="item.label" :prop="item.prop || item.prop_start">
        <!-- 文本框、下拉框、日期框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="query[item.prop!]"
          clearable
          @keydown.enter="search()"
          v-bind="item.bind"
          v-on="transformVOn(item.on, query)"
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="query[item.prop!]"
          :placeholder="'选择' + item.label"
          clearable
          @change="search()"
          v-bind="item.bind"
          v-on="transformVOn(item.on, query)"
        >
          <el-option v-for="opt in item.options" :label="opt.label" :value="opt.value" />
        </el-select>
        <el-date-picker
          v-else-if="item.type === 'date'"
          type="date"
          v-model="query[item.prop!]"
          @change="search"
          :placeholder="'选择' + item.label"
          v-bind="item.bind"
          v-on="transformVOn(item.on, query)"
        />
        <DatePickerRange
          v-else-if="item.type === 'daterange'"
          v-model:start="query[item.prop_start!]"
          v-model:end="query[item.prop_end!]"
          :format="item.format"
          @change="search()"
          v-bind="item.bind"
          v-on="transformVOn(item.on, query)"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="search()">搜索</el-button>
        <el-button :icon="Refresh" @click="resetForm(searchRef)">重置</el-button>
        <slot name="custom-buttons" :query="query"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import DatePickerRange from '@/components/ElementPlus/DatePickerRange.vue';
import { QueryConfigI } from '@/types/table';
import { Search, Refresh } from '@element-plus/icons-vue';
import { FormInstance } from 'element-plus';
import { PropType, nextTick, ref } from 'vue';
import { transformVOn } from '@/utils/index';

const props = defineProps({
  query: {
    type: Object,
    required: true,
  },
  options: {
    type: Array as PropType<QueryConfigI[]>,
    required: true,
  },
  search: {
    type: Function,
    default: () => {},
  },
});

const searchRef = ref<FormInstance>();
const resetForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  await nextTick();
  props.search();
};
</script>

<style scoped lang="scss">
.search-container {
  padding: 20px 24px 0;
  background-color: var(--content-bg);
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-card-border-radius);
  .el-input,
  .el-select {
    width: 200px;
  }
}
</style>
