<script setup>
import { computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import PageWrapper from '@/components/layout/PageWrapper.vue'
import TransitionLink from '@/components/common/TransitionLink.vue'

// 使用 blog store
const blogStore = useBlogStore()

// 页面头部信息
const headerInfo = {
  tips: '我持有了什么',
  title: '实物装备推荐（不一定是推荐）',
  description: '来了解 PalpitatingForever 看测评购物的装备吧！这些装备都是我个人使用过的，可能会有一些主观评价。'
}

// 从 store 获取装备分类数据
const gearsCategories = computed(() => blogStore.gearsCategories)
const isLoading = computed(() => blogStore.isLoading)
const error = computed(() => blogStore.error)

// 组件挂载时加载装备数据
onMounted(async () => {
  if (blogStore.rawGears.length === 0) {
    await blogStore.loadGearsData()
  }
})

// 复制装备名称
const copyEquipmentName = (name) => {
  navigator.clipboard.writeText(name).then(() => {
    // 这里可以添加复制成功的提示
    console.log(`已复制装备名称: ${name}`)
  }).catch(() => {
    console.error('复制失败')
  })
}

// 分享装备信息
const shareEquipment = (item) => {
  const text = `${item.name} ${item.specification} ${item.description}`
  navigator.clipboard.writeText(text).then(() => {
    console.log('已复制装备信息')
  }).catch(() => {
    console.error('复制失败')
  })
}
</script>

<template>
  <PageWrapper class="gear-page">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载装备数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="blogStore.loadGearsData()" class="retry-button">重试</button>
    </div>

    <!-- 正常内容 -->
    <template v-else>
      <!-- 页面头部 -->
      <div class="author-content author-content-item equipment single">
        <div class="card-content">
          <div class="author-content-item-tips">{{ headerInfo.tips }}</div>
          <span class="author-content-item-title">{{ headerInfo.title }}</span>
          <div class="content-bottom">
            <div class="tips">{{ headerInfo.description }}</div>
          </div>
        </div>
      </div>

      <!-- 装备列表 -->
      <div class="equipment" v-if="gearsCategories.length > 0">
        <div
          v-for="category in gearsCategories"
          :key="category.id"
          class="equipment-item"
        >
          <!-- 分类标题 -->
          <h2 class="equipment-item-title">{{ category.title }}</h2>
          <div class="equipment-item-description">{{ category.description }}</div>

          <!-- 装备项目 -->
          <div class="equipment-item-content">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="equipment-item-content-item"
            >
              <!-- 装备封面 -->
              <div class="equipment-item-content-item-cover">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="equipment-item-content-item-image"
                  loading="lazy"
                />
              </div>

              <!-- 装备信息 -->
              <div class="equipment-item-content-item-info">
                <!-- 装备名称 -->
                <div
                  class="equipment-item-content-item-name"
                  @click="copyEquipmentName(item.name)"
                  :title="`点击复制：${item.name}`"
                >
                  {{ item.name }}
                </div>

                <!-- 规格参数 -->
                <div class="equipment-item-content-item-specification">
                  {{ item.specification }}
                </div>

                <!-- 描述 -->
                <div class="equipment-item-content-item-description">
                  {{ item.description }}
                </div>

                <!-- 工具栏 -->
                <div class="equipment-item-content-item-toolbar" v-if="item.link && item.linkText">
                  <!-- 查看详情链接 -->
                  <TransitionLink
                    v-if="!item.external"
                    :to="item.link"
                    class="equipment-item-content-item-link"
                  >
                    {{ item.linkText }}
                  </TransitionLink>
                  <a
                    v-else
                    :href="item.link"
                    class="equipment-item-content-item-link"
                    target="_blank"
                    rel="external nofollow"
                  >
                    {{ item.linkText }}
                  </a>

                  <!-- 分享按钮 -->
                  <button
                    class="bber-reply"
                    @click="shareEquipment(item)"
                    :title="`分享${item.name}信息`"
                  >
                    <i class="icon-chat"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <p>暂无装备数据</p>
      </div>
    </template>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.gear-page {
  .page-content {
    max-width: 1200px;
    padding: var(--space-xl);
  }
}

// 页面头部
.author-content.equipment {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xxl);
  margin-bottom: var(--space-xxxl);
  text-align: center;
  box-shadow: var(--shadow-sm);
  
  .card-content {
    .author-content-item-tips {
      font-size: var(--font-size-caption1);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--space-sm);
    }
    
    .author-content-item-title {
      font-size: var(--font-size-large-title);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
      display: block;
    }
    
    .content-bottom {
      .tips {
        font-size: var(--font-size-headline);
        color: var(--text-secondary);
        line-height: var(--line-height-normal);
      }
    }
  }
}

// 装备列表
.equipment {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxxl);
}

.equipment-item {
  // 分类标题
  .equipment-item-title {
    font-size: var(--font-size-title1);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-md);
    border-bottom: 3px solid var(--accent-primary);
    padding-bottom: var(--space-sm);
    display: inline-block;
  }
  
  // 分类描述
  .equipment-item-description {
    font-size: var(--font-size-headline);
    color: var(--text-secondary);
    margin-bottom: var(--space-xl);
    line-height: var(--line-height-normal);
  }
}

// 装备内容网格
.equipment-item-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}

// 单个装备项目
.equipment-item-content-item {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--global-transition);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

// 装备封面
.equipment-item-content-item-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  
  .equipment-item-content-item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-duration-slow);
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

// 装备信息
.equipment-item-content-item-info {
  padding: var(--space-lg);
  
  // 装备名称
  .equipment-item-content-item-name {
    font-size: var(--font-size-headline);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
    cursor: pointer;
    transition: var(--global-transition);
    
    &:hover {
      color: var(--accent-primary);
    }
  }
  
  // 规格参数
  .equipment-item-content-item-specification {
    font-size: var(--font-size-subhead);
    color: var(--accent-primary);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-md);
    background: var(--accent-hover);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    display: inline-block;
  }
  
  // 描述文字
  .equipment-item-content-item-description {
    font-size: var(--font-size-body);
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-lg);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  // 工具栏
  .equipment-item-content-item-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    
    .equipment-item-content-item-link {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-sm) var(--space-md);
      background: var(--accent-primary);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-callout);
      font-weight: var(--font-weight-medium);
      transition: var(--global-transition);
      
      &:hover {
        background: var(--accent-secondary);
        transform: translateY(-1px);
      }
    }
    
    .bber-reply {
      width: 40px;
      height: 40px;
      background: var(--fill-secondary);
      border: none;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--global-transition);
      color: var(--text-secondary);
      
      &:hover {
        background: var(--accent-hover);
        color: var(--accent-primary);
        transform: translateY(-1px);
      }
      
      i {
        font-size: 16px;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .gear-page .page-content {
    padding: var(--space-lg) var(--space-md);
  }
  
  .author-content.equipment {
    padding: var(--space-xl);
    margin-bottom: var(--space-xl);
    
    .card-content {
      .author-content-item-title {
        font-size: var(--font-size-title1);
      }
      
      .content-bottom .tips {
        font-size: var(--font-size-callout);
      }
    }
  }
  
  .equipment {
    gap: var(--space-xl);
  }
  
  .equipment-item {
    .equipment-item-title {
      font-size: var(--font-size-headline);
    }
    
    .equipment-item-description {
      font-size: var(--font-size-callout);
      margin-bottom: var(--space-lg);
    }
  }
  
  .equipment-item-content-item-cover {
    height: 160px;
  }
  
  .equipment-item-content-item-info {
    padding: var(--space-md);
    
    .equipment-item-content-item-name {
      font-size: var(--font-size-callout);
    }
    
    .equipment-item-content-item-specification {
      font-size: var(--font-size-footnote);
    }
    
    .equipment-item-content-item-description {
      font-size: var(--font-size-subhead);
      -webkit-line-clamp: 4;
    }
    
    .equipment-item-content-item-toolbar {
      flex-direction: column;
      gap: var(--space-sm);
      
      .equipment-item-content-item-link {
        width: 100%;
      }
      
      .bber-reply {
        width: 100%;
        height: 36px;
      }
    }
  }
}

@media (max-width: 576px) {
  .gear-page .page-content {
    padding: var(--space-md) var(--space-sm);
  }
  
  .author-content.equipment {
    padding: var(--space-lg);
    
    .card-content {
      .author-content-item-title {
        font-size: var(--font-size-headline);
      }
      
      .content-bottom .tips {
        font-size: var(--font-size-subhead);
      }
    }
  }
  
  .equipment-item-content {
    gap: var(--space-md);
  }
  
  .equipment-item-content-item-cover {
    height: 140px;
  }
  
  .equipment-item-content-item-info {
    padding: var(--space-sm);
  }
}

// 加载动画
.equipment-item-content-item {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 分层动画延迟
.equipment-item:nth-child(1) .equipment-item-content-item {
  animation-delay: 0.1s;
}

.equipment-item:nth-child(2) .equipment-item-content-item {
  animation-delay: 0.2s;
}

.equipment-item:nth-child(3) .equipment-item-content-item {
  animation-delay: 0.3s;
}

.equipment-item:nth-child(4) .equipment-item-content-item {
  animation-delay: 0.4s;
}

// 暗色主题优化
[data-theme="dark"] {
  .equipment-item-content-item {
    background: var(--bg-secondary);
    
    &:hover {
      background: var(--bg-primary);
    }
  }
  
  .equipment-item-content-item-specification {
    background: rgba(var(--accent-primary-rgb), 0.2);
  }
}

// 无障碍访问
.equipment-item-content-item-name,
.bber-reply,
.equipment-item-content-item-link {
  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
  
  &:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
}

// 加载状态样式
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xxxl);
  color: var(--text-secondary);
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--bg-secondary);
    border-top: 3px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--space-lg);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 错误状态样式
.error-state {
  text-align: center;
  padding: var(--space-xxxl);
  color: var(--text-secondary);
  
  .retry-button {
    margin-top: var(--space-lg);
    padding: var(--space-sm) var(--space-lg);
    background: var(--accent-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--global-transition);
    
    &:hover {
      background: var(--accent-hover);
    }
  }
}

// 空状态样式
.empty-state {
  text-align: center;
  padding: var(--space-xxxl);
  color: var(--text-secondary);
}
</style>