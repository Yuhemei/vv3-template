<template>
  <div class="container">
    <div class="plugins-tips">
      <h1>component中有已封装好的Markdown组件</h1>
      <br />
      md-editor-v3：vue3版本的 markdown 编辑器，配置丰富，请详看文档。 访问地址：
      <a href="https://imzbf.github.io/md-editor-v3/index" target="_blank">md-editor-v3</a>
    </div>
    <md-editor ref="editorRef" class="mgb20" v-model="text" @on-upload-img="onUploadImg" @onSave="onSave" />
    <el-button type="primary" @click="savePage">提交</el-button>

    <div>仅预览</div>
    <MdPreview :id="id" :modelValue="text" />
    <MdCatalog :editorId="id" :scrollElement="scrollElement" />
  </div>
</template>

<script setup lang="ts" name="md">
// component中有已封装好的Markdown组件---------------------------
import { ref } from 'vue';
import { MdEditor, MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const editorRef = ref();
const text = ref('Hello Editor!');
const onUploadImg = (files: any) => {
  console.log(files);
};
const id = 'preview-only';
const scrollElement = document.documentElement;
const savePage = () => {
  editorRef.value?.triggerSave();
};
const onSave = (v: any, h: any) => {
  console.log(v);

  h.then((htmlData: any) => {
    // console.log(htmlData);
    // 将HTML数据转换为Blob对象
    // const blob = new Blob([htmlData], { type: 'text/html' });
    // // 创建FormData对象
    // const formData = new FormData();
    // // 将Blob对象添加到FormData中，这里'file'是后端接收文件的字段名
    // formData.append('file', blob, 'filename.html'); // 'filename.html'是你想要保存的文件名
  });
};

defineOptions({
  name: 'markdown',
});
</script>
