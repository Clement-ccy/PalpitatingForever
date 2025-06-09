<script setup>
defineOptions({
  name: 'BlogPagination'
})
import { computed } from 'vue'
import TransitionLink from '@/components/common/TransitionLink.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  basePath: {
    type: String,
    default: '/blog'
  },
  showPageNumbers: {
    type: Number,
    default: 7
  }
})

const emit = defineEmits(['page-change'])

// 计算显示的页码
const pageNumbers = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage
  const show = props.showPageNumbers
  
  if (total <= show) {
    // 总页数小于等于显示数量，显示全部
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于显示数量，需要省略
    const half = Math.floor(show / 2)
    let start = Math.max(1, current - half)
    let end = Math.min(total, current + half)
    
    // 调整边界
    if (end - start < show - 1) {
      if (start === 1) {
        end = Math.min(total, start + show - 1)
      } else {
        start = Math.max(1, end - show + 1)
      }
    }
    
    // 添加页码
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // 添加省略号和边界页码
    if (start > 1) {
      if (start > 2) {
        pages.unshift('...')
      }
      pages.unshift(1)
    }
    
    if (end < total) {
      if (end < total - 1) {
        pages.push('...')
      }
      pages.push(total)
    }
  }
  
  return pages
})

// 是否有上一页
const hasPrev = computed(() => props.currentPage > 1)

// 是否有下一页
const hasNext = computed(() => props.currentPage < props.totalPages)

// 生成页面链接
const getPageUrl = (page) => {
  if (page === 1) {
    return props.basePath
  }
  return `${props.basePath}?page=${page}`
}

// 处理页面跳转
const handlePageClick = (page) => {
  if (page !== props.currentPage && typeof page === 'number') {
    emit('page-change', page)
  }
}
</script>

<template>
  <nav class="pagination-nav" v-if="totalPages > 1">
    <div class="pagination">
      <!-- 上一页 -->
      <TransitionLink 
        v-if="hasPrev"
        :to="getPageUrl(currentPage - 1)"
        class="page-nav prev"
        @click="handlePageClick(currentPage - 1)"
      >
        <i class="icon-arrow-left"></i>
        <div class="pagination-tips">上页</div>
      </TransitionLink>
      
      <!-- 页码 -->
      <template v-for="page in pageNumbers" :key="page">
        <span 
          v-if="page === '...'"
          class="page-ellipsis"
        >
          …
        </span>
        <TransitionLink
          v-else-if="page !== currentPage"
          :to="getPageUrl(page)"
          class="page-number"
          @click="handlePageClick(page)"
        >
          {{ page }}
        </TransitionLink>
        <span 
          v-else
          class="page-number current"
        >
          {{ page }}
        </span>
      </template>
      
      <!-- 下一页 -->
      <TransitionLink 
        v-if="hasNext"
        :to="getPageUrl(currentPage + 1)"
        class="page-nav next"
        @click="handlePageClick(currentPage + 1)"
      >
        <div class="pagination-tips">下页</div>
        <i class="icon-arrow-right"></i>
      </TransitionLink>
    </div>
    
    <!-- 页面信息 -->
    <div class="pagination-info">
      <span class="current-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.pagination-nav {
  margin: var(--space-xxl) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  
  @media (max-width: 768px) {
    margin: var(--space-xl) 0;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: var(--space-xs);
  }
}

.page-number,
.page-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 var(--space-sm);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-callout);
  font-weight: var(--font-weight-medium);
  transition: var(--global-transition);
  border: 1px solid transparent;
  
  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: var(--font-size-subhead);
  }
  
  &:hover:not(.current) {
    color: var(--accent-primary);
    background: var(--accent-hover);
    border-color: var(--separator-secondary);
    transform: translateY(-1px);
  }
  
  &.current {
    color: white;
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    cursor: default;
    box-shadow: var(--shadow-sm);
  }
}

.page-nav {
  gap: var(--space-xs);
  padding: 0 var(--space-md);
  font-weight: var(--font-weight-medium);
  
  @media (max-width: 768px) {
    padding: 0 var(--space-sm);
  }
  
  &.prev {
    margin-right: var(--space-sm);
    
    @media (max-width: 768px) {
      margin-right: var(--space-xs);
    }
  }
  
  &.next {
    margin-left: var(--space-sm);
    
    @media (max-width: 768px) {
      margin-left: var(--space-xs);
    }
  }
  
  .pagination-tips {
    font-size: var(--font-size-subhead);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-footnote);
    }
  }
  
  i {
    font-size: 14px;
    
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
}

.page-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: var(--text-tertiary);
  font-size: var(--font-size-callout);
  
  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: var(--font-size-subhead);
  }
}

.pagination-info {
  .current-info {
    color: var(--text-secondary);
    font-size: var(--font-size-subhead);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-footnote);
    }
  }
}

// 响应式优化 - 小屏幕简化显示
@media (max-width: 576px) {
  .pagination {
    .page-number:not(.current) {
      // 在小屏幕上隐藏大部分页码，只保留当前页和相邻页码
      &:not(:nth-child(-n+3)):not(:nth-last-child(-n+3)) {
        display: none;
      }
    }
    
    .page-ellipsis {
      display: none;
    }
  }
  
  .pagination-nav {
    .pagination-info {
      order: -1;
    }
  }
}

// 特殊状态样式
.pagination {
  // 当页数很少时居中对齐
  &:not(:has(.page-ellipsis)) {
    justify-content: center;
  }
}

// 加载状态
.pagination-nav.loading {
  opacity: 0.6;
  pointer-events: none;
}

// 无障碍访问
.page-number,
.page-nav {
  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
  
  &:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
}

// 暗色主题优化
[data-theme="dark"] {
  .page-number,
  .page-nav {
    &:hover:not(.current) {
      background: var(--fill-secondary);
    }
  }
}
</style>