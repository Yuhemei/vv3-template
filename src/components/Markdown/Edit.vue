<template>
  <div class="container">
    <md-editor
      v-if="editoring"
      ref="editorRef"
      class="mgb20"
      v-model="model"
      @on-upload-img="onUploadImg"
      @onSave="onSave"
    />
    <MdPreview style="max-height: 60vh; margin-bottom: 16px" v-else editorId="editorId" :modelValue="model" />
    <div v-if="editoring" class="flex justify-center">
      <el-button type="primary" @click="editoring = false">预 览</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
    <div v-else class="flex justify-center">
      <el-button type="primary" @click="savePage">提 交</el-button>
      <el-button @click="editoring = true">返 回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="md">
import { ref, PropType } from 'vue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import '@/styles/md.css';
import html2canvas from 'html2canvas';

const model = defineModel({
  required: true,
  type: String,
});
// const model = defineModel({
// 	required: true,
// 	type: Object as PropType<Record<string, any>>,
// });
const props = defineProps({
  fileTitle: { type: String, required: true },
  /** 取消 */
  cancel: { type: Function, required: true, default: () => {} },
  /** 提交 */
  submit: { type: Function, required: true, default: () => {} },

  /** 上传接口 */
  uploadApi: { type: Function, required: false, default: () => {} },
  /** ckeditor类型 */
  ckeditorType: { type: String, required: false, default: '' },
  /** 文件地址 */
  fileBaseUrl: { type: String, default: '' },
  /** 开始上传时的 loading(true) */
  loading: { type: Function, required: true, default: () => {} },
});

const urlPrefix = props.fileBaseUrl;

const editorRef = ref();

const editoring = ref(true);

const onUploadImg = async (files: any, callback: any) => {
  console.log(files);
  // const formData = new FormData();
  // formData.append('file', files);
  // const data = await props.uploadApi(formData, {
  // 	ckeditor_type: props.ckeditorType,
  // });
  // const url = data.url.indexOf(urlPrefix) != -1 ? data.url : urlPrefix + data.url;

  const res = await Promise.all(
    files.map((file: any) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('file', file);
        console.log(props.uploadApi);
        props
          .uploadApi(form, {
            ckeditor_type: props.ckeditorType,
          })
          .then((res: any) => rev(res))
          .catch((error: any) => rej(error));
      });
    }),
  );

  callback(res.map(item => urlPrefix + item.url));
};

// base64转blob方法
const dataURIToBlob = async (dataURI: any) => {
  // 分割Data URI以获取Base64编码部分
  const base64 = dataURI.split(',')[1];
  // 解码Base64字符串为二进制数据
  const byteCharacters = atob(base64);
  // 创建一个长度与二进制数据长度相同的Uint8Array数组
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  // 将Uint8Array数组转换为Blob对象
  const blob = new Blob([Uint8Array.from(byteNumbers)], { type: 'image/png' });
  return blob;
};
/** 截取图片 */
const generateImg = async () => {
  let el: any = document.getElementById('editorId-preview');
  let options = {
    width: el.offsetWidth + 40,
    height: el.offsetHeight,
    x: -20,
    useCORS: true, // 是否尝试使用 CORS 从服务器加载图像
    allowTaint: false, // 是否允许跨源图像污染画布
    dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
    scale: 4, //按比例增加分辨率
  };

  const canvas = await html2canvas(el, options);
  let imgData = canvas.toDataURL('image/jpeg'); // 转base64
  const blob = dataURIToBlob(imgData);
  return blob;
  // return dataURIToBlob(imgData);
  // fileDownload(imgData); // 下载图片
};
/** 下载图片 */
const fileDownload = (downloadUrl: any) => {
  let aLink = document.createElement('a');
  aLink.style.display = 'none';
  // 以防base64过长导致下载失败，所以将base64转成blob格式
  aLink.href = URL.createObjectURL(dataURIToBlob(downloadUrl));
  aLink.download = 'img.png';
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
};

const savePage = async () => {
  props.loading(true);

  // editorRef.value?.triggerSave();

  // 将md数据转换为Blob对象
  const blob = new Blob([model.value], { type: 'text/markdown' });
  // 创建FormData对象
  const MdFormData = new FormData();
  // 将Blob对象添加到FormData中，这里'file'是后端接收文件的字段名
  MdFormData.append('file', blob, props.fileTitle); // '.md'是要保存的文件名

  const imgBlob = await generateImg();
  // 创建FormData对象
  const ImgFormData = new FormData();
  // 将Blob对象添加到FormData中，这里'file'是后端接收文件的字段名
  ImgFormData.append('file', imgBlob, props.fileTitle.replace(/.[^/.]+$/, '') + '.png'); // '.png'是要保存的文件名
  props.submit(MdFormData, ImgFormData);

  editoring.value = true;
};
const onSave = (v: any, h: any) => {
  // // console.log(v);
  // // 将md数据转换为Blob对象
  // const blob = new Blob([v], { type: 'text/markdown' });
  // // 创建FormData对象
  // const MdFormData = new FormData();
  // // 将Blob对象添加到FormData中，这里'file'是后端接收文件的字段名
  // MdFormData.append('file', blob, props.fileTitle); // '.md'是要保存的文件名
  // h.then(async (htmlData: any) => {
  // 	// // 将HTML数据转换为Blob对象
  // 	// const blob = new Blob([htmlData], { type: 'text/html; charset=utf-8' });
  // 	// // 创建FormData对象
  // 	// const HtmlFormData = new FormData();
  // 	// // 将Blob对象添加到FormData中，这里'file'是后端接收文件的字段名
  // 	// HtmlFormData.append('file', blob, props.fileTitle.replace(/.[^/.]+$/, "") + ".html"); // '.html'是要保存的文件名
  // 	// // var url = URL.createObjectURL(blob);
  // 	// // var downloadLink = document.createElement('a');
  // 	// // downloadLink.href = url;
  // 	// // downloadLink.download = 'filename.html';
  // 	// // downloadLink.click();
  // 	// props.submit(MdFormData, HtmlFormData);
  // 	const imgBlob = await generateImg();
  // 	// 创建FormData对象
  // 	const ImgFormData = new FormData();
  // 	// 将Blob对象添加到FormData中，这里'file'是后端接收文件的字段名
  // 	ImgFormData.append('file', imgBlob, props.fileTitle.replace(/.[^/.]+$/, '') + '.png'); // '.png'是要保存的文件名
  // 	props.submit(MdFormData, ImgFormData);
  // });
};

//  取消
const handleCancel = () => {
  props.cancel();
};

defineOptions({
  name: 'markdown',
});
</script>
