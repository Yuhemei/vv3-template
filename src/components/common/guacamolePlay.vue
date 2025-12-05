<!--
  @name:guaca播放组件
  @description:抽离guaca播放视频功能，通过guacamole插件调用http接口绘制canvas实现播放视频
  @author: 李尚霖
  @date 2023-07-10
-->

<template>
  <div class="gua-play-page">
    <div class="box-content-top" :style="{ height: isBigScreen ? '5%' : '7%' }">
      <span style="margin-left: 10px; font-size: 0.18rem; font-weight: 600">{{ name }}</span>
      <span style="margin-left: 20px; font-size: 0.14rem; font-weight: 600">昵称：{{ userName }}</span>
      <span style="margin-left: 20px; font-size: 0.14rem; font-weight: 600">文件大小：{{ fileSize }}</span>
      <i class="el-icon-close iconClose" @click="$emit('clickClose', indexs)" />
    </div>
    <div :id="'display-' + content" style="width: 100%" :style="{ height: isBigScreen ? '90%' : '85%' }">
      <div :id="'screen-' + content" style="width: 100%; height: 100%" @click="toggle()" />
    </div>
    <div v-show="recording != null" class="box-content-bottom" :style="{ height: isBigScreen ? '5%' : '8%' }">
      <i
        v-show="!isPlaying"
        class="el-icon-video-play"
        style="font-size: 0.3rem; color: #222; margin: 15px; cursor: pointer"
        @click="toggle()"
      />
      <i
        v-show="isPlaying"
        class="el-icon-video-pause"
        style="font-size: 0.3rem; color: #222; margin: 15px; cursor: pointer"
        @click="toggle()"
      />
      <el-slider v-model="percent" :show-tooltip="false" :max="max" :marks="marks" @change="handleChange" />
      <span style="color: #222; margin: 10px">{{ position }}</span>
      <span style="color: #222">/</span>
      <span style="color: #222; margin: 10px">{{ duration }}</span>
    </div>
  </div>
</template>

<script>
import * as Guacamole from './guacamole/dist/guacamole-common';
import { getNodeDetail } from '@/api/match_management/replay_show';

export default {
  props: {
    content: {
      required: true,
    },
    matchPlot: {
      required: true,
    },
    /**
     * 在四宫格情况下根据indexs区分组件位置
     */
    indexs: {
      type: Number,
    },
    /**
     * 显示团队名称
     */
    name: {
      type: String,
      required: true,
    },
    /**
     * 显示用户昵称
     */
    userName: {
      type: String,
      required: true,
    },
    /**
     * 组件标识id
     */
    id: {
      type: Number,
      required: true,
    },
    /**
     * 播放视频地址
     */
    src: {
      type: String,
      required: true,
    },
    isBigScreen: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      pointList: [],
      marks: {},
      recording: null, // recording播放主体
      recordingDisplay: null, // recording包裹元素
      screenRef: null, // 视频包裹元素
      displayRef: null, // 绘制包裹元素
      isPlaying: false, // 是否在播放中
      percent: 0, // 进度
      max: 100, // 最大值
      duration: '00:00', // 播放时长
      position: '00:00', // 播放位置
      tunnel: null, // 调用http主体
      timer: null, // 定义时间戳
      fileSize: null, // 文件大小
    };
  },
  watch: {
    isBigScreen: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.$nextTick(() => {
          this.onWindowResize();
        });
      },
    },
  },
  mounted() {
    this.getNodeDetail();
    this.$nextTick(() => {
      this.init(this.src);
    });
    window.addEventListener('resize', this.onWindowResize);
  },
  methods: {
    /**
     * 获取视频点位信息
     */
    getNodeDetail() {
      getNodeDetail(this.matchPlot, this.id).then(res => {
        const data = res.data;
        this.pointList = data.point_list;
        this.getNodes();
      });
    },
    getNodes() {
      if (this.pointList.length == 0) {
        this.marks = {};
      } else {
        const obj = {};
        for (const i in this.pointList) {
          obj[this.pointList[i].time * 1000] = '';
        }
        this.marks = obj;
        setTimeout(() => {
          this.$nextTick(() => {
            const nodeArr = document.getElementsByClassName('el-slider__marks-stop');
            console.log(nodeArr);
            for (const i in this.pointList) {
              nodeArr[i].title = this.pointList[i].attack_info;
            }
          });
        }, 1000);
      }
    },
    onWindowResize() {
      if (this.recordingDisplay) {
        this.recordingDisplay.onresize(this.recordingDisplay.getWidth(), this.recordingDisplay.getHeight());
      }
    },
    /**
     * byte转换数据大小
     */
    getfilesize(size) {
      if (!size) {
        return '';
      }
      var num = 1024.0; // byte

      if (size < num) {
        return size + 'B';
      }
      if (size < Math.pow(num, 2)) {
        return (size / num).toFixed(2) + 'K';
      } // kb
      if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(2) + 'M';
      } // M
      if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(2) + 'G';
      } // G
      return (size / Math.pow(num, 4)).toFixed(2) + 'T'; // T
    },
    /**
     * 初始化绘制视频
     */
    init(src) {
      this.displayRef = document.getElementById('display-' + this.content); // 确定绘制包裹元素
      this.screenRef = document.getElementById('screen-' + this.content); // 确定视频包裹元素
      this.tunnel = new Guacamole.StaticHTTPTunnel(src); // 确定调用http主体
      this.recording = new Guacamole.SessionRecording(this.tunnel); // 确定recording播放主体
      this.recordingDisplay = this.recording.getDisplay(); // 确定recording包裹元素
      const recordingElement = this.recordingDisplay.getElement(); // 获取recording元素
      recordingElement.style.margin = '0 auto';
      if (this.timer) {
        // 有时间戳的前提清除时间戳
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        // 设定时间戳通过调用getSize方法获取接口返回数据大小，获取后清除时间戳
        if (this.tunnel.getSize() != null) {
          this.fileSize = this.getfilesize(this.tunnel.getSize() * 1);
          clearInterval(this.timer);
        }
      }, 500);

      this.screenRef.appendChild(recordingElement); // 插入recording主体
      this.initRecording();
    },
    /**
     * 调整视频进度
     */
    handleChange(e) {
      this.recording.seek(e);
    },
    /**
     * 数据补0
     */
    zeroPad(num, minLength) {
      let str = num.toString();
      // Add leading zeroes until string is long enough
      while (str.length < minLength) {
        str = '0' + str;
      }
      return str;
    },
    /**
     * 格式化时间
     */
    formatTimeWithSeconds(seconds) {
      let hour = 0;
      let minute = 0;
      let second = 0;
      const ref = [3600, 60, 1]; // 定义时分秒
      for (let i = 0; i < ref.length; i++) {
        const val = ref[i];
        while (val <= seconds) {
          // 判断单位时间
          seconds -= val;
          switch (i) {
            case 0:
              hour++;
              break;
            case 1:
              minute++;
              break;
            case 2:
              second++;
              break;
          }
        }
      }
      return [hour, minute, second];
    },
    /**
     * 格式化视频时间
     */
    formatTime(millis) {
      const totalSeconds = millis / 1000;
      const [hour, minute, second] = this.formatTimeWithSeconds(totalSeconds);
      let time = this.zeroPad(minute, 2) + ':' + this.zeroPad(second, 2);
      if (hour > 0) {
        time = this.zeroPad(hour, 2) + ':' + time;
      }
      return time;
    },
    /**
     * 初始化recording主体
     */
    initRecording() {
      this.recording.connect('');
      this.recording.onplay = () => {
        // 监听播放状态
        this.isPlaying = true;
      };

      this.recording.onseek = millis => {
        // 监听进度状态
        this.position = this.formatTime(millis);
        this.percent = millis;
      };

      this.recording.onprogress = millis => {
        // 监听播放进度状态
        this.duration = this.formatTime(millis);
        this.max = millis;
        this.play();
      };
      // If paused, the play/pause button should read "Play"
      this.recording.onpause = () => {
        // 监听暂停状态
        this.isPlaying = false;
      };

      this.recordingDisplay.onresize = (width, height) => {
        // 监听主体大小变化
        // Do not scale if displayRef has no width
        if (!height) {
          return;
        }
        // Scale displayRef to fit width of container
        const widthScale = this.displayRef.offsetWidth / width;
        const heightScale = this.displayRef.offsetHeight / height;
        const minScale = widthScale < heightScale ? widthScale : heightScale;
        this.recordingDisplay.scale(minScale);
      };
    },
    play() {
      // 播放
      if (!this.recording.isPlaying()) {
        this.recording.play();
        this.isPlaying = true;
      }
    },
    toggle() {
      // 点击视频，判断播放/停止
      if (this.percent == this.max) {
        this.percent = 0;
        this.recording.seek(this.percent);
      } else {
        if (!this.recording.isPlaying()) {
          this.play();
        } else {
          this.pause();
        }
      }
    },
    pause() {
      // 暂停
      if (this.recording.isPlaying()) {
        this.recording.pause();
        this.isPlaying = false;
      }
    },
  },
};
</script>

<style lang="scss">
.gua-play-page {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgb(27, 27, 27);
  .box-content-bottom {
    width: 100%;
    height: 8%;
    background: #ccc;
    display: flex;
    align-items: center;
  }
  .el-slider__stop {
    background: #222;
  }
  .box-content-top {
    width: 100%;
    // position: absolute;
    // top: -40px;
    height: 7%;
    background: #2db6f4;
    display: flex;
    align-items: center;
    .iconClose {
      position: absolute;
      right: 10px;
      cursor: pointer;
    }
  }
  .el-slider {
    width: 70%;
  }
}
</style>
