<template>
  <div class="editorContainer" :class="theme" style="margin-bottom: 10px; z-index: 9999">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :style="{ height: ToolbarHeight }"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :bind="bind.toolBar"
    />
    <Editor
      style="overflow-y: hidden; width: 100%"
      :style="{ minHeight: EditorHeight }"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
      :bind="bind.editor"
    />
  </div>
</template>

<script setup lang="ts" name="editor">
import { onBeforeUnmount, PropType, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ToolbarConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

const valueHtml = defineModel({
  required: true,
  type: String,
});

const { theme, ToolbarHeight, EditorHeight, uploadApi, fileBaseUrl, ckeditorType, toolbarConfig } = defineProps({
  /** 主题 */
  theme: { type: String, default: '' },
  /** 工具栏高度 */
  ToolbarHeight: { type: String, default: 'auto' },
  /** 编辑栏高度 */
  EditorHeight: { type: String, default: '200px' },
  /** 上传接口 */
  uploadApi: { type: Function, default: () => {} },
  /** 静态文件服务 */
  fileBaseUrl: { type: String, default: '' },
  /** ckeditor类型 */
  ckeditorType: { type: String, default: '' },
  toolbarConfig: {
    type: Object as PropType<ToolbarConfig>,
    default: {
      toolbarKeys: [
        'bold', // 粗体
        'underline', // 下划线
        'italic', // 斜体
        'through', // 删除线
        'code', // 行内代码
        'sub', // 下标
        'sup', // 上标
        'clearStyle', // 清除格式
        'color', // 字体颜色
        'bgColor', // 背景色
        'fontSize', // 字号
        'fontFamily', // 字体
        'indent', // 增加缩进
        'delIndent', // 减少缩进
        'justifyLeft', // 左对齐
        'justifyRight', // 右对齐
        'justifyCenter', // 居中对齐
        'justifyJustify', // 两端对齐
        'lineHeight', // 行高
        'insertImage', // 网络图片
        'deleteImage', // 删除图片
        'editImage', // 编辑图片
        'viewImageLink', // 查看链接
        'imageWidth30', // 图片宽度相对于编辑器宽度的百分比30
        'imageWidth50', // 图片宽度相对于编辑器宽度的百分比50
        'imageWidth100', // 图片宽度相对于编辑器宽度的百分比100
        'divider', // 分割线
        'emotion', // 表情
        'insertLink', // 插入链接
        'editLink', // 修改链接
        'unLink', // 取消链接
        'viewLink', // 查看链接
        'codeBlock', // 代码块
        'blockquote', // 引用
        'headerSelect', // 标题
        'header1', // 标题1
        'header2', // 标题2
        'header3', // 标题3
        'header4', // 标题4
        'header5', // 标题5
        'todo', // 待办
        'redo', // 重做
        'undo', // 撤销
        'fullScreen', // 全屏
        'enter', // 回车
        'bulletedList', // 无序列表
        'numberedList', // 有序列表
        'insertTable', // 插入表格
        'deleteTable', // 删除表格
        'insertTableRow', // 插入行
        'deleteTableRow', // 删除行
        'insertTableCol', // 插入列
        'deleteTableCol', // 删除列
        'tableHeader', // 表头
        'tableFullWidth', // 宽度自适应
        'insertVideo', // 插入网络视频
        'uploadVideo', // 上传视频
        'editVideoSize', // 修改视频尺寸
        'uploadImage', // 上传图片
        'codeSelectLang', // 选择语言
      ],
    },
  },
  bind: {
    type: Object,
    default: {
      toolBar: {},
      editor: {},
    },
  },
});

// const toolbarConfig = {

// };

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

/** 拼接服务地址 */
function setUrlPrefix(url: string) {
  return url.indexOf(fileBaseUrl) != -1 ? url : fileBaseUrl + url;
}

/** 只保留基础地址 */
function remUrlPrefix(url: string) {
  return url.indexOf(fileBaseUrl) != -1 ? url.split(fileBaseUrl)[1] : url;
}

const editorConfig: any = { placeholder: '请输入内容...', MENU_CONF: [] };

editorConfig.MENU_CONF['uploadImage'] = {
  // 自定义上传
  async customUpload(file: File, insertFn: any) {
    // TS 语法
    // async customUpload(file, insertFn) {
    // file 即选中的文件
    // 自己实现上传，并得到图片 url alt href
    // 最后插入图片
    const formData = new FormData();
    formData.append('file', file);
    const data = await uploadApi(formData, {
      ckeditor_type: ckeditorType,
    });
    const url = setUrlPrefix(data.url);
    insertFn(url, '', '');
  },

  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 100 * 1024, // 100kb

  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ['image/*'],

  // 上传进度的回调函数
  onProgress(progress: number) {
    // TS 语法
    // onProgress(progress) {
    // progress 是 0-100 的数字
    console.log('progress', progress);
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

defineExpose({ editorRef });

defineOptions({
  name: 'editor',
});
</script>

<style lang="scss" scoped>
.editorContainer {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  :deep(.w-e-full-screen-container) {
    position: fixed;
  }
  // 浅色系
  :deep(.normal) {
    // position: relative;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    --w-e-textarea-bg-color: #fff;
    --w-e-textarea-color: #333;
    --w-e-textarea-border-color: #ccc;
    --w-e-textarea-slight-border-color: #e8e8e8;
    --w-e-textarea-slight-color: #d4d4d4;
    --w-e-textarea-slight-bg-color: #f5f2f0;
    --w-e-textarea-selected-border-color: #b4d5ff;
    --w-e-textarea-handler-bg-color: #4290f7;
    --w-e-toolbar-color: #595959;
    --w-e-toolbar-bg-color: #fff;
    --w-e-toolbar-active-color: #333;
    --w-e-toolbar-active-bg-color: #f1f1f1;
    --w-e-toolbar-disabled-color: #999;
    --w-e-toolbar-border-color: #e8e8e8;
    --w-e-modal-button-bg-color: #fafafa;
    --w-e-modal-button-border-color: #d9d9d9;
  }
  // 深色系
  :deep(.dark) {
    // position: relative;
    border: 1px solid #333;
    border-radius: var(--el-border-radius-base);
    --w-e-textarea-bg-color: #333;
    --w-e-textarea-color: #fff;
    --w-e-textarea-border-color: #666;
    --w-e-textarea-slight-border-color: #444;
    --w-e-textarea-slight-color: #777;
    --w-e-textarea-slight-bg-color: #222;
    --w-e-textarea-selected-border-color: #4290f7;
    --w-e-textarea-handler-bg-color: #4290f7;
    --w-e-toolbar-color: #ccc;
    --w-e-toolbar-bg-color: #333;
    --w-e-toolbar-active-color: #fff;
    --w-e-toolbar-active-bg-color: #444;
    --w-e-toolbar-disabled-color: #555;
    --w-e-toolbar-border-color: #444;
    --w-e-modal-button-bg-color: #444;
    --w-e-modal-button-border-color: #666;
  }
  // 深蓝
  :deep(.darkBlue) {
    // position: relative;
    border: 1px solid #2c3e50;
    border-radius: var(--el-border-radius-base);
    --w-e-textarea-bg-color: #2c3e50; /* 深蓝色背景 */
    --w-e-textarea-color: #e0e0e0; /* 浅灰色文字 */
    --w-e-textarea-border-color: #34495e; /* 深蓝色边框 */
    --w-e-textarea-slight-border-color: #3c4858; /* 稍浅的深蓝色边框 */
    --w-e-textarea-slight-color: #a3b1bf; /* 稍浅的灰色文字 */
    --w-e-textarea-slight-bg-color: #34495e; /* 稍浅的深蓝色背景 */
    --w-e-textarea-selected-border-color: #4e6e8e; /* 选中时的深蓝色边框 */
    --w-e-textarea-handler-bg-color: #1e8bc3; /* 处理区域的深蓝色 */
    --w-e-toolbar-color: #bdc3c7; /* 浅灰色文字 */
    --w-e-toolbar-bg-color: #34495e; /* 深蓝色背景 */
    --w-e-toolbar-active-color: #ffffff; /* 活动状态下的白色文字 */
    --w-e-toolbar-active-bg-color: #1e8bc3; /* 活动状态下的深蓝色背景 */
    --w-e-toolbar-disabled-color: #7f8c8d; /* 禁用状态下的灰色文字 */
    --w-e-toolbar-border-color: #3c4858; /* 深蓝色边框 */
    --w-e-modal-button-bg-color: #1e8bc3; /* 按钮背景颜色 */
    --w-e-modal-button-border-color: #34495e; /* 按钮边框颜色 */
  }
}
</style>
