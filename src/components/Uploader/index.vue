<template>
  <div>
    <el-upload
      :disabled="disabled"
      :list-type="listType"
      multiple
      :before-upload="handleBeforeUpload"
      :show-file-list="true"
      :file-list="fileList"
      v-bind="bind"
      :class="{ hide: fileList.length >= limit }"
      :on-preview="handleImgPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      ref="uploadRef"
    >
      <div v-if="slot">
        <slot name="default"></slot>
      </div>
      <div v-else-if="listType === 'text'">
        <el-tag type="primary" v-if="fileList.length < limit && !upLoading">{{ text }}</el-tag>
        <div v-if="upLoading">
          <el-tag type="info" :disable-transitions="false">上传中</el-tag>
          <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="uploadProgress"
            status="success"
            class="upload-progress"
          />
          <div class="progress-info">
            <span>{{ formatSize(uploadProgressLoaded) }} / {{ formatSize(uploadProgressTotal) }}</span>
          </div>
        </div>
        <el-tooltip v-else-if="fileList.length >= limit" effect="dark" content="继续上传将移除首个文件">
          <el-tag type="success" :disable-transitions="false">已上传</el-tag>
        </el-tooltip>
      </div>
      <div v-else>
        <el-icon v-if="!upLoading" class="avatar-uploader-icon">
          <plus />
        </el-icon>
        <div v-else>
          <el-progress
            :text-inside="true"
            :stroke-width="12"
            :percentage="uploadProgress"
            status="success"
            type="circle"
            class="absolute"
          />
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span>{{ formatSize(uploadProgressLoaded) }} / {{ formatSize(uploadProgressTotal) }}</span>
          </div>
        </div>
      </div>
      <template #tip>
        <div>
          <div class="el-upload__tip" v-if="showTip">
            请上传
            <!-- {{ form[formProp] }} -->
            <!-- {{ fileList }} -->
            <template v-if="fileSize">
              大小不超过
              <b style="color: var(--el-color-danger)">{{ fileSizeString(fileSize) }}</b>
            </template>
            <template v-if="fileType">
              格式为
              <b style="color: var(--el-color-danger)">{{ fileType.join('/') }}</b>
            </template>
            的文件
          </div>
        </div>
      </template>
    </el-upload>
    <!-- 预览 -->
    <el-dialog v-model="dialogVisible" title="预览" width="800px" append-to-body :close-on-click-modal="false">
      <div v-if="isImage(dialogData.name)" style="width: 100%; max-height: 600px; padding-left: 20px; overflow: auto">
        <img :src="dialogData.url" style="display: block; max-width: 100%; margin: 0 auto" />
      </div>
      <iframe
        v-else
        style="width: 100%; height: 600px; padding-left: 20px"
        :src="dialogData.url"
        frameborder="0"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue';
import { ElMessage, UploadProps, UploadFile, UploadInstance, UploadRawFile, genFileId } from 'element-plus';
import { uploadApi } from '@/api';
import { getFileName } from '@/utils';

const form = defineModel({
  required: true,
  type: Object,
});

const props = defineProps({
  /** 绑定的字段 */
  formOption: { type: Object, required: true, default: {} },
  // modelValue: { type: String, required: true, default: '' },
  /** ckeditor类型 */
  ckeditorType: { type: String, required: true, default: '' },
  /** 图片数量限制 */
  limit: { type: Number, default: 1 },
  /** 大小限制(MB) */
  fileSize: { type: Number, default: 1024 * 5 },
  bind: { type: Object, default: () => {} },
  /** 文件类型 */
  fileType: { type: Array as PropType<string[]>, default: () => ['png', 'jpg', 'jpeg'] },
  /** 是否显示提示 */
  isShowTip: { type: Boolean, default: true },
  /** 是否只能查看 */
  disabled: { type: Boolean, default: false },
  /** 展示类型 */
  listType: { type: String as PropType<'picture-card' | 'text'>, default: 'picture-card' },
  /** 是否显示文件上传列表 */
  onSuccess: { type: Function, default: () => {} },
  /** 上传接口 */
  uploadApi: { type: Function, default: uploadApi },
  /** 文件上传地址 */
  fileBaseUrl: { type: String, default: '' },
  /** 上传按钮文字 */
  text: { type: String, default: '点击上传' },
  /** 是否使用slot */
  slot: { type: Boolean, default: false },
});

const formProp = props.formOption.prop;

const emit = defineEmits(['onSuccess']);
const dialogData = ref({ url: '', name: '' });
const dialogVisible = ref(false);
/** 上传中loading */
const upLoading = ref<Boolean>(false);

const fileList = ref<{ url: string; name: string }[]>([]);
// const form = ref(props.modelValue);
const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize));

const urlPrefix = props.fileBaseUrl;

/**
 * 文件大小转换
 * @param fileSize 文件大小 单位：MB
 * @returns 文件大小字符串
 */
const fileSizeString = (fileSize: number) => {
  if (fileSize >= 1024 * 1024) {
    return `${fileSize / 1024 / 1024}TB`;
  } else if (fileSize >= 1024) {
    return `${fileSize / 1024}GB`;
  } else if (fileSize >= 1) {
    return `${fileSize}MB`;
  } else {
    return `${fileSize * 1024}KB`;
  }
};

// 监听form.value[formProp]的变化，更新fileList
watch(
  () => form.value[formProp],
  val => {
    if (val) {
      if (props.limit > 1) {
        const urlArr = val?.split(',') || [];
        fileList.value = urlArr.map(item => setUrlPrefix(item));
      } else {
        fileList.value = val ? [setUrlPrefix(val)] : [];
      }
    }
  },
  { deep: true, immediate: true },
);

// 上传前loading加载
function handleBeforeUpload(file: File) {
  let isImg = false;
  if (props.fileType.length) {
    let fileExtension = '';
    if (file.name.lastIndexOf('.') > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
    }
    isImg = props.fileType.some((type: string) => {
      if (fileExtension && type.indexOf(fileExtension) > -1) return true;
      return false;
    });
  } else {
    isImg = file.type.indexOf('image') > -1;
  }
  if (!isImg) {
    ElMessage.error(`文件格式不正确, 请上传${props.fileType.join('/')}格式文件!`);
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      ElMessage.error(`上传图片大小不能超过 ${fileSizeString(props.fileSize)}!`);
      return false;
    }
  }
  try {
    const newFileName = dotToLine(file.name);
    // 创建新的 File 对象
    const newFile = new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified,
    });
    uploadFile(newFile);
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const uploadRef = ref<UploadInstance>();
/** 上传文件替换 */
const handleExceed: UploadProps['onExceed'] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  uploadFile(file);
};

/**
 * 将文件名中的点号替换为横线
 * @param fileName 文件名
 * @returns 替换后的文件名
 * @example
 * dotToLine('file.name.txt') // 返回 'file-name.txt'
 * dotToLine('my.file') // 返回 'my-file'
 */
const dotToLine = (fileName: string): string => {
  if (!fileName) return '';

  // 获取最后一个点号的位置（保留文件扩展名）
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1) {
    // 如果没有扩展名，直接替换所有点号
    return fileName.replace(/\./g, '-');
  }

  // 分离文件名和扩展名
  const name = fileName.substring(0, lastDotIndex);
  const ext = fileName.substring(lastDotIndex);

  // 替换文件名中的点号，保留扩展名
  return name.replace(/\./g, '-') + ext;
};
const uploadProgress = ref(0);
const uploadProgressLoaded = ref(0);
const uploadProgressTotal = ref(0);

// 添加一个格式化文件大小的函数
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

async function uploadFile(file: File) {
  // 重置进度相关的状态
  upLoading.value = true;
  uploadProgress.value = 0;
  uploadProgressLoaded.value = 0;
  uploadProgressTotal.value = 0;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await props.uploadApi(
      formData,
      { ckeditor_type: props.ckeditorType },
      {
        onUploadProgress: (progressEvent: any) => {
          const loaded = progressEvent.loaded;
          const total = progressEvent.total;
          uploadProgressLoaded.value = loaded;
          uploadProgressTotal.value = total;
          // 计算百分比并四舍五入到整数
          const complete = Math.round((loaded / total) * 100);
          uploadProgress.value = complete;
        },
      },
    );
    // 处理多文件上传
    if (props.limit > 1) {
      if (fileList.value.length < props.limit) {
        //  批量上传
        // console.log(154,setUrlPrefix(data.url));
        fileList.value.push(setUrlPrefix(data.url));
        form.value[formProp] = fileList.value.map(item => removeUrlPrefix(item.url)).join(',');
        // console.log(form.value[formProp]);
      } else {
        // 超出数量限制
        fileList.value.push(setUrlPrefix(data.url));
        fileList.value.shift();
      }
    } else {
      if (form.value) {
        if (data.url) {
          form.value[formProp] = data.url; // 此处存放的为 / 后面的路径
          props.onSuccess(data.url);
        } else {
          form.value[formProp] = '';
          ElMessage.error(data.errmsg);
        }
      } else {
        ElMessage.success('上传成功');
      }
    }
    emit('onSuccess', data);
  } catch (error) {
    console.log('上传错误：', error);
    ElMessage.error('上传失败');
  } finally {
    upLoading.value = false;
  }
}

function getUrlJson(url: string) {
  return { url: urlPrefix + url, name: getFileName(url) };
}

/**
 * 设置url前缀
 * @param url 文件路径
 * @returns 文件路径和文件名
 */
function setUrlPrefix(url: string) {
  return { url: url.indexOf(urlPrefix) != -1 ? url : urlPrefix + url, name: getFileName(url) };
}

const handleSuccess = (response: any, file: any, fileList: any) => {
  emit('onSuccess', response);
};

function removeUrlPrefix(url: string) {
  return url.indexOf(urlPrefix) != -1 ? url.split(urlPrefix)[1] : url;
}

const handleRemove: UploadProps['onRemove'] = (uploadFile: UploadFile, uploadFiles: any) => {
  fileList.value = uploadFiles;
  if (fileList.value.length > 0) {
    //  后端要求的路径格式是 url1,url2 的字符串拼接
    form.value[formProp] = fileList.value.map(item => removeUrlPrefix(item.url)).join(',');
  } else {
    if (form.value) {
      form.value[formProp] = '';
    }
  }
};

const imageTypes = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.tiff', '.bmp', '.heif', '.svg'];
const isImage = (name: string) => {
  let res = false;
  imageTypes.forEach((item: any) => {
    if (name.endsWith(item)) {
      res = true;
    }
  });
  return res;
};
const handleImgPreview: UploadProps['onPreview'] = (uploadFile: any) => {
  dialogData.value = setUrlPrefix(uploadFile.url) || {};
  dialogVisible.value = true;
};
</script>

<style scoped lang="scss">
:deep(.hide .el-upload--picture-card) {
  display: none;
}
.el-upload__tip {
  line-height: 1.2;
}
.upload-progress {
  margin: 10px 0;
  width: 300px;
}

.progress-info {
  font-size: 12px;
  color: #606266;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}
</style>
