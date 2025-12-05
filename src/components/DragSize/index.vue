<template>
  <div>
    <div v-show="isMove" class="screen" :style="{ zIndex: zIndex }" />
    <transition name="el-fade-in-linear">
      <div :id="'drag' + pIndex" class="dragsize" :style="{ zIndex: zIndex }" @mousedown="selectItem">
        <div class="title">
          <div class="title-open">
            <h2>{{ kvm.name }}</h2>
          </div>
          <div class="window-control">
            <el-tooltip v-if="!isFullScreen" :enterable="false" effect="dark" content="最大化" placement="bottom">
              <el-icon color="#1d1d1d" @click="fullFunc">
                <FullScreen />
              </el-icon>
            </el-tooltip>
            <el-tooltip v-else :enterable="false" effect="dark" content="最小化" placement="bottom">
              <SvgIcon class="cursor-pointer" icon-class="exit-fullscreen" color="#1d1d1d" @click="smallFunc" />
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="关闭" placement="bottom">
              <el-icon color="#1d1d1d" @click="closeFunc">
                <Close />
              </el-icon>
            </el-tooltip>
          </div>
        </div>
        <div class="resizeL" />
        <div class="resizeT" />
        <div class="resizeR" />
        <div class="resizeB" />
        <div class="resizeLT" />
        <div class="resizeTR" />
        <div class="resizeBR">
          <i class="iconfont icon-resize-bottom-right" />
        </div>
        <div class="resizeLB" />
        <div class="content-drag">
          <slot>暂无内容</slot>
        </div>
        <div v-if="isMove" class="content-modal" />
      </div>
    </transition>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue';
/** 获取id, class, tagName */
const get = {
  byClass: (sClass, targetEle) => {
    const aClass = [];
    const reClass = new RegExp('(^| )' + sClass + '( |$)');
    const aElem = get.byTagName('*', targetEle);
    for (let i = 0; i < aElem.length; i++) {
      reClass.test(aElem[i].className) && aClass.push(aElem[i]);
    }
    return aClass;
  },
  byTagName: (elem, obj) => {
    return (obj || document).getElementsByTagName(elem);
  },
};
export default {
  components: {
    SvgIcon,
  },
  props: {
    kvm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    dragMinHeight: {
      type: Number,
      default: 500,
    },
    dragMinWidth: {
      type: Number,
      default: 500,
    },
    pIndex: {
      type: Number,
      default: -1,
    },
    zIndex: {
      type: Number,
      default: 10,
    },
    defaultPosition: {
      type: Object,
      default: () => {
        return {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        };
      },
    },
  },
  data() {
    return {
      isFullScreen: false,
      isMove: false,
    };
  },
  mounted() {
    const oDrag = document.getElementById(`drag${this.pIndex}`);
    oDrag.style.width = this.dragMinWidth + 'px';
    oDrag.style.height = this.dragMinHeight + 'px';
    oDrag.style.left = this.defaultPosition.left + 'px';
    oDrag.style.top = this.defaultPosition.top + 'px';
    this.resizeFun();
    window.addEventListener('resize', this.resizeFun);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun);
  },
  methods: {
    closeFunc(e) {
      e.stopPropagation();
      this.$emit('close', this.kvm);
    },
    smallFunc(e) {
      e.stopPropagation();
      this.isFullScreen = false;
      const oDrag = document.getElementById(`drag${this.pIndex}`);
      oDrag.style.width = this.dragMinWidth + 'px';
      oDrag.style.height = this.dragMinHeight + 'px';
      oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + 'px';
      oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + 'px';
    },
    fullFunc(e) {
      e.stopPropagation();
      const oDrag = document.getElementById(`drag${this.pIndex}`);
      oDrag.style.top = oDrag.style.left = 0;
      oDrag.style.width = document.documentElement.clientWidth - 2 + 'px';
      oDrag.style.height = document.documentElement.clientHeight - 2 + 'px';
      this.isFullScreen = true;
    },
    selectItem() {
      this.$emit('selectItem', this.kvm);
    },
    resizeFun() {
      const oDrag = document.getElementById(`drag${this.pIndex}`);
      const oTitle = get.byClass('title', oDrag)[0];
      const oL = get.byClass('resizeL', oDrag)[0];
      const oT = get.byClass('resizeT', oDrag)[0];
      const oR = get.byClass('resizeR', oDrag)[0];
      const oB = get.byClass('resizeB', oDrag)[0];
      const oLT = get.byClass('resizeLT', oDrag)[0];
      const oTR = get.byClass('resizeTR', oDrag)[0];
      const oBR = get.byClass('resizeBR', oDrag)[0];
      const oLB = get.byClass('resizeLB', oDrag)[0];
      this.drag(oDrag, oTitle);
      // 四角
      this.resize(oDrag, oLT, true, true, false, false);
      this.resize(oDrag, oTR, false, true, false, false);
      this.resize(oDrag, oBR, false, false, false, false);
      this.resize(oDrag, oLB, true, false, false, false);
      // 四边
      this.resize(oDrag, oL, true, false, false, true);
      this.resize(oDrag, oT, false, true, true, false);
      this.resize(oDrag, oR, false, false, false, true);
      this.resize(oDrag, oB, false, false, true, false);
      if (this.isFullScreen) {
        oDrag.style.width = document.documentElement.clientWidth - 2 + 'px';
        oDrag.style.height = document.documentElement.clientHeight - 2 + 'px';
      }
      oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + 'px';

      oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + 'px';
    },
    drag(oDrag, targetSideEle) {
      let disX = 0;
      let dixY = 0;
      targetSideEle = targetSideEle || oDrag;
      targetSideEle.style.cursor = 'move';
      targetSideEle.onmousedown = e => {
        const event = e || window.event;
        disX = event.clientX - oDrag.offsetLeft;
        dixY = event.clientY - oDrag.offsetTop;
        const dixxX = disX;
        const dixxY = dixY;
        this.isMove = true;
        document.onmousemove = e => {
          const event = e || window.event;
          let iL = event.clientX - dixxX;
          let iT = event.clientY - dixxY;
          const maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
          const maxT = document.documentElement.clientHeight - oDrag.offsetHeight;
          iL <= 0 && (iL = 0);
          iT <= 0 && (iT = 0);
          iL >= maxL && (iL = maxL);
          iT >= maxT && (iT = maxT);
          oDrag.style.left = iL + 'px';
          oDrag.style.top = iT + 'px';
          return false;
        };
        document.onmouseup = () => {
          this.isMove = false;
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    },
    /* -------------------------- +
      改变大小函数
      +-------------------------- */
    resize(targetEle, targetSideEle, isLeft, isTop, lockX, lockY) {
      targetSideEle.onmousedown = e => {
        const event = e || window.event;
        const disX = event.clientX - targetSideEle.offsetLeft;
        const disY = event.clientY - targetSideEle.offsetTop;
        const iParentTop = targetEle.offsetTop;
        const iParentLeft = targetEle.offsetLeft;
        const iParentWidth = targetEle.offsetWidth;
        const iParentHeight = targetEle.offsetHeight;
        this.isMove = true;

        document.onmousemove = e => {
          const event = e || window.event;
          const iL = event.clientX - disX;
          const iT = event.clientY - disY;
          const maxW = document.documentElement.clientWidth - targetEle.offsetLeft - 2;
          const maxH = document.documentElement.clientHeight - targetEle.offsetTop - 2;
          let iW = isLeft ? iParentWidth - iL : targetSideEle.offsetWidth + iL;
          let iH = isTop ? iParentHeight - iT : targetSideEle.offsetHeight + iT;

          if (isLeft && iL < 0) {
            targetEle.style.left = iParentLeft + iL + 'px';
          }

          if (isTop && iT < 0) {
            targetEle.style.top = iParentTop + iT + 'px';
          }

          if (iW < this.dragMinWidth) {
            iW = this.dragMinWidth;
          }

          if (iW > maxW) {
            iW = maxW;
          }

          if (!lockX) {
            targetEle.style.width = iW + 'px';
          }

          if (iH < this.dragMinHeight) {
            iH = this.dragMinHeight;
          }

          if (iH > maxH) {
            iH = maxH;
          }

          if (!lockY) {
            targetEle.style.height = iH + 'px';
          }

          return false;
        };
        document.onmouseup = () => {
          this.isMove = false;
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.icon,
.iconfont {
  margin: 0 5px;
  cursor: pointer;
  font-size: 20px;
}
.screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.dragsize {
  position: fixed;
  top: 100px;
  left: 100px;
  width: 300px;
  height: 160px;
  background: #fff;
  border-radius: 8px;
  padding: 5px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #ccc;
  .title {
    border-radius: 5px 5px 0 0;
    height: 27px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-open {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h2 {
      margin: 0;
      padding-left: 5px;
      font-size: 14px;
      color: #000;
    }
  }
  .window-control {
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .el-icon {
      margin-left: 15px;
    }
  }
  .content-drag {
    overflow: auto;
    width: 100%;
    margin: 0;
    height: calc(100% - 27px);
  }
  .content-modal {
    position: absolute;
    top: 28px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .resizeBR {
    position: absolute;
    width: 14px;
    height: 16px;
    right: 0;
    bottom: 0;
    overflow: hidden;
    cursor: nw-resize;
  }
  .resizeL,
  .resizeT,
  .resizeR,
  .resizeB,
  .resizeLT,
  .resizeTR,
  .resizeLB {
    position: absolute;
    overflow: hidden;
    opacity: 0;
    filter: alpha(opacity=0);
  }
  .resizeL,
  .resizeR {
    top: 0;
    width: 5px;
    height: 100%;
    cursor: w-resize;
  }

  .resizeL {
    left: -2px;
  }

  .resizeR {
    right: 0;
  }
  .resizeT,
  .resizeB {
    width: 100%;
    height: 5px;
    cursor: n-resize;
  }
  .resizeT {
    top: 0;
  }
  .resizeB {
    bottom: 0;
  }
  .resizeLT,
  .resizeTR,
  .resizeLB {
    width: 16px;
    height: 16px;
  }
  .resizeLT {
    top: 0;
    left: 0;
    cursor: nw-resize;
  }
  .resizeTR {
    top: 0;
    right: 0;
    cursor: ne-resize;
  }
  .resizeLB {
    left: 0;
    bottom: 0;
    cursor: ne-resize;
  }
  .title i,
  i.open {
    cursor: pointer;
  }
}
</style>
