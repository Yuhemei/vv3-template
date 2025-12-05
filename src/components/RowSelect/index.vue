<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-09-02 16:00:43
 * @LastEditors: luyang<luyang@fengtaisec.com>
 * @LastEditTime: 2024-11-26 10:57:22
 * @Description: 
-->
<script setup lang="ts">
import { ref, PropType, computed, Ref } from 'vue';

interface Option {
  label: string;
  value: string | number;
}

const emit = defineEmits(['selectChange', 'update:selected']);

const selectedTemp = ref(''); // 当前选择分类

const props = defineProps({
  title: {
    type: [String],
    default: '分类',
  },
  selected: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array as PropType<Option[]>,
    default: [],
  },
  optionConf: {
    type: Object,
    default: () => {
      return {
        label: 'label',
        value: 'value',
      };
    },
  },
});
const selectAll = () => {
  /**
   * 实现全选功能
   */
  selectedTemp.value = '';
  emit('update:selected', '');
  emit('selectChange');
};

const toggleSelected = (itemValue: any) => {
  selectedTemp.value = itemValue;
  /**
   *  实现选择/取消选择功能
   */
  emit('update:selected', itemValue);
  emit('selectChange');
};
const returnSelectStatus = (itemValue: any) => {
  return itemValue === selectedTemp.value;
};
const showAllSelect = ref(false);
const ChangeShowAll = () => {
  showAllSelect.value = !showAllSelect.value;
};

const btnType = (selectedTemp: string | number, itemValue: string | number) => {
  return selectedTemp === itemValue ? 'primary' : 'default';
};
</script>

<template>
  <div class="row-select" :class="{ showAllSelect: showAllSelect }">
    <span class="row-select-title">
      {{ title }}
      <el-badge :value="options.length" :max="99" type="primary">
        <el-icon class="cursor-pointer ml-2" @click.stop="ChangeShowAll">
          <ArrowDownBold v-if="showAllSelect" />
          <ArrowRightBold v-else />
        </el-icon>
      </el-badge>
    </span>
    <!-- <div class="row-select-options-container"></div> -->
    <div class="row-select-options">
      <el-button class="row-select-btn" :type="btnType(selectedTemp, '')" @click="selectAll">全部</el-button>
      <div
        v-for="item in options"
        :key="item[optionConf.label]"
        class="row-select-btn"
        :class="{ selected: returnSelectStatus(item[optionConf.value]) }"
        @click="toggleSelected(item[optionConf.value])"
      >
        <el-button :type="btnType(selectedTemp, item[optionConf.value])">
          <span>{{ item[optionConf.label] }}</span>
        </el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.showAllSelect {
  height: auto !important;
}
.row-select {
  width: 100%;
  height: 40px;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  .row-select-title {
    line-height: 40px;
    position: relative;
    min-width: 78px;
    padding: 0px 8px;
  }
  .row-select-options-container {
    position: relative;
  }
  .row-select-options {
    // max-height: 44px; /* 限制高度为单行 */
    padding: 0px 16px 4px;
    display: flex;
    flex-wrap: wrap; /* 默认情况下不换行 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: max-height 0.6s ease-in-out;
    &:hover {
      // max-height: 1000px; /* 鼠标移入时，扩大容器高度展示全部内容 */
      // flex-wrap: wrap; /* 鼠标移入时换行展示所有元素 */
      // white-space: nowrap;
      // overflow: auto;
      // position: absolute;
      // left: 64px;
      // z-index: 2;
    }
  }
  .row-select-btn {
    margin-right: 16px;
    margin-top: 4px;
    text-align: center;
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>
