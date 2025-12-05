<template>
  <div>
    <TableTemplate class="mb10" v-bind="bindProps" ref="tableRef">
      <template #role_name="{ row }">
        <el-tag class="mr-[1px]" v-for="item in row.role_name" :key="item">{{ item }}</el-tag>
      </template>
      <template #operator-suffix="{ row }">
        <el-button size="small" @click="handleChangePassword(row)">修改密码</el-button>
      </template>
      <template #toolbarBtnAppend>
        <el-button type="primary" @click="visibleImport = true">批量导入</el-button>
        <el-button type="primary" @click="showExport">批量导出</el-button>
      </template>
    </TableTemplate>
    <el-dialog
      title="修改密码"
      v-model="visible"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <TableEdit :form-data="rowData" :options="options" :edit="true" :submit="update" :cancel="closeDialog" />
    </el-dialog>
    <el-dialog
      title="批量导出"
      v-model="visibleExport"
      width="1200px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <TableCustom :columns="columns" :tableData="tableData" :total="total" :changePage="changePage">
        <template #toolbarBtn="{ multipleSelection }">
          <el-button type="primary" :disabled="!multipleSelection.length" @click="handleExport(multipleSelection)">
            导出选中
          </el-button>
          <el-button type="primary" @click="handleExportAll">导出全部</el-button>
        </template>
        <template #tag="{ row }">
          <el-tag class="mr5" v-for="item in row.role_name" :key="item">{{ item }}</el-tag>
        </template>
      </TableCustom>
    </el-dialog>
    <el-dialog
      title="批量导入"
      v-model="visibleImport"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
      class="import-dialog"
    >
      <el-row>
        <el-col :span="4" :offset="1" class="text-right">选择文件：</el-col>
        <el-col :span="18">
          <el-upload class="upload-demo" accept=".xls,.xlsx" :before-upload="handleImport">
            <el-button type="primary">批量导入</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="1" class="text-right">选择的文件：</el-col>
        <el-col :span="18">{{ fileRef?.name || '' }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="1" class="text-right">示例文件：</el-col>
        <el-col :span="18">
          <el-button type="primary" @click="actionDownTemplate">示例文件</el-button>
        </el-col>
      </el-row>
      <template #footer>
        <el-button type="primary" @click="actionImport">确 认</el-button>
        <el-button @click="cancelImport">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import TableTemplate from '@/components/Table/TableTemplate.vue';
import TableEdit from '@/components/Table/TableEdit.vue';
import TableCustom from '@/components/Table/TableCustom.vue';
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { searchConfig, columnsConfig, getEditConfig, queryConfig, updateEditConfig, initEditConfig } from './index';
import { downTemplateFile, getExportApi } from '@/api';
import { downFile, downFileUrl } from '@/utils';

const bindProps = {
  searchConfig,
  columnsConfig,
  getEditConfig,
  queryConfig,
  getDealQuery,
  delSelection,
  closeCallback: initEditConfig,
  selectUpdate: updateEditConfig,
};

function getDealQuery(obj: object) {
  let result = { ...obj };
  return result;
}

// 修改密码
const visible = ref<boolean>(false);

const options = {
  labelWidth: '120px',
  span: 24,
  list: [
    { type: 'input', label: '用户名称', prop: 'username', disabled: true },
    { type: 'input', label: '新密码', prop: 'password', required: true },
    { type: 'input', label: '新密码确认', prop: 'verify_password', required: true },
  ],
};

const rowData = ref<any>();

const closeDialog = () => {
  visible.value = false;
};

const handleChangePassword = (row: any) => {
  rowData.value = row;
  visible.value = true;
};

const update = (data: any) => {
  putPasswordApi(data.id, {
    password: data.password,
    verify_password: data.verify_password,
  }).then(() => {
    visible.value = false;
    ElMessage.success('操作成功');
  });
};

// 删除选中
const tableRef = ref<InstanceType<typeof TableTemplate> | null>(null);
function delSelection(multipleSelection: IdType[]) {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      deleteDeleteApi({
        id_list: multipleSelection.map(item => item.id),
      }).then(() => {
        ElMessage.success('删除成功!');
        tableRef.value?.handleSearch();
      });
    })
    // 这里不写catch 点击取消删除时，控制台会有报错信息 Uncaught (in promise) cancel
    .catch(() => {});
}

// TODO: 批量导出功能
const visibleExport = ref<boolean>(false);

const columns = ref(columnsConfig.filter(item => item.prop !== 'operator'));
const tableData = ref<any[]>([]);
const total = ref<number>(0);

const changePage = (page: number) => {
  console.log(141, page);
};

const showExport = async () => {
  const res = await getUserApi({
    normal_user: '2',
  });
  tableData.value = res.data;
  total.value = res.total;
  visibleExport.value = true;
};

// 导出选中
const handleExport = (multipleSelection: IdType[]) => {
  const id_list = multipleSelection.map(item => item.id);
  getApiExport({ id_list });
};

const handleExportAll = () => {
  getApiExport({ all_user: 2 });
};

async function getApiExport(json: any) {
  const res = await getExportApi(json);
  downFile(res);
}

// 批量导入功能
const visibleImport = ref<boolean>(false);
const fileRef = ref<File>();

const handleImport = (file: File) => {
  let fileExtension = '';
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
  }
  if (fileExtension === 'xls' || fileExtension === 'xlsx') {
    fileRef.value = file;
  } else {
    ElMessageBox.alert('请上传excel文件!');
  }
  return false;
};

const actionImport = () => {
  const formData = new FormData();
  formData.append('file', fileRef.value as File);
  postImportApi(formData).then(() => {
    ElMessage.success('导入成功!');
    visibleImport.value = false;
    fileRef.value = undefined;
    tableRef.value?.handleSearch();
  });
};

const cancelImport = () => {
  visibleImport.value = false;
  fileRef.value = undefined;
};

const actionDownTemplate = () => {
  downTemplateFile().then(res => {
    downFile(res, 'template.xlsx');
  });
};
</script>

<style scoped lang="scss">
.upload-demo {
  display: inline-block;
  margin: 0 8px;
  vertical-align: top;
}

:deep(.import-dialog) {
  line-height: 40px;

  .upload-demo {
    margin: 0;
  }
}
</style>
