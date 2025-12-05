<template>
  <div class="table-container">
    <div class="table-toolbar" v-if="hasToolbar">
      <div class="table-toolbar-left">
        <slot name="toolbarBtn" :multipleSelection="multipleSelection"></slot>
      </div>
      <div class="table-toolbar-right flex-center">
        <template v-if="multipleSelection.length > 0 && delSelection">
          <el-tooltip effect="dark" content="删除选中" placement="top">
            <el-icon class="columns-setting-icon danger" @click="delSelection && delSelection(multipleSelection)">
              <Delete />
            </el-icon>
          </el-tooltip>
          <el-divider direction="vertical" />
        </template>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-icon class="columns-setting-icon" @click="refresh()">
            <Refresh />
          </el-icon>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip effect="dark" content="列设置" placement="top">
          <el-dropdown :hide-on-click="false" size="small" trigger="click">
            <el-icon class="columns-setting-icon">
              <Setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="c in columns">
                  <el-checkbox v-model="c.visible" :label="c.type === 'selection' ? '选择框' : c.label" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-box" ref="tableEle">
      <el-table
        ref="tableRef"
        class="mgb20"
        :style="{ width: '100%' }"
        :data="tableData"
        :row-key="rowKey"
        @selection-change="handleSelectionChange"
        table-layout="auto"
        height="100%"
        v-loading="loading"
        element-loading-background="var(--el-table-header-bg-color)"
      >
        <el-table-column label="序号" type="index" width="60" align="center" v-if="showOrdinal" />
        <template v-for="item in columns" :key="item.prop">
          <el-table-column
            v-if="item.visible"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :type="item.type"
            :show-overflow-tooltip="item.prop != 'operator'"
            :align="item.align || 'center'"
            v-bind="item.bind"
          >
            <!-- <template #default="{ $index }" v-if="item.type === 'index'">
              {{ getIndex($index) }}
            </template> -->
            <template #default="{ row, $index }" v-if="!item.type">
              <slot :name="item.prop" :row="row" :index="$index">
                <template v-if="item.prop === 'operator'">
                  <slot name="operator-prefix" :row="row" :index="$index"></slot>
                  <el-button size="small" v-if="isView" :icon="View" @click="viewFunc(row)">查看</el-button>
                  <el-button type="primary" size="small" :icon="Edit" @click="editFunc(row)">编辑</el-button>
                  <el-button
                    v-if="item.downloadProp"
                    size="small"
                    :icon="Download"
                    @click="downloadFunc(row[item.downloadProp])"
                  >
                    下载
                  </el-button>
                  <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
                  <slot name="operator-suffix" :row="row" :index="$index"></slot>
                </template>
                <span v-else-if="item.formatter">{{ item.formatter(row[item.prop], row) }}</span>
                <!-- 判断是否是可点链接 -->
                <a class="link-a" v-else-if="item.isHref" target="_blank" :href="row[item.prop]">
                  {{ formateFileUrl(row[item.prop]) || '--' }}
                </a>
                <a class="link-a" v-else-if="item.isLink" target="_blank" :href="row[item.prop]">
                  {{ row[item.prop] || '--' }}
                </a>
                <span v-else-if="item.classFormatter" :class="item.classFormatter(row[item.prop])">
                  {{ row[item.prop] || '--' }}
                </span>
                <span v-else>{{ row[item.prop] || '--' }}</span>
              </slot>
            </template>
            <!-- 展开类型使用 -->
            <template #default="{ row, $index }" v-if="item.type === 'expand'">
              <slot name="expand" :row="row" :index="$index"></slot>
            </template>
            <template #default="{ row, $index }" v-if="item.type === 'slot'">
              <slot :name="item.prop" :row="row" :index="$index"></slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-if="hasPagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :layout="layout"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="sizeChange"
      background
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs, PropType, ref, onMounted, getCurrentInstance } from 'vue';
import { Delete, Edit, View, Refresh, Download } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { formateFileUrl } from '@/utils/index';
import { useDebounceFn } from '@vueuse/core';
import type { Column } from '@/types/table';

const emit = defineEmits(['handleSelectionChange', 'handleCurrentChange', 'handleSizeChange']);

const props = defineProps({
  /** 表格数据 */
  tableData: { type: Array as PropType<any[]>, default: [] },
  /** 表头信息 */
  columns: { type: Array as PropType<Column[]>, default: [] },
  rowKey: { type: String, default: 'id' },
  /** loading效果 */
  loading: { type: Boolean, default: false },
  /** 是否自计算表格高度，实现表格滚动条 */
  autoHeight: { type: Boolean, default: false },
  showOrdinal: { type: Boolean, default: true },
  hasToolbar: { type: Boolean, default: true },
  //  分页相关
  /** 是否开启分页 */
  hasPagination: { type: Boolean, default: true },
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  /** 分页组件相关 */
  layout: { type: String, default: 'total,sizes, prev, pager, next' },
  /** 查看详情触发钩子 */
  viewFunc: { type: Function, default: () => {} },
  /** 是否开启查看详情 */
  isView: { type: Boolean, default: false },
  delFunc: { type: Function, default: () => {} },
  editFunc: { type: Function, default: () => {} },
  downloadFunc: { type: Function, default: () => {} },
  delSelection: { type: Function, required: false },
  /** table数据刷新 */
  refresh: { type: Function, default: () => {} },
  changePage: { type: Function, default: () => {} },
  sizeChange: { type: Function, default: () => {} },
});

let { tableData, columns, rowKey, hasToolbar, hasPagination, total, currentPage, pageSize, layout } = toRefs(props);

columns.value.forEach(item => {
  if (item.visible === undefined) {
    item.visible = true;
  }
});

const tableRef = ref();
// 导出 el-table 的 ref
defineExpose({ tableRef });

/** 记录 本组件使用的所有插槽名，用于判断是否使用无用的具名插槽，toolbarBtnAppend 插槽在 TableTemplate 使用 */
const slotLits = ['toolbarBtn', 'operator-prefix', 'operator-suffix', 'expand', 'toolbarBtnAppend'];
/** 记录 所传入的所有 prop，因为插槽名可能为item.prop，用于判断是否使用无用的具名插槽 */
let propSlots = [];
propSlots = props.columns.map((item: any) => {
  return item.prop;
});
/** 可用插槽 */
const allSlots = [...slotLits, ...propSlots];

/** 获取传入的具名插槽 */
const { slots } = getCurrentInstance() as any;
let showAllSlots = '';
allSlots.forEach((item: any) => {
  showAllSlots += item + '\n';
});
// console.log(slots);
Object.keys(slots).forEach(slotItem => {
  if (allSlots.indexOf(slotItem) === -1) {
    console.error(
      `未检查到命名%c${slotItem}%c，请检查命名%c${slotItem}%c是否正确\n%c可用插槽共有%c\n${showAllSlots}`,
      'font-size:14px;color:red;',
      'font-size：12px;color:#000',
      'font-size:14px;color:red;',
      'font-size：12px;color:#000',
      'font-size:12px;color:#004899;',
      'font-size：12px;color:#000',
    );
  }
});

const showTip = (msg: string) => {
  console.warn(msg);
  return true;
};

/** 使用防抖解决 el-table-column 会执行三次的问题 */
const showTipUseDebounceFn = useDebounceFn((msg: string) => {
  showTip(msg);
}, 1000);

/** 当选择项发生变化时会触发该事件 */
const multipleSelection = ref<any[]>([]);
/** 表格选择事件 */
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection;
  emit('handleSelectionChange', selection);
};

/** 当前页码变化的事件 */
const handleCurrentChange = (val: number) => {
  props.changePage(val);
};

/** 删除事件 */
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(async () => {
      props.delFunc(row);
    })
    // 这里不写catch 点击取消删除时，控制台会有报错信息 Uncaught (in promise) cancel
    .catch(() => {});
};

// const getIndex = (index: number) => {
//   return index + 1 + (currentPage.value - 1) * pageSize.value;
// };

// 计算表格高度
const tableEle = ref<HTMLLIElement>();

onMounted(() => {
  if (tableEle.value && props.autoHeight) {
    const top = tableEle.value.getBoundingClientRect().top;
    // 表格容器的高度，减去容器距离顶部的距离，减去表格容器距离底部的距离(包括分页容器的高度)
    tableEle.value.style.height = `calc(100vh - 100px - ${top}px)`;
  }
});
</script>

<style scoped lang="scss">
.table-container {
  width: 100%;

  .table-box {
    margin-bottom: 20px;
  }

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;

    .danger {
      color: var(--el-color-danger);
    }
  }

  .columns-setting-icon {
    display: block;
    font-size: 18px;
    cursor: pointer;
    color: var(--el-text-color-secondary);
  }

  .link-a {
    color: unset;

    &:hover {
      text-decoration: underline;
    }
  }

  .table-header .cell {
    color: var(--el-text-color-secondary);
  }

  :deep(.el-table__body-wrapper) .el-table-column--selection > .cell {
    display: block;
  }
  /* 解决表格show-overflow-tooltip为true时，内容不居中问题 */
  ::v-deep .el-table tr .el-table__cell .cell {
    width: 100%;
  }
}
</style>
