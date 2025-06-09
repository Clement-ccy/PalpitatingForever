<script setup>
import { reactive } from 'vue'
import PageWrapper from '@/components/layout/PageWrapper.vue'
import TransitionLink from '@/components/common/TransitionLink.vue'

// 装备数据
const gearData = reactive({
  // 页面头部信息
  header: {
    tips: '我持有了什么',
    title: '实物装备推荐（不一定是推荐）',
    description: '来了解 PalpitatingForever 看测评购物的装备吧！这些装备都是我个人使用过的，可能会有一些主观评价。'
  },

  // 装备分类
  categories: [
    {
      id: 'productivity',
      title: '生产力',
      description: '提升自己生产效率的硬件设备',
      items: [
        {
          name: 'MacBook Pro',
          specification: 'M1Pro 32G / 1TB',
          description: '屏幕显示效果好、色彩准确、对比度强、性能强劲、续航优秀。可以用来开发和设计。',
          image: '/src/assets/images/cover-1.jpg',
          link: '/blog/post/macbook-pro',
          linkText: '查看文章'
        },
        {
          name: 'iPhone 13 Pro',
          specification: '白色 / 256G',
          description: '第一代支持ProMotion的iPhone，A15性能优秀。',
          image: '/src/assets/images/cover-2.jpg',
          link: 'https://www.apple.com/iphone-13-pro/',
          linkText: '详情',
          external: true
        },
        {
          name: '米物多模键盘85',
          specification: '无线蓝牙',
          description: '一款可以同时连接多个设备的键盘，适配windows和mac，按键中间空隙合适，圆形按键比较好看。',
          image: '/src/assets/images/cover-3.jpg',
          link: 'https://item.jd.com/100012980718.html',
          linkText: '详情',
          external: true
        },
        {
          name: 'Logi Master 3s for Mac',
          specification: '无线蓝牙',
          description: '响应迅速，扩展能力强，很适合办公使用',
          image: '/src/assets/images/cover-4.jpg',
          link: '/blog/post/logi-master-3s',
          linkText: '查看文章'
        },
        {
          name: '品胜二合一无线充电支架',
          specification: 'FYD-C20',
          description: '充电的时候非常热，不过这个是MagSafe的通病，体验上来说配合iOS17的待机显示效果还是非常好。',
          image: '/src/assets/images/cover-5.jpg',
          link: 'http://www.pisen.com.cn/',
          linkText: '详情',
          external: true
        },
        {
          name: '西部数据P10移动硬盘',
          specification: '4TB',
          description: '性能很不错的移动硬盘，比较喜欢西数这个品牌。',
          image: '/src/assets/images/cover-6.jpg',
          link: 'https://www.westerndigital.com/zh-cn/products/portable-drives/wd-black-p10-game-drive-usb-3-2-hdd',
          linkText: '详情',
          external: true
        },
        {
          name: '固态移动硬盘套装',
          specification: '梵想S690/2TBSSD ITGZ雷电硬盘盒/ASM2464',
          description: 'TLC颗粒，我放在移动硬盘盒里作为mac的移动硬盘使用。相比于移动机械硬盘，不会因为等待移动硬盘唤醒而造成mac卡顿。',
          image: '/src/assets/images/cover-7.jpg',
          link: '/blog/post/ssd-enclosure',
          linkText: '查看文章'
        }
      ]
    },
    {
      id: 'travel',
      title: '出行',
      description: '用来出行的实物及设备',
      items: [
        {
          name: '航宇之星双肩包',
          specification: '标准版',
          description: '造型炫酷，包的容量非常大，还有魔术贴位置，我贴上了鸡哥的头像。',
          image: '/src/assets/images/cover-8.jpg',
          link: 'https://detail.meizu.com/item/pasasjb.html',
          linkText: '详情',
          external: true
        },
        {
          name: '魅族重塑斜挎包',
          specification: '标准版',
          description: '一款轻便小巧的斜挎包，虽然体积比较小，能放的东西少，但是非常好看。',
          image: '/src/assets/images/cover-9.jpg',
          link: 'https://detail.meizu.com/item/pandaerxkb.html',
          linkText: '详情',
          external: true
        },
        {
          name: '黑鲨刀锋2',
          specification: '黑色',
          description: '体积特别小巧，金属外壳，有充电动画和iOS电量显示',
          image: '/src/assets/images/cover-1.jpg',
          link: '/blog/post/blackshark-blade2',
          linkText: '查看文章'
        },
        {
          name: '地平线8号行李箱',
          specification: '前开门20寸登机箱',
          description: '用起来感觉很结实，并且在移动的时候非常静音。外观非常好看。老罗推荐的。',
          image: '/src/assets/images/cover-2.jpg',
          link: 'http://www.level8.com.cn/',
          linkText: '详情',
          external: true
        },
        {
          name: 'Apple Watch Series 7',
          specification: '黑色',
          description: '从S7开始支持超窄边框，颜值非常讨喜，是目前性价比最高的一代手表',
          image: '/src/assets/images/cover-3.jpg',
          link: 'https://www.apple.com.cn/watch/',
          linkText: '详情',
          external: true
        },
        {
          name: 'AirPods Pro',
          specification: '第二代',
          description: '可以说是非常强的耳机了，还有好几次固件大幅度更新。apple生态只要有两个设备及以上，必入。',
          image: '/src/assets/images/cover-4.jpg',
          link: '/blog/post/airpods-pro',
          linkText: '查看文章'
        }
      ]
    },
    {
      id: 'entertainment',
      title: '家庭娱乐',
      description: '用来娱乐的硬件设备',
      items: [
        {
          name: 'Windows台式机',
          specification: 'i5 12600KF / 1060 3G',
          description: '用来玩英雄联盟',
          image: '/src/assets/images/cover-5.jpg',
          link: '/blog/post/windows-desktop',
          linkText: '查看文章'
        },
        {
          name: '泰坦军团显示器',
          specification: 'P2710R',
          description: '很便宜的2k27寸180hz显示器',
          image: '/src/assets/images/cover-6.jpg',
          link: '/blog/post/titan-monitor',
          linkText: '查看文章'
        },
        {
          name: 'PICO 4',
          specification: '128G',
          description: '用来看视频和沉浸式观影的小设备，偶尔玩点VR游戏。',
          image: '/src/assets/images/cover-7.jpg',
          link: '/blog/post/pico-4',
          linkText: '查看文章'
        },
        {
          name: '极空间 Z2S',
          specification: '酷狼4T & 紫盘4T / 4G',
          description: '家庭影音中心，放置我的视频、影片和手机的照片备份。',
          image: '/src/assets/images/cover-8.jpg',
          link: '/blog/post/zspace-z2s',
          linkText: '查看文章'
        },
        {
          name: 'Apple TV 4K',
          specification: '第六代 32G',
          description: '访问极空间的视频，极空间支持 Apple TV 客户端，可以非常方便的访问，浏览记录多端同步。',
          image: '/src/assets/images/cover-9.jpg',
          link: 'https://www.apple.com/apple-tv-4k/',
          linkText: '详情',
          external: true
        },
        {
          name: 'HomePod mini',
          specification: '黑色',
          description: '因为我的Apple TV连接到的是显示器，没有音响，所以就用HomePod来代替了。对于播放音乐能力来说不如小爱同学，但是音质好太多。',
          image: '/src/assets/images/cover-1.jpg',
          link: '/blog/post/homepod-mini',
          linkText: '查看文章'
        },
        {
          name: 'iPad Air 3',
          specification: '64GB 玫瑰金',
          description: '当时冲着屏幕大和屏幕显示效果买的。主要用来看bilibili。',
          image: '/src/assets/images/cover-2.jpg',
          link: 'https://www.apple.com.cn/ipad/',
          linkText: '详情',
          external: true
        },
        {
          name: '友善r5s',
          specification: '标准版',
          description: '平常用于装载HomeAssistant，作为家庭自动化的中心。并通过Docker实现一些自动签到、Alist挂载等功能。',
          image: '/src/assets/images/cover-3.jpg',
          link: '/blog/post/friendlyarm-r5s',
          linkText: '查看文章'
        }
      ]
    },
    {
      id: 'lifestyle',
      title: '健康生活',
      description: '日常用的一些小的数码好物',
      items: [
        {
          name: '米家桌面移动风扇',
          specification: '标准版',
          description: '可以摇头的小风扇，噪音不高，摇头避免吹得头疼',
          image: '/src/assets/images/cover-4.jpg',
          link: '/blog/post/mijia-fan',
          linkText: '查看文章'
        }
      ]
    }
  ]
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
    <!-- 页面头部 -->
    <div class="author-content author-content-item equipment single">
      <div class="card-content">
        <div class="author-content-item-tips">{{ gearData.header.tips }}</div>
        <span class="author-content-item-title">{{ gearData.header.title }}</span>
        <div class="content-bottom">
          <div class="tips">{{ gearData.header.description }}</div>
        </div>
      </div>
    </div>

    <!-- 装备列表 -->
    <div class="equipment">
      <div 
        v-for="category in gearData.categories"
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
            :key="item.name"
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
              <div class="equipment-item-content-item-toolbar">
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
</style>