<script setup lang="ts" name="renderPdf">
import { requestFullScreen } from './index';
import { ref, onMounted, onBeforeUnmount, defineEmits, nextTick } from 'vue';
import * as PdfJs from 'pdfjs-dist';
import * as pdfWorkerMin from 'pdfjs-dist/build/pdf.worker.min?url';
import { PDFDocumentProxy } from 'pdfjs-dist';

const props = defineProps({
  pdfName: {
    type: String,
    default: '',
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  pageNum: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['updatePageNum']);

const winWidth = ref<string | number>('100%');
const winHeight = ref<string | number | null>(null);
const loading = ref<Boolean>(false);
const lockPage = ref<Boolean>(false);
const isFullScreen = ref<Boolean>(false);
const showPdfList = ref<Boolean>(false);
const resizeTime = ref();
const pages = ref<number>(0);
const showPage = ref<number>(0);
let pdfDoc: PDFDocumentProxy; // pdfjs 生成的对象
onMounted(() => {
  PdfJs.GlobalWorkerOptions.workerSrc = pdfWorkerMin.default;
  _loadFile(props.pdfUrl);
  window.onresize = () => {
    if (resizeTime.value) {
      clearTimeout(resizeTime.value);
    }
    resizeTime.value = setTimeout(() => {
      if (props.pdfUrl) {
        showPdfList.value = false;
        _loadFile(props.pdfUrl);
      }
      clearTimeout(resizeTime.value);
    }, 1000);
  };
});

onBeforeUnmount(() => {
  if (document.querySelector('.cpdf .center')) {
    document.querySelector('.cpdf .center')?.removeEventListener('scroll', scroll, false);
  }
});

const updataPageNunBefore = (pageChange: any) => {
  const data = {
    total: pages.value,
    current_point: pageChange,
  };
  emit('updatePageNum', data);
};

const cpdf = ref<HTMLElement>();
const scrollToElement = (pageNum: any) => {
  const canvasHeightArr = Array.from(document.querySelectorAll('.canvas-pdf'));
  let scrollTopPx = 0;
  for (let index = 0; index < canvasHeightArr.length; index++) {
    if (pageNum == index + 1) {
      break;
    } else {
      scrollTopPx += (canvasHeightArr[index] as HTMLElement).offsetHeight;
    }
  }
  (cpdf.value as HTMLElement).scrollTop = scrollTopPx;
};

const prevpage = () => {
  // 上一页
  if (props.pageNum <= 1) {
    return;
  }
  const pageChange = props.pageNum - 1;
  updataPageNunBefore(pageChange);
  scrollToElement(pageChange);
};

const nextpage = () => {
  // 下一页
  if (props.pageNum >= pages.value) {
    return;
  }
  const pageChange = props.pageNum + 1;
  updataPageNunBefore(pageChange);
  scrollToElement(pageChange);
};

const scroll = () => {
  const canvasPdfs = document.getElementsByClassName('canvas-pdf');
  const scrollTopBox = document.querySelector('.cpdf .center').scrollTop;
  for (let index = 0; index < canvasPdfs.length; index++) {
    const offsetTop = canvasPdfs[index].offsetTop;
    const heightCanvas = canvasPdfs[index].offsetHeight;
    if (offsetTop + heightCanvas * 0.6 > scrollTopBox) {
      const pageChange = index + 1;
      updataPageNunBefore(pageChange);
      if (pageChange == showPage.value - 1 && !lockPage.value && showPage.value !== pages.value) {
        const newPage = showPage.value;
        lockPage.value = true;
        showPage.value = newPage + 5 < pages.value ? newPage + 5 : pages.value;
        _renderPage(newPage);
      }
      return;
    }
  }
};

const showLoading = () => {
  loading.value = true;
};

const hideLoading = () => {
  loading.value = false;
};

const _loadFile = (url: any) => {
  showLoading();
  PdfJs.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
    pages.value = pdfDoc.numPages;
    showPage.value = pages.value > 5 ? 5 : pages.value;
    const pageChange = props.pageNum || 1;
    updataPageNunBefore(pageChange);
    showPdfList.value = true;
    nextTick(() => {
      _renderPage(1);
    });
  });
};

const _renderPage = (num: any) => {
  showPage.value = num > showPage.value ? num : showPage.value;
  pdfDoc.getPage(num).then((page: any) => {
    const canvas = document.getElementById('the-canvas' + num);
    const ctx = canvas && canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    const ratio = dpr / bsr;
    const xScale =
      document.querySelector('.cpdf .center').clientWidth /
      page.getViewport({
        scale: 1,
      }).width;
    const yScale =
      document.querySelector('.cpdf .center').clientHeight /
      page.getViewport({
        scale: 1,
      }).height;

    let viewport;
    if (xScale < yScale) {
      viewport = page.getViewport({
        scale:
          document.querySelector('.cpdf .center').clientHeight /
          page.getViewport({
            scale: 1,
          }).height,
      });
    } else {
      viewport = page.getViewport({
        scale:
          document.querySelector('.cpdf .center').clientWidth /
          page.getViewport({
            scale: 1,
          }).width,
      });
    }

    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    canvas.style.width = viewport.width + 'px';
    canvas.style.height = viewport.height + 'px';
    document.querySelector('.render-pdf-component').style.height = viewport.height + 48 + 'px';

    if (canvas.width == 0) {
      canvas.width = 400;
    }
    if (canvas.height == 0) {
      canvas.height = 400;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page.render(renderContext);
    if (num < pages.value) {
      _renderPage(num + 1);
    } else {
      lockPage.value = false;
      nextTick(() => {
        scrollToElement(props.pageNum);
      });
      hideLoading();
      nextTick(() => {
        document.querySelector('.cpdf .center').removeEventListener('scroll', scroll, false);
        scroll();
        document.querySelector('.cpdf .center').addEventListener('scroll', scroll);
      });
    }
  });
};

const pdfWrap = ref(null);
const fullScreen = () => {
  requestFullScreen(pdfWrap.value);
  winWidth.value = window.document.documentElement.clientWidth;
  winHeight.value = window.document.documentElement.clientHeight;
  isFullScreen.value = true;

  cpdf.value.style.width = window.document.documentElement.clientWidth;
  document.addEventListener(
    'webkitfullscreenchange',
    () => {
      if (!document.webkitIsFullScreen) {
        isFullScreen.value = false;
      }
      scrollToElement(props.pageNum);
    },
    false,
  );

  document.addEventListener(
    'fullscreenchange',
    () => {
      if (!document.fullscreen) {
        isFullScreen.value = false;
      }
      scrollToElement(props.pageNum);
    },
    false,
  );

  document.addEventListener(
    'mozfullscreenchange',
    () => {
      if (!document.mozFullScreen) {
        isFullScreen.value = false;
      }
      scrollToElement(props.pageNum);
    },
    false,
  );
  document.addEventListener(
    'msfullscreenchange',
    () => {
      if (!document.msFullscreenElement) {
        isFullScreen.value = false;
      }
      scrollToElement(props.pageNum);
      // fullscreenState.innerHTML = (document.msFullscreenElement) ? '' : 'not';
    },
    false,
  );
};
</script>

<template>
  <div class="render-pdf-component">
    <div
      ref="pdfWrap"
      v-loading="loading"
      class="cpdf"
      element-loading-text="获取资源..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div v-if="showPdfList" class="control">
        <div>
          <div class="name ellipsis">{{ pdfName || '' }}</div>
        </div>
        <div>
          <el-button @click="prevpage" type="primary" size="small">上一页</el-button>
          <span class="ml-2 mr-3">
            页:
            <span v-text="pageNum" />
            /
            <span v-text="pages" />
          </span>
          <el-button @click="nextpage" type="primary" size="small">下一页</el-button>
        </div>
        <div>
          <el-button v-if="showPdfList" @click="fullScreen" type="primary" size="small">进入全屏</el-button>
        </div>
      </div>
      <div v-if="showPdfList" ref="cpdf" class="center">
        <div v-for="(page, index) in pages" :key="index" class="canvas-pdf">
          <canvas :id="'the-canvas' + page" class="w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.render-pdf-component {
  .header-box {
    padding: 0 30px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cpdf {
    width: 100%;
    height: calc(100% - 50px);
    border: 1px solid #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .control {
      width: 100%;
      padding: 8px;
      background: rgba(0, 0, 0, 1);
      color: #fff;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .center {
      position: absolute;
      text-align: center;
      top: 48px;
      left: 0;
      right: 0;
      width: 100%;
      height: calc(100% - 48px);
      min-height: 300px;
      overflow: auto;
      .canvas-pdf {
        border-bottom: 1px solid #000;
        box-sizing: content-box;
        width: 100%;
        height: 100%;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
