<template>
  <div class="notice-message-dialog">
    <el-dialog
      :title="dialogTitle"
      class="checkou-dialog center-dialog"
      v-model="dialogNotice"
      width="1200px"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @closed="dialogClosed"
    >
      <div class="notice-content">
        <div class="left-box">
          <div class="title">
            <el-icon style="margin-right: 5px"><Bell /></el-icon>
            公告消息
          </div>
          <div ref="noticeLists" class="notice-content-box" style="padding: 20px">
            <div v-infinite-scroll="getNoticeList" infinite-scroll-disabled="disabled">
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in noticeMessagesList"
                  :key="index"
                  :timestamp="item.created_local_time"
                  placement="top"
                  :class="{ 'breathe-btn': item.breath }"
                >
                  <el-card>
                    <div class="notice-member ellipsis">{{ item.sender_name }}（{{ item.identity }}）</div>
                    <div v-html="item.content" />
                  </el-card>
                </el-timeline-item>
              </el-timeline>
              <p v-if="loading" class="center-tip">加载中...</p>
              <p v-if="noMore" class="center-tip">没有更多了</p>
            </div>
          </div>
        </div>
        <div class="right-box">
          <div class="title">
            <el-icon style="margin-right: 5px"><Message /></el-icon>
            发送公告
          </div>
          <div class="notice-content-box1">
            <div v-if="dialogNotice" class="content1">
              <ckeditor v-model="noticeContent" :config="configWhite" :editor="editor" />
            </div>
            <div v-if="enInputShow" class="header">
              <div class="title">
                <i class="iconfont icon-liaoningchouyangqingdanpingtai-" />
                Send announcement
              </div>
            </div>
            <div v-if="dialogNotice && enInputShow" class="content1">
              <ckeditor v-model="noticeContent_en" :config="configWhite" :editor="editor" />
            </div>
            <div class="sendbtn">
              <el-button @click="postExamNotice" type="primary" style="width: 100%">发 送</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="baseTable">
import { ref, defineEmits, defineExpose } from 'vue';
import { getNoticeListApi, sendNoticeMsgApi } from '@/api/attacktest/matchjudge';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { localGet, localSet, getToken } from '@/utils/cache';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['closedNoticeDialog']);
const props = defineProps({
  dialogTitle: {
    type: String,
    default: '发送公告',
  },
  personId: {
    type: Number,
    default: 0,
  },
});

const dialogNotice = ref(true);
/**
 * @function showHandler
 * @description 打开弹窗
 * @author sunyongkang
 * @Date: 2024-11-08 14:07:06
 */
const showHandler = () => {
  dialogNotice.value = true;
  getNoticeList();
  // if (getStore('plotWhite')) {
  //   this.SET_PLOTWSID(getStore('plotWhite'));
  // }
};
/**
 * @function dialogClosed
 * @description 关闭弹窗
 * @author sunyongkang
 * @Date: 2024-11-08 14:23:21
 */
const dialogClosed = () => {
  emit('closedNoticeDialog');
};

const loading = ref<boolean>(false);
const lastId = ref('');
const noMore = ref(false);
const pageSize = ref(10);
const noticeMessagesList = ref([]);
const enInputShow = ref<boolean>(false);
const noticeContent = ref('');
const noticeContent_en = ref('');
const editor = ref(ClassicEditor);
const configWhite = ref({
  language: 'zh-cn',
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
    ],
  },
  image: {
    toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  ckfinder: {
    uploadUrl: `/uploadfile`, // 上传图片接口
    options: {
      resourceType: 'Images',
    },
  },
});
/**
 * @function addNoticeMessage
 * @description 添加消息
 * @author sunyongkang
 * @Date: 2024-11-08 14:23:40
 */
const getNoticeList = () => {
  loading.value = true;
  let params = {};
  params = getNoticeParams();
  getNoticeListApi(params).then((res: any) => {
    const data = res.page_data;
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].identity === '管理员') {
        arr.push(data[i]);
      }
    }
    noticeMessagesList.value = arr;
    noMore.value = !res.page_info.has_next;

    if (!noMore.value) {
      lastId.value = data[data.length - 1].id;
    }
    loading.value = false;
  });
};

/**
 * @function getNoticeParams
 * @description 返回消息参数
 * @returns params 消息参数
 * @author sunyongkang
 * @Date: 2024-11-08 14:25:36
 */
const getNoticeParams = () => {
  let params = {};
  if (props.personId) {
    params = {
      receive_user_id: props.personId,
      match_plan: localGet('matchPlot') * 1,
      category: 'match_plan',
      last_id: lastId.value,
      page_size: pageSize.value,
    };
  } else if (props.dialogTitle == '系统公告') {
    params = {
      category: 'notice',
      last_id: lastId.value,
      page_size: pageSize.value,
    };
  } else {
    params = {
      match_plan: localGet('plotWhite') * 1,
      category: 'match_plan',
      last_id: lastId.value,
      page_size: pageSize.value,
    };
  }
  return params;
};

/**
 * @function postExamNotice
 * @description 发送消息
 * @author sunyongkang
 * @Date: 2024-11-08 14:46:30
 */
const postExamNotice = () => {
  let data = {};
  if (props.personId) {
    data = {
      msg_type: 1,
      receive_user_id: props.personId,
      match_plan: localGet('matchPlot') * 1,
      content: noticeContent.value,
      content_en: noticeContent_en.value,
      category: 'match_plan',
    };
  } else if (props.dialogTitle == '系统公告') {
    data = {
      content: noticeContent.value,
      content_en: noticeContent_en.value,
      category: 'notice',
    };
  } else {
    data = {
      content: noticeContent.value,
      content_en: noticeContent_en.value,
      match_plan: localGet('plotWhite') * 1,
      category: 'match_plan',
    };
  }
  sendNoticeMsgApi(data).then((res: any) => {
    ElMessage({
      message: '公告发布成功',
      type: 'success',
    });
    noticeContent.value = '';
    noticeContent_en.value = '';
    getNoticeList();
  });
};
const disabled = () => {
  return loading.value || noMore.value;
};
defineExpose({ showHandler });
</script>

<style lang="scss" scoped>
.notice-content {
  height: 600px;
  width: 100%;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  .left-box,
  .right-box {
    height: 100%;
    width: 49%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      width: 100%;
      height: 40px;
      background-color: #0e6aa2;
      display: flex;
      align-items: center;
      padding-left: 10px;
    }
    .notice-content-box {
      width: 100%;
      height: calc(100% - 40px);
      border: 1px solid #0e6aa2;
      border-top: 0;
      overflow-y: auto;
      .center-tip {
        text-align: center;
      }
    }
    .notice-content-box1 {
      width: 100%;
      height: calc(100% - 40px);
      border: 1px solid #0e6aa2;
      border-top: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
      .sendbtn {
        width: 100%;
      }
    }
  }
}
:deep(.ck-editor__editable_inline) {
  min-height: 420px;
  color: #000;
}
</style>
