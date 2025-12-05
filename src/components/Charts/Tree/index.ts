import { reactive, ref } from 'vue';
/** 标签节点 */
export const labelNodes = ref([]);
// 引用图片的写法
// import myImage from '@/assets/img/img.jpg';

export const option = reactive({
  tooltip: {
    // 提示框浮层设置
    trigger: 'item',
    triggerOn: 'mousemove', // 提示框触发条件
  },
  series: [
    {
      type: 'tree',
      data: [],
      nodePadding: 30, //结点间距 （发现没用）
      layerPadding: 10, //连接线长度 （发现没用）
      name: '树图',
      top: '5%', // 组件离容器上侧的距离，像素值20，或相对容器的百分比20%
      left: '1%', // 组件离容器左侧的距离
      bottom: '10%', // 组件离容器下侧的距离
      right: '1%', // 组件离容器右侧的距离
      layout: 'orthogonal', // 树图的布局，正交orthogonal和径向radial两种
      orient: 'TB', // 树图中正交布局的方向，'LR','RL','TB','BT'，只有布局是正交时才生效
      // edgeShape: 'polyline', // 树图边的形状，有曲线curve和折线polyline两种，只有正交布局下生效
      zoom: 1, //当前视角的缩放比例
      roam: true, //是否开启平游或缩放  // 是否开启鼠标缩放或平移，默认false
      scaleLimit: {
        //滚轮缩放的极限控制
        min: 0.5,
        max: 5,
      },
      initialTreeDepth: undefined, // 树图初始的展开层级（深度），根节点是0，不设置时全部展开
      // symbol: 'circle', // 标记的图形，默认是 emptyCircle ; circle, rect, roundRect, triangle, diamond, pin, arrow, none
      symbol: function (value: any, params: any) {
        // params.data节点的所有数据
        if (labelNodes.value.includes(params.data.name)) {
          return 'circle';
          // return 'image://' + myImage;
        } else {
          return 'none';
        }
      },
      // symbolRotate: 270, // 配合arrow图形使用效果较好
      symbolSize: 16, // 大于0时是圆圈，等于0时不展示，标记的大小
      itemStyle: {
        // 树图中每个节点的样式
        color: '#fff', // 节点未展开时的填充色
        // borderWidth: 1, // 描边线宽，为0时无描边
        // borderType: 'dotted', // 描边类型
        borderCap: 'round', // 指定线段末端的绘制方式butt方形结束，round圆形结束，square
        // shadowColor: 'rgba(0,121,221,0.3)', // 阴影颜色
        // shadowBlur: 16, // 图形阴影的模糊大小
        // opacity: 1 // 图形透明度
      },
      label: {
        // 每个节点对应的文本标签样式
        show: true, // 是否显示标签
        distance: 8, // 文本距离图形元素的距离
        // position: ['50%', '50%'], // 标签位置
        verticalAlign: 'middle', // 文字垂直对齐方式，默认自动，top，middle，bottom
        align: 'center', // 文字水平对齐方式，默认自动，left，right，center
        fontSize: 12, // 字体大小
        color: '#fff', // 字体颜色
        // color: 'red', // 字体颜色
        // backgroundColor: '#213565', // 文字块的背景颜色
        // borderColor: '#13132D', // 文字块边框颜色
        // borderWidth: 1, // 文字块边框宽度
        borderType: 'solid', // 文字块边框描边类型 solid dashed dotted
        borderRadius: 2, // 文字块的圆角
        padding: [6, 12], // 文字块内边距
        shadowColor: 'rgba(0,121,221,0)', // 文字块的背景阴影颜色
        shadowBlur: 6, // 文字块的背景阴影长度
        // height: 130,
        // width: 12,
        // rotate: -90,
        // 文字超出宽度是否截断或者换行；只有配置width时有效
        // overflow: 'truncate', // truncate截断，并在末尾显示ellipsis配置的文本，默认为...;break换行;breakAll换行，并强制单词内换行
        // ellipsis: '...',
        formatter: params => {
          // console.log(params.data.name);
          let newName = '';
          let len = params.data.name ? params.data.name.length : 0;
          // let strLen = params.data.relationType === 0 ? 100 : 1; //一行显示几个字
          let strLen = 10;
          let rowNum = Math.ceil(len / strLen);
          if (len > strLen) {
            for (let p = 0; p < rowNum; p++) {
              let tempStr = '';
              let start = p * strLen;
              let end = start + strLen;
              if (p == rowNum - 1) {
                tempStr = params.data.name.substring(start, len);
              } else {
                tempStr = params.data.name.substring(start, end) + '\n';
              }
              newName += tempStr;
            }
          } else {
            newName = params.data.name;
          }
          let n = newName;
          if (n && n.length > 16) {
            n = n.slice(0, 16) + '...';
          }
          // const str = labelNodes.includes(params.data.name) ? '' : `{name|${n}}`;
          const str = `{name|${n}}`;
          return str;
        },
        rich: {
          name: {
            fontSize: 12,
          },
          // current: {
          //   fontSize: 12,
          //   padding: 0,
          //   color: '#07CA42',
          //   fontWeight: 600,
          //   backgroundColor: '#E5F7EA',
          //   borderRadius: 2,
          // },
          // main: {
          //   color: '#0780ED',
          //   fontSize: 12,
          //   padding: 0,
          //   fontWeight: 600,
          //   backgroundColor: '#E6F2FD',
          //   borderRadius: 2,
          // },
        },
      },

      labelLayout: {
        // dy: -16,
        verticalAlign: 'top',
      },
      lineStyle: {
        // 树图边的样式
        // color: 'rgba(0,0,0,.35)', // 树图边的颜色
        width: 1, // 树图边的宽度
        // curveness: 1, // 树图边的曲度
        shadowColor: 'rgba(0, 0, 0, 0.5)', // 阴影颜色
        // shadowBlur: 10 // 图形阴影的模糊大小
      },
      blur: {
        // 淡出状态的相关配置，开启emphasis.focus后有效
        itemStyle: {}, // 节点的样式
        lineStyle: {}, // 树图边的样式
        label: {}, // 淡出标签的文本样式
      },
      leaves: {
        // 叶子节点的特殊配置
        label: {
          // 叶子节点的文本标签样式
          distance: 0,
          position: 'bottom',
          verticalAlign: 'middle',
        },
        itemStyle: {}, // 叶子节点的样式
        emphasis: {}, // 叶子节点高亮状态的配置
        blur: {}, // 叶子节点淡出状态的配置
        select: {}, // 叶子节点选中状态的配置
      },
      animation: true, // 是否开启动画
      expandAndCollapse: true, // 子树折叠和展开的交互，默认打开
      animationDuration: 550, // 初始动画的时长
      animationEasing: 'linear', // 初始动画的缓动效果
      animationDelay: 0, // 初始动画的延迟
      animationDurationUpdate: 750, // 数据更新动画的时长
      animationEasingUpdate: 'cubicInOut', // 数据更新动画的缓动效果
      animationDelayUpdate: 0, // 数据更新动画的延迟
    },
  ],
});

/** 需要变为连接点的 name */
export const labelNodesData = ['基础技能', '中级技能', '高级技能'];

/** 遍历数节点 设置不同样式 */
export const modifyNodeStyle = (nodeData: any, labelNodes: any) => {
  let nodes = nodeData;
  if (labelNodes.includes(nodes.name)) {
    nodes.label = {
      position: ['220%', '-30%'],
      backgroundColor: '',
    };
  } else {
    nodes.label = {
      position: ['50%', '50%'],
      backgroundColor: '#213565',
      borderColor: '#13132D', // 文字块边框颜色
      borderWidth: 1, // 文字块边框宽度
      // backgroundColor: {
      //   image: myImage,
      //   repeat: "no-repeat",
      //   // 这里可以是图片的 URL，
      //   // 或者图片的 dataURI，
      //   // 或者 HTMLImageElement 对象，
      //   // 或者 HTMLCanvasElement 对象。
      // },
    };
  }
  if (nodes.children && nodes.children.length) {
    for (let i = 0; i < nodes.children.length; i++) {
      // console.log(nodes.children[i].relationType);
      modifyNodeStyle(nodes.children[i], labelNodes);
    }
  }
  return nodes;
};

/** 测试数据 : 节点必须有 name , children 可以为空 */
export const chartData = {
  name: '信息与计算科学',
  children: [
    {
      children: [
        {
          name: '基础技能',
          colorTag: 0,
          children: [
            {
              name: '高等数学',
              colorTag: 0,
            },
          ],
        },
        {
          name: '中级技能',
          colorTag: 0,
          children: [
            {
              name: '线性代数',
              colorTag: 0,
            },
          ],
        },
        {
          name: '高级技能',
          colorTag: 0,
          children: [
            {
              name: '概率论',
              colorTag: 0,
            },
          ],
        },
      ],
      name: '数学分析',
    },
    {
      name: '解析几何',
    },
  ],
};
