<!--
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐│
 *  ││Esc│!1 │@2 │#3 │$4 │%5 │^6 │&7 │*8 │(9 │)0 │_- │+= │|\ │`~ ││
 *  │├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴───┤│
 *  ││ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{[ │}] │ BS  ││
 *  │├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤│
 *  ││ Ctrl │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  ││
 *  │├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────┬───┤│
 *  ││ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│Shift │Fn ││
 *  │└─────┬──┴┬──┴──┬┴───┴───┴───┴───┴───┴──┬┴───┴┬──┴┬─────┴───┘│
 *  │      │Fn │ Alt │         Space         │ Alt │Win│   FTKJ   │
 *  │      └───┴─────┴───────────────────────┴─────┴───┘          │
 *  └─────────────────────────────────────────────────────────────┘
 * Copyright (c) 2024  FengTaiSEC Corporation. 
 * @Description: 基础表格页面，包含增删改查模版，使用时需传相关的配置和接口
 * @Author: zhangfei<zhangfei@fengtaisec.com>
 * @Date: 2024-05-20 13:14:99
-->

<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom
        :columns="columns"
        :tableData="tableData"
        :total="total"
        :currentPage="query.page"
        :page-size="query.page_size"
        :sizeChange="sizeChange"
        :delFunc="handleDelete"
        :changePage="changePage"
        :editFunc="handleEdit"
        :downloadFunc="downloadFunc"
        :delSelection="delSelection"
        :autoHeight="true"
        :loading="loading"
        :refresh="getData"
      >
        <template #toolbarBtn="{ multipleSelection }">
          <el-button type="primary" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
          <slot name="toolbarBtnAppend" :multipleSelection="multipleSelection"></slot>
        </template>
        <!-- 中转插槽，父级传入的插槽，传入到TableCustom组件 -->
        <template v-for="item in Object.keys($slots)" :key="item" v-slot:[item]="{ row }">
          <slot :name="item" :row="row"></slot>
        </template>
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      v-model="visible"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <TableEdit
        v-if="options"
        v-model="rowData"
        :options="options"
        :edit="isEdit"
        :submit="updateData"
        :cancel="closeDialog"
        :disables="disables"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, isRef } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import TableEdit from '@/components/Table/TableEdit.vue';
import TableCustom from '@/components/Table/TableCustom.vue';
import TableSearch from '@/components/Table/TableSearch.vue';
import { FormOption } from '@/types/form-option';
import { downFileUrl } from '@/utils';
import { IdType } from '@/api/interface';

const props = defineProps({
  // 查询相关
  queryConfig: { type: Object, required: true, default: () => ({}) },
  searchConfig: { type: Array, required: true, default: () => [] },
  // 表格相关
  columnsConfig: { type: Array, required: true, default: () => [] },
  // 新增/编辑弹窗相关
  getEditConfig: { type: Function, required: true, default: () => ({}) },
  delSelection: { type: Function, default: () => ({}) },
  disables: { type: Array, required: false, default: () => [] },
  // 接口相关
  getApi: { type: Function, required: true, default: () => ({}) },
  putApi: { type: Function, required: true, default: () => ({}) },
  postApi: { type: Function, required: true, default: () => ({}) },
  delApi: { type: Function, required: true, default: () => ({}) },
  /** 处理请求参数 */
  getDealQuery: { type: Function, required: false, default: (q: any) => q },
  selectUpdate: { type: Function, required: false, default: () => ({}) },
  closeCallback: { type: Function, required: false, default: () => ({}) },
  downloadFunc: {
    type: Function,
    required: false,
    default: (link?: string) => {
      if (typeof link === 'string') {
        downFileUrl(link);
      }
    },
  },
});

// 查询相关
const query = reactive(props.queryConfig);

const searchOpt = ref<any[]>(props.searchConfig);

//  handleSearch 方法名称不可修改，父组件通过 nameRef.value.handleSearch 刷新列表
const handleSearch = () => {
  query.page = 1;
  getData();
};

// 表格相关
let columns = ref(props.columnsConfig);
const total = ref(0);
const loading = ref<boolean>(false);
const tableData = ref<any[]>([]);
const getData = async () => {
  let dealQuery = props.getDealQuery(query);
  loading.value = true;
  const res = await props.getApi(dealQuery);
  tableData.value = res.data.data || res.data;
  loading.value = false;
  if (res.page_info) {
    total.value = res.page_info.object_count;
  } else if (res.data.total) {
    total.value = res.data.total || 0;
  }
};

onMounted(() => {
  handleSearch();
});
const sizeChange = (val: number) => {
  query.page = 1;
  query.page_size = val;
  getData();
};
const changePage = (val: number) => {
  query.page = val;
  getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>();

const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = async (row: object) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
  await props.selectUpdate(row, options);
};

//  请求异步options
const updateAwaitOptions = async () => {
  const res = await props.getEditConfig((val: any) => {
    props.selectUpdate(val, options);
  });
  if (isRef(res)) {
    options.value = res.value as FormOption;
  } else {
    options.value = res;
  }
};
updateAwaitOptions();

const updateData = async (data: object) => {
  let res: any;
  if (data.id) {
    res = await props.putApi(data.id, data);
  } else {
    res = await props.postApi(data);
  }
  if (res) {
    ElMessage.success('操作成功');
    closeDialog();
    handleSearch();
  }
};

const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
  rowData.value = {};
  props.closeCallback && props.closeCallback();
};

// 删除相关
const handleDelete = async (row: { id: IdType }) => {
  await props.delApi(row.id);
  // 后端删除接口返回状态码是204，可能没有返回值
  // if (res) {
  ElMessage.success('删除成功!');
  handleSearch();
  // }
};

//  暴露方法供父组件调用
defineExpose({ handleSearch });
</script>

<style scoped></style>
