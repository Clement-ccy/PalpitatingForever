<script setup>
import { reactive, ref } from "vue";
import PageWrapper from "@/components/layout/PageWrapper.vue";
import TransitionLink from "@/components/common/TransitionLink.vue";

// 复制成功提示
const showCopySuccess = ref(false);
const copySuccessMessage = ref('');

// 友链数据
const linksData = reactive({
  // 页面头部信息
  header: {
    tips: "互联网好友",
    title: "友情链接推荐",
    description:
      "这里汇集了我在互联网上认识的优秀朋友们，他们都有着非常不错的内容输出。每一个链接都值得你去探索和发现。",
  },

  // 友链分类
  categories: [
    {
      id: "tech-blogs",
      title: "技术博客",
      description: "专注于技术分享和编程开发的优质博客",
      items: [
        {
          name: "Vue.js",
          url: "https://vuejs.org",
          avatar: "/src/assets/images/PF.png",
          description: "渐进式 JavaScript 框架，用于构建用户界面",
          tags: ["前端", "JavaScript", "Framework"],
          status: "active",
        },
        {
          name: "GitHub",
          url: "https://github.com",
          avatar: "/src/assets/images/PF.png",
          description: "全球最大的代码托管平台和开发者社区",
          tags: ["开发", "代码托管", "开源"],
          status: "active",
        },
        {
          name: "MDN Web Docs",
          url: "https://developer.mozilla.org",
          avatar: "/src/assets/images/PF.png",
          description: "Web 开发者最权威的技术文档和学习资源",
          tags: ["文档", "Web", "教程"],
          status: "active",
        },
        {
          name: "Stack Overflow",
          url: "https://stackoverflow.com",
          avatar: "/src/assets/images/PF.png",
          description: "程序员问答社区，解决编程问题的最佳去处",
          tags: ["问答", "编程", "社区"],
          status: "active",
        },
      ],
    },
    {
      id: "design-resources",
      title: "设计资源",
      description: "优秀的设计师博客和设计资源网站",
      items: [
        {
          name: "Dribbble",
          url: "https://dribbble.com",
          avatar: "/src/assets/images/PF.png",
          description: "全球设计师作品展示和灵感分享平台",
          tags: ["设计", "作品集", "灵感"],
          status: "active",
        },
        {
          name: "Behance",
          url: "https://behance.net",
          avatar: "/src/assets/images/PF.png",
          description: "Adobe 旗下创意作品展示平台",
          tags: ["创意", "作品", "设计师"],
          status: "active",
        },
        {
          name: "Figma",
          url: "https://figma.com",
          avatar: "/src/assets/images/PF.png",
          description: "协作式界面设计工具，团队设计的首选",
          tags: ["UI设计", "协作", "工具"],
          status: "active",
        },
      ],
    },
    {
      id: "personal-blogs",
      title: "个人博客",
      description: "朋友们的个人博客，记录生活与思考",
      items: [
        {
          name: "阮一峰的网络日志",
          url: "https://ruanyifeng.com",
          avatar: "/src/assets/images/PF.png",
          description: "知名技术博主，《ES6 标准入门》作者",
          tags: ["技术", "教程", "思考"],
          status: "active",
        },
        {
          name: "廖雪峰的官方网站",
          url: "https://liaoxuefeng.com",
          avatar: "/src/assets/images/PF.png",
          description: "专注于IT技术教学的个人网站",
          tags: ["教程", "Python", "JavaScript"],
          status: "active",
        },
      ],
    },
    {
      id: "tools-services",
      title: "实用工具",
      description: "日常开发和生活中常用的在线工具",
      items: [
        {
          name: "Can I Use",
          url: "https://caniuse.com",
          avatar: "/src/assets/images/PF.png",
          description: "查询浏览器对各种Web特性的支持情况",
          tags: ["工具", "兼容性", "查询"],
          status: "active",
        },
        {
          name: "JSON Formatter",
          url: "https://jsonformatter.org",
          avatar: "/src/assets/images/PF.png",
          description: "在线JSON格式化和验证工具",
          tags: ["JSON", "格式化", "在线工具"],
          status: "active",
        },
        {
          name: "RegExr",
          url: "https://regexr.com",
          avatar: "/src/assets/images/PF.png",
          description: "在线正则表达式学习、构建和测试工具",
          tags: ["正则", "测试", "学习"],
          status: "active",
        },
      ],
    },
    {
      id: "inspiration",
      title: "灵感启发",
      description: "激发创意思维和提供灵感的优质内容",
      items: [
        {
          name: "TED",
          url: "https://ted.com",
          avatar: "/src/assets/images/PF.png",
          description: "汇聚世界顶尖思想家的演讲平台",
          tags: ["演讲", "思想", "启发"],
          status: "active",
        },
        {
          name: "Medium",
          url: "https://medium.com",
          avatar: "/src/assets/images/PF.png",
          description: "高质量的写作和阅读社区平台",
          tags: ["写作", "阅读", "思考"],
          status: "active",
        },
      ],
    },
  ],

  // 友链申请信息
  application: {
    title: "友链申请",
    description: "欢迎志同道合的朋友申请友情链接！",
    requirements: [
      "内容积极向上，无违法违规内容",
      "网站可以正常访问，加载速度适中",
      "定期更新内容，保持网站活跃",
      "优先考虑原创内容的个人博客",
    ],
    contact: {
      email: "admin@example.com",
      qq: "123456789",
      wechat: "example_wechat",
    },
  },
});

// 复制链接地址
const copyLink = (url) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      copySuccessMessage.value = '链接已复制到剪贴板';
      showCopySuccess.value = true;
      setTimeout(() => {
        showCopySuccess.value = false;
      }, 2000);
    })
    .catch(() => {
      copySuccessMessage.value = '复制失败，请手动复制';
      showCopySuccess.value = true;
      setTimeout(() => {
        showCopySuccess.value = false;
      }, 2000);
    });
};

// 访问链接
const visitLink = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

// 检查链接状态
const checkLinkStatus = (item) => {
  // 这里可以实现链接状态检查逻辑
  return item.status === "active";
};

// 获取状态显示文本
const getStatusText = (status) => {
  const statusMap = {
    active: "正常",
    inactive: "失效",
    slow: "较慢",
    checking: "检测中",
  };
  return statusMap[status] || "未知";
};

// 获取状态颜色类
const getStatusClass = (status) => {
  const classMap = {
    active: "status-active",
    inactive: "status-inactive",
    slow: "status-slow",
    checking: "status-checking",
  };
  return classMap[status] || "status-unknown";
};
</script>

<template>
  <PageWrapper class="links-page">
    <!-- 页面头部 -->
    <div class="links-header">
      <div class="links-header-tips">{{ linksData.header.tips }}</div>
      <h1 class="links-header-title">{{ linksData.header.title }}</h1>
      <div class="links-header-description">{{ linksData.header.description }}</div>
    </div>

    <!-- 友链分类 -->
    <div class="links-container">
      <div
        v-for="category in linksData.categories"
        :key="category.id"
        class="links-category"
      >
        <!-- 分类标题 -->
        <div class="links-category-header">
          <h2 class="links-category-title">{{ category.title }}</h2>
          <div class="links-category-description">{{ category.description }}</div>
        </div>

        <!-- 友链项目 -->
        <div class="links-grid">
          <div
            v-for="item in category.items"
            :key="item.name"
            class="link-card"
            :class="{ 'link-inactive': !checkLinkStatus(item) }"
          >
            <!-- 头像 -->
            <div class="link-avatar">
              <img
                :src="item.avatar"
                :alt="`${item.name} 头像`"
                class="avatar-image"
                loading="lazy"
                @error="
                  $event.target.src = '/src/assets/images/PF.png'
                "
              />
              <div
                class="link-status"
                :class="getStatusClass(item.status)"
                :title="`状态: ${getStatusText(item.status)}`"
              ></div>
            </div>

            <!-- 链接信息 -->
            <div class="link-info">
              <!-- 网站名称 -->
              <div class="link-name" :title="item.name">
                {{ item.name }}
              </div>

              <!-- 描述 -->
              <div class="link-description" :title="item.description">
                {{ item.description }}
              </div>

              <!-- 标签 -->
              <div class="link-tags">
                <span v-for="tag in item.tags" :key="tag" class="link-tag">
                  {{ tag }}
                </span>
              </div>

              <!-- 操作栏 -->
              <div class="link-actions">
                <button
                  class="link-action-btn visit-btn"
                  @click="visitLink(item.url)"
                  :title="`访问 ${item.name}`"
                >
                  <span class="btn-icon">🔗</span>
                  访问
                </button>
                <button
                  class="link-action-btn copy-btn"
                  @click="copyLink(item.url)"
                  :title="`复制 ${item.name} 链接`"
                >
                  <span class="btn-icon">📋</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 友链申请 -->
    <div class="link-application">
      <div class="application-card">
        <div class="application-header">
          <div class="application-tips">申请合作</div>
          <h2 class="application-title">{{ linksData.application.title }}</h2>
          <div class="application-description">
            {{ linksData.application.description }}
          </div>
        </div>

        <div class="application-content">
          <!-- 申请要求 -->
          <div class="application-requirements">
            <h3>申请要求</h3>
            <ul>
              <li
                v-for="requirement in linksData.application.requirements"
                :key="requirement"
              >
                {{ requirement }}
              </li>
            </ul>
          </div>

          <!-- 联系方式 -->
          <div class="application-contact">
            <h3>联系方式</h3>
            <div class="contact-methods">
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span class="contact-label">邮箱：</span>
                <span class="contact-value">{{ linksData.application.contact.email }}</span>
                <button
                  class="copy-contact-btn"
                  @click="copyLink(linksData.application.contact.email)"
                  title="复制邮箱地址"
                >
                  📋
                </button>
              </div>
              <div class="contact-item">
                <span class="contact-icon">💬</span>
                <span class="contact-label">QQ：</span>
                <span class="contact-value">{{ linksData.application.contact.qq }}</span>
                <button
                  class="copy-contact-btn"
                  @click="copyLink(linksData.application.contact.qq)"
                  title="复制QQ号码"
                >
                  📋
                </button>
              </div>
              <div class="contact-item">
                <span class="contact-icon">💚</span>
                <span class="contact-label">微信：</span>
                <span class="contact-value">{{ linksData.application.contact.wechat }}</span>
                <button
                  class="copy-contact-btn"
                  @click="copyLink(linksData.application.contact.wechat)"
                  title="复制微信号"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 复制成功提示 -->
    <Transition name="toast">
      <div v-if="showCopySuccess" class="copy-toast">
        <span class="toast-icon">✅</span>
        <span class="toast-message">{{ copySuccessMessage }}</span>
      </div>
    </Transition>
  </PageWrapper>
</template>

<style scoped lang="scss">
.links-page {
  .page-content {
    max-width: 1200px;
    padding: var(--space-xl);
  }
}

// 页面头部
.links-header {
  text-align: center;
  margin-bottom: var(--space-xxxxl);
  
  .links-header-tips {
    font-size: var(--font-size-caption1);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: var(--space-sm);
  }
  
  .links-header-title {
    font-size: var(--font-size-large-title);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-lg);
  }
  
  .links-header-description {
    font-size: var(--font-size-body);
    color: var(--text-secondary);
    line-height: var(--line-height-loose);
    max-width: 600px;
    margin: 0 auto;
  }
}

// 友链容器
.links-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxxxl);
  margin-bottom: var(--space-xxxxl);
}

.links-category {
  .links-category-header {
    margin-bottom: var(--space-xxl);
    
    .links-category-title {
      font-size: var(--font-size-title1);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }
    
    .links-category-description {
      font-size: var(--font-size-callout);
      color: var(--text-secondary);
      line-height: var(--line-height-normal);
    }
  }
}

// 友链网格
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}

// 友链卡片
.link-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--separator-secondary);
  transition: var(--global-transition);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    opacity: 0;
    transition: var(--global-transition);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
    
    &::before {
      opacity: 1;
    }
  }
  
  &.link-inactive {
    opacity: 0.6;
    
    .link-status {
      background: var(--color-error);
    }
  }
}

// 头像区域
.link-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: var(--space-lg);
  
  .avatar-image {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-md);
    object-fit: cover;
    transition: var(--global-transition);
  }
  
  .link-status {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    border: 2px solid var(--bg-primary);
    
    &.status-active {
      background: var(--color-success);
    }
    
    &.status-inactive {
      background: var(--color-error);
    }
    
    &.status-slow {
      background: var(--color-warning);
    }
    
    &.status-checking {
      background: var(--color-info);
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 链接信息
.link-info {
  .link-name {
    font-size: var(--font-size-headline);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .link-description {
    font-size: var(--font-size-subhead);
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-md);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// 标签
.link-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
  
  .link-tag {
    font-size: var(--font-size-caption1);
    color: var(--accent-primary);
    background: var(--accent-hover);
    padding: var(--space-xxs) var(--space-sm);
    border-radius: var(--radius-sm);
    border: 1px solid var(--accent-primary);
    opacity: 0.8;
    transition: var(--global-transition);
    
    &:hover {
      opacity: 1;
      background: var(--accent-active);
    }
  }
}

// 操作按钮
.link-actions {
  display: flex;
  gap: var(--space-sm);
  
  .link-action-btn {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-subhead);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: var(--global-transition);
    
    .btn-icon {
      font-size: 16px;
    }
    
    &.visit-btn {
      background: var(--accent-primary);
      color: white;
      flex: 1;
      justify-content: center;
      
      &:hover {
        background: var(--accent-secondary);
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    &.copy-btn {
      background: var(--fill-secondary);
      color: var(--text-primary);
      padding: var(--space-sm);
      min-width: 44px;
      justify-content: center;
      
      &:hover {
        background: var(--fill-primary);
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 友链申请
.link-application {
  margin-top: var(--space-xxxxl);
  
  .application-card {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: var(--space-xxl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--separator-secondary);
  }
  
  .application-header {
    text-align: center;
    margin-bottom: var(--space-xxl);
    
    .application-tips {
      font-size: var(--font-size-caption1);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--space-sm);
    }
    
    .application-title {
      font-size: var(--font-size-title1);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
    }
    
    .application-description {
      font-size: var(--font-size-callout);
      color: var(--text-secondary);
      line-height: var(--line-height-normal);
    }
  }
  
  .application-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xxl);
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }
  }
  
  .application-requirements,
  .application-contact {
    h3 {
      font-size: var(--font-size-headline);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
    }
  }
  
  .application-requirements {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        font-size: var(--font-size-subhead);
        color: var(--text-secondary);
        line-height: var(--line-height-normal);
        padding: var(--space-sm) 0;
        border-bottom: 1px solid var(--separator-secondary);
        position: relative;
        padding-left: var(--space-xl);
        
        &::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--color-success);
          font-weight: var(--font-weight-bold);
        }
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  
  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      transition: var(--global-transition);
      
      &:hover {
        background: var(--fill-secondary);
      }
      
      .contact-icon {
        font-size: 20px;
        width: 32px;
        text-align: center;
      }
      
      .contact-label {
        font-size: var(--font-size-subhead);
        color: var(--text-secondary);
        min-width: 50px;
      }
      
      .contact-value {
        font-size: var(--font-size-subhead);
        color: var(--text-primary);
        font-weight: var(--font-weight-medium);
        flex: 1;
      }
      
      .copy-contact-btn {
        background: var(--accent-primary);
        color: white;
        border: none;
        padding: var(--space-xs);
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-size: 14px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--global-transition);
        
        &:hover {
          background: var(--accent-secondary);
          transform: scale(1.05);
        }
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

// 复制成功提示
.copy-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--bg-glass-strong);
  backdrop-filter: var(--backdrop-blur);
  color: var(--text-primary);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  z-index: var(--z-index-tooltip);
  border: 1px solid var(--separator-primary);
  
  .toast-icon {
    font-size: 18px;
  }
  
  .toast-message {
    font-size: var(--font-size-subhead);
    font-weight: var(--font-weight-medium);
  }
}

// Toast 动画
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

// 响应式调整
@media (max-width: 768px) {
  .links-page .page-content {
    padding: var(--space-lg) var(--space-md);
  }
  
  .links-header {
    margin-bottom: var(--space-xxl);
    
    .links-header-title {
      font-size: var(--font-size-title1);
    }
  }
  
  .links-container {
    gap: var(--space-xxl);
    margin-bottom: var(--space-xxl);
  }
  
  .link-card {
    padding: var(--space-md);
  }
  
  .application-card {
    padding: var(--space-xl);
  }
  
  .copy-toast {
    top: 10px;
    right: 10px;
    left: 10px;
    padding: var(--space-sm) var(--space-md);
    
    .toast-message {
      font-size: var(--font-size-caption1);
    }
  }
}

@media (max-width: 576px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .link-actions {
    .link-action-btn {
      padding: var(--space-sm);
      font-size: var(--font-size-caption1);
    }
  }
  
  .contact-methods .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
    
    .contact-label,
    .contact-value {
      width: 100%;
    }
    
    .copy-contact-btn {
      align-self: flex-end;
    }
  }
}
</style>
