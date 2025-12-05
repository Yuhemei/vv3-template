<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-26 17:34:30
 * @LastEditors: kim
 * @LastEditTime: 2024-12-03 12:40:36
 * @Description: 
-->
<template>
  <div>
    <TableTemplate class="mb10" v-bind="bindProps">
      <template #operator-suffix="{ row }">
        <el-button size="small">额外按钮</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status ? 'success' : 'info'">{{ row.status ? '启用' : '禁用' }}</el-tag>
      </template>
      <template #tp1>
        <el-tag type="danger">提示文字提示文字提示文字提示文字提示文字</el-tag>
      </template>
    </TableTemplate>
  </div>
</template>

<script setup lang="ts">
import TableTemplate from '@/components/Table/TableTemplate.vue';
import { searchConfig, columnsConfig, getEditConfig, queryConfig, updateEditConfig, initEditConfig } from './index';
// import { deleteTableIdApi, getTableListApi, postTableListApi, putListIdApi } from '@/api/api_user';

const bindProps = {
  searchConfig,
  columnsConfig,
  getEditConfig,
  queryConfig,

  getDealQuery,

  selectUpdate: updateEditConfig,
  closeCallback: initEditConfig,

  // getApi: getTableListApi,
  // postApi: postTableListApi,
  // putApi: putListIdApi,
  // delApi: deleteTableIdApi,
};

function getDealQuery(obj: object) {
  let result = { ...obj };
  return result;
}

defineOptions({
  name: 'TemplateTable',
});
</script>

<style scoped></style>
