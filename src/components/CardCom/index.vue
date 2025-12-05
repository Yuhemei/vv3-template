<template>
  <div class="card-page">
    <CardItem :swiper-data="cardData" :per-views="4">
      <template #caseItem="slotProps">
        <el-card class="item-box" @click="actionToTool(slotProps.item)">
          <div class="img-item">
            <el-image :src="urlPrefix + slotProps.item.image">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <p class="text-title">{{ slotProps.item.name }}</p>
          <p class="text-p" v-if="slotProps.item.desc">{{ slotProps.item.desc }}</p>
        </el-card>
      </template>
    </CardItem>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import CardItem from './CardItem.vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import { CardItemType } from '@/api/interface';

const urlPrefix = import.meta.env.VITE_APP_BASE_API;

defineProps({
  cardData: {
    type: Array as PropType<CardItemType[]>,
    default: () => [],
  },
});

const actionToTool = (row: CardItemType) => {
  if (!row.open_link) return;
  window.open(row.open_link, '_blank');
};
</script>

<style scoped lang="scss">
.card-page {
  padding-top: 80px;
  .item-box {
    border-radius: var(--el-card-border-radius);
    cursor: pointer;
  }
  .img-item {
    text-align: center;
    .el-image {
      width: 90%;
      aspect-ratio: 16/9;
    }
  }
  .text-p {
    text-align: center;
    width: 90%;
    margin: 0 auto;
    height: 60px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .text-title {
    text-align: center;
    font-size: 18px;
    line-height: 40px;
  }
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }
}
</style>
