<template>
  <div class="container">
    <TableCustom :columns="columns" :tableData="tableData" :hasToolbar="false" :hasPagination="false">
      <template #name="{ row }">
        <el-input v-if="row.editing" v-model="row.name"></el-input>
        <span v-else>{{ row.name }}</span>
      </template>
      <template #password="{ row }">
        <el-input v-if="row.editing" v-model="row.password"></el-input>
        <span v-else>{{ row.password }}</span>
      </template>
      <template #email="{ row }">
        <el-input v-if="row.editing" v-model="row.email"></el-input>
        <span v-else>{{ row.email }}</span>
      </template>
      <template #role="{ row }">
        <el-select v-if="row.editing" v-model="row.role">
          <el-option label="管理员" value="管理员"></el-option>
          <el-option label="普通用户" value="普通用户"></el-option>
        </el-select>
        <span v-else>{{ row.role }}</span>
      </template>
      <template #operator="{ row, index }">
        <template v-if="!row.editing">
          <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" :icon="Delete" @click="">删除</el-button>
        </template>
        <template v-else>
          <el-button type="success" size="small" :icon="Select" @click="row.editing = false">保存</el-button>
          <el-button type="default" size="small" :icon="CloseBold" @click="handleCancel(row, index)">取消</el-button>
        </template>
      </template>
    </TableCustom>
  </div>
</template>

<script setup lang="ts" name="table-editor">
import { ref } from 'vue';
import { Delete, Edit, CloseBold, Select } from '@element-plus/icons-vue';
import TableCustom from '@/components/Table/TableCustom.vue';
import { fetchUserData } from '@/api/index';

let columns = ref([
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'name', label: '用户名' },
  { prop: 'password', label: '密码' },
  { prop: 'email', label: '邮箱' },
  { prop: 'role', label: '角色' },
  { prop: 'operator', label: '操作', width: 180 },
]);
const tableData = ref<any[]>([]);
const getData = async () => {
  const res = await fetchUserData();
  tableData.value = res.data;
};
getData();

const rowData = ref({});

const handleEdit = (row: any) => {
  rowData.value = { ...row };
  row.editing = true;
};

const handleCancel = (row: any, index: number) => {
  row.editing = false;
  tableData.value[index] = { ...rowData.value };
};

defineOptions({
  name: 'TableEditor',
});
</script>

<style scoped></style>
