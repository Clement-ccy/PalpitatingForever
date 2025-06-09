<template>
  <footer class="the-footer" :class="footerClasses">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 版权信息 -->
        <div class="footer-section footer-copyright">
          <p class="copyright-text">
            &copy; {{ currentYear }} PalpitatingForever. All rights reserved.
          </p>
        </div>
        
        <!-- 社交链接 -->
        <div class="footer-section footer-social">
          <div class="social-links">
            <a 
              v-for="link in socialLinks" 
              :key="link.name"
              :href="link.url" 
              :title="link.title"
              class="social-link" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="social-icon">{{ link.icon }}</span>
              <span class="social-label">{{ link.label }}</span>
            </a>
          </div>
        </div>
        
        <!-- 技术信息 -->
        <div class="footer-section footer-tech">
          <p class="tech-text">
            Made with 
            <span class="tech-highlight">Vue 3</span> + 
            <span class="tech-highlight">Notion</span>
          </p>
        </div>
      </div>
      
      <!-- 额外信息（可选） -->
      <div class="footer-extra" v-if="showExtraInfo">
        <div class="footer-links">
          <router-link to="/blog/about" class="footer-link">About</router-link>
          <router-link to="/blog/links" class="footer-link">Links</router-link>
          <span class="footer-divider">•</span>
          <a href="#" class="footer-link" @click.prevent="scrollToTop">Back to Top</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 当前年份
const currentYear = new Date().getFullYear()

// Props
const props = defineProps({
  // 是否显示额外信息
  showExtraInfo: {
    type: Boolean,
    default: true
  },
  // 是否在某些页面隐藏页脚
  hideOnPages: {
    type: Array,
    default: () => ['BlogAll', 'PlogAll', 'PlogIndex']
  }
})

// 社交链接配置
const socialLinks = ref([
  {
    name: 'github',
    label: 'GitHub',
    icon: '⚡',
    url: 'https://github.com/PalpitatingForever',
    title: 'Follow me on GitHub'
  },
  {
    name: 'email',
    label: 'Email',
    icon: '✉️',
    url: 'mailto:contact@palpitatingforever.com',
    title: 'Send me an email'
  },
  {
    name: 'rss',
    label: 'RSS',
    icon: '📡',
    url: '/rss.xml',
    title: 'Subscribe to RSS feed'
  }
])

// 页脚样式类
const footerClasses = computed(() => {
  const classes = []
  
  // 根据当前路由添加特定类名
  if (route.name) {
    classes.push(`footer-${route.name.toLowerCase()}`)
  }
  
  // 检查是否应该隐藏页脚
  if (props.hideOnPages.includes(route.name)) {
    classes.push('the-footer--hidden')
  }
  
  return classes
})

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 生命周期
onMounted(() => {
  // 可以在这里添加一些初始化逻辑
})
</script>

<style lang="scss" scoped>
.the-footer {
  position: relative;
  z-index: var(--z-index-base);
  
  background: var(--bg-tertiary);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  
  border-top: 1px solid var(--separator-primary);
  
  // 隐藏状态
  &--hidden {
    display: none;
  }
}

.footer-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--space-xl);
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    text-align: center;
  }
}

.footer-section {
  // 页脚区块基础样式
}

// 版权信息
.footer-copyright {
  justify-self: start;
  
  @media (max-width: 768px) {
    justify-self: center;
    order: 3;
  }
}

.copyright-text {
  margin: 0;
  font-size: var(--font-size-footnote);
  color: var(--text-tertiary);
}

// 社交链接
.footer-social {
  justify-self: center;
  
  @media (max-width: 768px) {
    order: 1;
  }
}

.social-links {
  display: flex;
  gap: var(--space-lg);
  
  @media (max-width: 576px) {
    gap: var(--space-md);
  }
}

.social-link {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-footnote);
  font-weight: var(--font-weight-medium);
  
  border-radius: var(--radius-md);
  transition: all var(--transition-duration-fast);
  
  &:hover {
    color: var(--accent-primary);
    background: var(--accent-hover);
    transform: translateY(-1px);
  }
  
  @media (max-width: 576px) {
    .social-label {
      display: none;
    }
  }
}

.social-icon {
  font-size: 16px;
  line-height: 1;
}

.social-label {
  font-size: var(--font-size-caption1);
}

// 技术信息
.footer-tech {
  justify-self: end;
  
  @media (max-width: 768px) {
    justify-self: center;
    order: 2;
  }
}

.tech-text {
  margin: 0;
  font-size: var(--font-size-footnote);
  color: var(--text-tertiary);
}

.tech-highlight {
  color: var(--accent-primary);
  font-weight: var(--font-weight-medium);
}

// 额外信息
.footer-extra {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--separator-secondary);
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-caption1);
  font-weight: var(--font-weight-medium);
  
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-duration-fast);
  
  &:hover {
    color: var(--accent-primary);
    background: var(--accent-hover);
  }
}

.footer-divider {
  color: var(--text-tertiary);
  font-size: var(--font-size-caption1);
}

// 页面特定样式
.footer-home {
  // 首页页脚特殊样式
  background: var(--bg-secondary);
}

.footer-blogpostdetail,
.footer-plogitemdetail,
.footer-mlogalbumdetail {
  // 详情页面页脚样式
  margin-top: var(--space-xxxxl);
}

// 响应式优化
@media (max-width: 576px) {
  .footer-content {
    gap: var(--space-md);
  }
  
  .footer-extra {
    margin-top: var(--space-md);
    padding-top: var(--space-md);
  }
  
  .footer-links {
    gap: var(--space-sm);
  }
}
</style>