<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-12 10:07:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-01-10 14:30:47
 * @Description: 
-->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { Mark } from './types';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { formatSeconds } from '@/utils/datetime';
const props = defineProps({
  /** 课程id */
  courseId: {
    type: Number,
    required: true,
  },
  /** 视频源 */
  source: {
    type: String,
    required: true,
  },
});

/**
 * 事件监听
 * 1. changeDuration: 视频总时长
 * 2. changeCurrentTime: 当前播放时间
 */
const emit = defineEmits(['changeDuration', 'changeCurrentTime']);

/** 初始化渲染 */
const videoRef = ref<HTMLVideoElement>();
/** 视频总时长 */
const duration = ref(0);
/** 播放时间记录 */
const timeRecord = ref(0);
/**  当前播放时间(s.ususususus,秒为单位，浮点类型，3.123456) */
const currentTime = ref(0);
/** 播放器实例 */
const player = ref<Player>();
// 通过监听 timeupdate 事件获取播放时间，并允许用户点击进度条添加标记。
/** 视频元数据加载完成 */
const onMetadataLoaded = () => {
  duration.value = (videoRef.value as HTMLVideoElement).duration; // 读取视频总时长
  emit('changeDuration', duration.value);
};
// 时间更新事件
const onTimeUpdate = () => {
  currentTime.value = (videoRef.value as HTMLVideoElement)?.currentTime; // 读取当前播放时间
  /** 1秒1发 */
  const time = Math.ceil(currentTime.value);
  if (time - timeRecord.value === 1) {
    emit('changeCurrentTime', currentTime.value);
    timeRecord.value = Math.ceil(currentTime.value);
  }
};

/** 编辑器实例，必须用 shallowRef */
const editorRef = shallowRef();
/** 富文本编辑器配置 */
const editorConfig = { placeholder: '请输入内容' };
// 内容 HTML
const imgNoteBookNote = ref('<p></p>');
/** 富文本编辑器初始化 */
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 笔记相关
/** 截图笔记弹窗visible */
const imgNoteBookDialogVisible = ref(false);
const noteImgUrl = ref(''); // 截图
/** 弹出记笔记窗口 */
const showImgNoteBookDialog = (markData?: Mark) => {
  if (markData) {
    imgNoteBookNote.value = markData.description;
    noteImgUrl.value = markData.imgUrl;
  } else {
    imgNoteBookNote.value = '<p></p>';
    noteImgUrl.value = takeScreenshot();
  }
  player.value && player.value.pause();
  imgNoteBookDialogVisible.value = true;
};
/** 关闭图片笔记窗口 */
const handleImgNoteBookClose = () => {
  imgNoteBookNote.value = '<p></p>';
  noteImgUrl.value = takeScreenshot();
  imgNoteBookDialogVisible.value = false;
};

/** 图片笔记展示系列 */
/** 截图笔记时间节点列 */
const marks = ref<Mark[]>([]);
const isSaveNoteImg = ref(true);
/** 添加时间节点图片笔记 */
const addMark = note => {
  const currentTime = (videoRef.value as HTMLVideoElement).currentTime;
  const mark: Mark = {
    time_point: Math.floor(currentTime),
    curriculum: props.courseId,
    content: note,
    picture_path: noteImgUrl.value,
  };
  marks.value.push(mark);
  handleImgNoteBookClose();
};

/** 跳到对应的时间节点 */
const jumpToMark = time => {
  (videoRef.value as HTMLVideoElement).currentTime = time;
};

/** 文本笔记 */
/** 文本笔记弹窗visible */
const textNoteBookDialogVisible = ref(false);
const textNoteBookNote = ref('<p></p>');
const showTextNoteBookDialog = () => {
  player.value && player.value.pause();
  textNoteBookDialogVisible.value = true;
};
/** 视频截图 */
const takeScreenshot = () => {
  const video = videoRef.value as HTMLVideoElement;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  try {
    ctx && ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  } catch (e) {
    console.error('无法导出 Canvas 数据：', e);
    return '';
  }
};

/** 保存截图 */
const saveCanvas = (canvas: HTMLCanvasElement) => {
  const imageSrc = canvas && canvas.toDataURL();
  // some download code down here
  const a = document.createElement('a');
  a.href = imageSrc;
  a.download = 'image.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 保存到本地或上传到服务器
};
const handleCanvasClose = () => {
  textNoteBookDialogVisible.value = false;
};

/** 视频开始播放 */
const onPlay = () => {
  console.log('视频开始播放');
};
/** 视频暂停事件 */
const onPause = () => {
  console.log('视频暂停');
};

onMounted(() => {
  player.value = videojs(videoRef.value as HTMLVideoElement, {
    controls: true,
    fluid: true,
    preload: 'metadata',
  });
  (videoRef.value as HTMLVideoElement).crossOrigin = 'anonymous';
});
onBeforeUnmount(() => {
  player.value && player.value.dispose();
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<template>
  <div class="video-player">
    <!-- <div class>
			<el-button plain @click="showTextNoteBookDialog()">笔记</el-button>
			<el-button plain @click="showImgNoteBookDialog()">截图笔记</el-button>
		</div> -->
    <video
      ref="videoRef"
      id="videoRef"
      class="video-js"
      controls
      preload="metadata"
      @play="onPlay"
      @pause="onPause"
      @loadedmetadata="onMetadataLoaded"
      @timeupdate="onTimeUpdate"
    >
      <p class="vjs-no-js">您的浏览器不支持 HTML5 视频播放</p>
      <source :src="props.source" type="video/mp4" />
    </video>
    <div id="progress-bar" class="h-5 bg-gray-200 rounded-full relative">
      <div v-for="mark in marks" :key="mark.time" @click.stop="jumpToMark(mark.time)">
        <!-- <div v-show="mark.time" @click="showImgNoteBookDialog(mark)" class="mark-label">{{ mark.label }}</div> -->
        <el-tooltip placement="top">
          <template #content>
            <p>
              时间：{{ formatSeconds(mark.time, 's', { h: '时', m: '分', s: '秒' }) }}/{{
                formatSeconds(Math.floor(duration), 's', { h: '时', m: '分', s: '秒' })
              }}
            </p>
            <el-button @click="showImgNoteBookDialog(mark)">查看笔记</el-button>
          </template>
          <div :style="{ left: `${(mark.time / duration) * 100}%` }" class="mark"></div>
        </el-tooltip>
      </div>
    </div>
    <el-dialog
      v-model="imgNoteBookDialogVisible"
      title="Tips"
      width="900"
      :before-close="handleImgNoteBookClose"
      destroy-on-close
    >
      <img class="mx-auto" :src="noteImgUrl" alt="" />
      <el-switch v-model="isSaveNoteImg" size="large" active-text="保存截图" inactive-text="不保存截图" />
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="{}" />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="imgNoteBookNote"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="imgNoteBookDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addMark(imgNoteBookNote)">保存</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- <el-dialog v-model="textNoteBookDialogVisible" title="笔记" width="900" :before-close="handleCanvasClose">
			<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="{}" />
			<Editor
				style="height: 500px; overflow-y: hidden"
				v-model="textNoteBookNote"
				:defaultConfig="editorConfig"
				@onCreated="handleCreated"
			/>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="textNoteBookDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="saveCanvas(canvasRef as HTMLCanvasElement)">保存</el-button>
				</div>
			</template>
		</el-dialog> -->
  </div>
</template>

<style lang="scss" scoped>
.video-player {
  width: 100%;
}

:deep(.video-js) {
  width: 100%;
  height: 100%;
}

#progress-bar {
  position: relative;
  width: 100%;
  height: 5px;
  background: lightgray;
}
.mark {
  position: absolute;
  top: 0;
  width: 10px;
  height: 5px;
  background: red;
  cursor: pointer;
}
#canvas {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
#canvas-img {
  background-color: #fff;
}
</style>
