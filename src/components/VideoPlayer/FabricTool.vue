<!--
 * @Author: kim yuhemei8088@163.com
 * @Date: 2024-11-23 15:31:13
 * @LastEditors: luyang<luyang@fengtaisec.com>
 * @LastEditTime: 2024-11-26 10:09:02
 * @Description: 
-->
<script setup lang="ts">
import * as fabric from 'fabric';
import { nextTick, onMounted, ref } from 'vue';
const canvasRef = ref(null);
const init = () => {
  // Do we need to use https://vuejs.org/api/reactivity-advanced.html#markraw?
  const canvas = new fabric.Canvas(canvasRef.value as any, {
    width: 500,
    height: 500,
  });

  const textValue = 'fabric.js sandbox';
  const text = new fabric.Textbox(textValue, {
    originX: 'center',
    splitByGrapheme: true,
    width: 200,
    top: 20,
    styles: fabric.util.stylesFromArray(
      [
        {
          style: {
            fontWeight: 'bold',
            fontSize: 64,
          },
          start: 0,
          end: 9,
        },
      ],
      textValue,
    ),
  });
  canvas.add(text);
  canvas.centerObjectH(text);
};
const textValue = ref('Hello Fabric');
const canvasRef = ref<HTMLCanvasElement>();
/** 对截图进行绘画 */
const loadImageOnCanvas = (imgUrl: string) => {
  const canvas = new fabric.Canvas(canvasRef.value);
  const text = new fabric.FabricText(textValue.value);
  const img = document.createElement('img');
  img.src = imgUrl; // 设置图片源为 Canvas 的 Base64 数据
  img.alt = 'Generated from Canvas';
  img.style.border = '1px solid gray';
  img.style.marginTop = '10px';
  nextTick(() => {
    const fabricImg = new fabric.FabricImage(img);
    canvas.add(fabricImg);
    canvas.centerObjectH(text);
  });
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
onMounted(() => {});
</script>
<template>
  <canvas ref="canvasRef"></canvas>
</template>
