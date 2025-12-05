<template>
  <div>
    <div class="container">
      <TableCustom
        :columns="columns"
        :tableData="menuData"
        row-key="index"
        :has-pagination="false"
        :viewFunc="handleView"
        :delFunc="handleDelete"
        :editFunc="handleEdit"
      >
        <template #toolbarBtn>
          <el-button type="primary" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
        <template #icon="{ row }">
          <SvgIcon class="icon" :icon-class="row.icon || 'menu_son'" />
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
      <TableEdit v-model="rowData" :options="options" :edit="isEdit" :submit="updateData" :cancel="closeDialog">
        <template #parent>
          <el-cascader v-model="rowData.pid" :options="cascaderOptions" :props="{ checkStrictly: true }" clearable />
        </template>
      </TableEdit>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #icon="{ row }">
          <SvgIcon class="icon" :icon-class="row.icon || 'menu_son'" />
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-menu">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { Menus } from '@/types/menu';
import TableCustom from '@/components/Table/TableCustom.vue';
import TableDetail from '@/components/Table/TableDetail.vue';
import TableEdit from '@/components/Table/TableEdit.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import 'virtual:svg-icons-register';

import { FormOption } from '@/types/form-option';
import { menuData } from '@/config/menu';

// 表格相关
let columns = ref([
  { prop: 'title', label: '菜单名称', align: 'left' },
  { prop: 'icon', label: '图标' },
  { prop: 'index', label: '路由路径' },
  { prop: 'permiss', label: '权限标识' },
  { prop: 'operator', label: '操作', width: 250 },
]);

const getOptions = (data: any) => {
  return data.map((item: any) => {
    const a: any = {
      label: item.title,
      value: item.id,
    };
    if (item.children) {
      a.children = getOptions(item.children);
    }
    return a;
  });
};
const cascaderOptions = ref(getOptions(menuData));

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: '100px',
  span: 12,
  list: [
    { type: 'input', label: '菜单名称', prop: 'title', required: true },
    { type: 'input', label: '路由路径', prop: 'index', required: true },
    { type: 'input', label: '图标', prop: 'icon' },
    { type: 'input', label: '权限标识', prop: 'permiss' },
    { type: 'parent', label: '父菜单', prop: 'parent' },
  ],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref<any>({});
const handleEdit = (row: Menus) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = () => {
  closeDialog();
};

const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref<{ row: Menus; data: any[] }>({
  row: {},
  data: [],
});
const handleView = (row: Menus) => {
  viewData.value.row = { ...row };
  viewData.value.data = [
    { prop: 'id', label: '菜单ID' },
    { prop: 'pid', label: '父菜单ID' },
    { prop: 'title', label: '菜单名称' },
    { prop: 'index', label: '路由路径' },
    { prop: 'permiss', label: '权限标识' },
    { prop: 'icon', label: '图标' },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: Menus) => {
  ElMessage.success('删除成功');
};

defineOptions({
  name: 'system-menu',
});
</script>

<style scoped>
.icon {
  font-size: 20px;
}
</style>
