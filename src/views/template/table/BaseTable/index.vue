<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />

    <div class="container">
      <TableCustom
        :columns="columns"
        :tableData="tableData"
        :total="page.total"
        :viewFunc="handleView"
        :delFunc="handleDelete"
        :editFunc="handleEdit"
        :refresh="getData"
        :currentPage="page.index"
        :changePage="changePage"
        :autoHeight="true"
      >
        <template #toolbarBtn>
          <el-button type="primary" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
        <template #money="{ row }">￥{{ row.money }}</template>
        <template #thumb="{ row }">
          <el-image
            class="table-td-thumb"
            :src="row.thumb"
            :z-index="10"
            :preview-src-list="[row.thumb]"
            preview-teleported
          ></el-image>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '正常' : '异常' }}</el-tag>
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
        v-model="rowData"
        :options="options"
        :edit="isEdit"
        :submit="updateData"
        :cancel="closeDialog"
      ></TableEdit>
    </el-dialog>

    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #thumb="{ row }">
          <el-image :src="row.thumb"></el-image>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="baseTable">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { fetchData } from '@/api/index';
import TableCustom from '@/components/Table/TableCustom.vue';
import TableDetail from '@/components/Table/TableDetail.vue';
import TableSearch from '@/components/Table/TableSearch.vue';
import TableEdit from '@/components/Table/TableEdit.vue';
import { QueryConfigI, TableItem } from '@/types/table';
import { FormOption } from '@/types/form-option';

// 查询相关
const query = ref({ name: '' });
const searchOpt = ref<QueryConfigI[]>([
  { type: 'input', label: '用户名：', prop: 'name' },
  {
    type: 'select',
    label: '状态：',
    prop: 'status',
    opts: [
      { label: '正常', value: true },
      { label: '隐藏', value: false },
    ],
  },
]);
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  { type: 'selection' },
  // { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'name', label: '用户名' },
  { prop: 'money', label: '账户余额' },
  { prop: 'thumb', label: '头像' },
  { prop: 'status', label: '账户状态' },
  // { prop: 'operator_diy', label: '操作', width: 250 },
  { prop: 'operator', label: '操作', width: 250 },
]);
const page = ref({
  index: 1,
  size: 10,
  total: 200,
});
const tableData = ref<TableItem[]>([]);
const getData = async () => {
  const res = await fetchData();
  tableData.value = res.data;
};
getData();

const changePage = (val: number) => {
  page.value.index = val;
  getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    { type: 'input', label: '用户名', span: 12, prop: 'name', required: true },
    { type: 'number', label: '账户余额', span: 12, prop: 'money', required: true },
    {
      type: 'switch',
      bind: { activeText: '正常', inactiveText: '异常' },
      label: '账户状态',
      prop: 'status',
      required: true,
    },
    {
      type: 'upload',
      label: '头像',
      prop: 'avatar',
      required: true,
      ckeditorType: 'user',
    },
  ],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: TableItem) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = () => {
  closeDialog();
  getData();
};

const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
interface ViewData {
  row: Object;
  list: {
    prop: string;
    label: string;
  }[];
}
const visible1 = ref(false);
const viewData = ref<ViewData>({
  row: {},
  list: [],
});
const handleView = (row: TableItem) => {
  viewData.value.row = { ...row };
  viewData.value.list = [
    { prop: 'id', label: '用户ID' },
    { prop: 'name', label: '用户名' },
    { prop: 'money', label: '账户余额' },
    { prop: 'status', label: '账户状态' },
    { prop: 'thumb', label: '头像' },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: TableItem) => {
  ElMessage.success('删除成功');
};

defineOptions({
  name: 'baseTable',
});
</script>

<style scoped>
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
