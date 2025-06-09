<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageWrapper from '@/components/layout/PageWrapper.vue'
import TransitionLink from '@/components/common/TransitionLink.vue'

// 页面数据
const pageData = reactive({
  // 作者标签
  authorTags: {
    left: [
      '🤖️ 数码科技爱好者',
      '🔍 分享与热心帮助', 
      '🏠 智能家居小能手',
      '🔨 设计开发一条龙'
    ],
    right: [
      '专修交互与设计 🤝',
      '脚踏实地行动派 🏃',
      '团队小组发动机 🧱',
      '壮汉人狠话不多 💢'
    ]
  },

  // 个人信息
  personalInfo: {
    name: 'Clement 陈承烨',
    title: '设计师、产品经理、独立开发者、博主',
    greeting: '你好，很高兴认识你👋'
  },

  // 追求的创造词汇轮播
  creativeWords: ['产品', '设计', '程序', '体验'],

  // 技能数据
  skills: [
    { name: 'Vue.js', icon: '🖼️', color: '#4FC08D' },
    { name: 'React', icon: '⚛️', color: '#61DAFB' },
    { name: 'TypeScript', icon: '📘', color: '#3178C6' },
    { name: 'Node.js', icon: '🟢', color: '#339933' },
    { name: 'Python', icon: '🐍', color: '#3776AB' },
    { name: 'Photoshop', icon: '🎨', color: '#4082c3' },
    { name: 'Sketch', icon: '✏️', color: '#ffffff' },
    { name: 'Figma', icon: '🎯', color: '#A259FF' },
    { name: 'Docker', icon: '🐳', color: '#57b6e6' },
    { name: 'Git', icon: '📦', color: '#df5b40' },
    { name: 'CSS3', icon: '🎨', color: '#2c51db' },
    { name: 'HTML', icon: '📝', color: '#e9572b' },
    { name: 'JavaScript', icon: '⚡', color: '#f7cb4f' },
    { name: 'Swift', icon: '🚀', color: '#eb6840' },
    { name: 'Illustrator', icon: '🎭', color: '#f29e39' },
    { name: 'AfterEffects', icon: '🎬', color: '#989bf8' },
    { name: 'FinalCutPro', icon: '🎞️', color: '#ffffff' },
    { name: 'Rhino', icon: '🦏', color: '#1f1f1f' }
  ],

  // 生涯信息
  careers: [
    { name: 'XJTU,工业设计专业,Bachelor', color: '#357ef5' },
    { name: 'XJTU,机械工程专业,PhD', color: '#eb372a' }
  ],

  // 性格信息
  personality: {
    type: 'INFP-T',
    name: '调停者',
    color: '#56a178',
    image: '/src/assets/images/INFP.png'
  },

  // 座右铭
  maxim: '带着镣铐起舞是生命的赞歌',

  // 特长
  specialSkills: '玄学流电脑疑难问题解决专家，软件折腾能力大师级',

  // 游戏爱好
  games: {
    apex: {
      title: 'Apex Legends',
      mode: '排位',
      region: '港服',
      heroes: ['琉雀', '变幻', '艾许', '命脉', '幻象']
    },
    wutheringwave: {
      title: '鸣潮',
      platform: '库洛'
    }
  },

  // 兴趣爱好
  interests: {
    technology: '数码科技',
    music: '华语流行、民谣、R&B、电子音乐'
  },

  // 访问统计
  statistics: {
    todayUv: 540,
    todayPv: 877,
    yesterdayUv: 1058,
    yesterdayPv: 1996,
    lastMonthPv: 51677
  },

  // 个人信息
  selfInfo: [
    { content: '2003', title: '出生', color: '#43a6c6' },
    { content: '工业设计', title: '西安交通大学', color: '#c69043' },
    { content: '机械相关算法', title: '现在职业', color: '#b04fe6' }
  ],

  // 建站初衷
  createSiteReason: `创建这个站的时候，想要就是能够有一个自己能够积累知识、积累兴趣的地方。和他人分享，会让这些成为积累和沉淀。如果能够帮助到更多的人，帮助更多人解决问题，那一定是非常棒的事情。

分享这件事我从很早就开始了，起初做的微信公众号，现在做的网站。因为我比较喜欢研究数码和软件，想要探究在互联网上的事物是如何被创造和发展。网络给我带来了非常多的知识和眼界，我也想力所能及的分享一些我生活的琐碎知识。

与大多数垂直类的技术博客不同，这里的种类会非常的繁杂，有技能的教程干货、有生活上的吐槽和妙招、有话题上的思考和想法。一般我研究什么、发现了什么都会分享在这里。

这些就是创造这个小站的本意，也是我分享生活的方式。有幸能和你相遇在这里，相信我们能共同留下一段美好记忆。`,

  // 打赏名单
  rewardList: [
    { name: '饭之五', money: 1, date: '2025-06-03' },
    { name: '彼岸', money: 1, date: '2025-05-31' },
    { name: 'XunQiu', money: 1, date: '2025-05-26' },
    { name: '小鱼哥', money: 1, date: '2025-05-14' },
    { name: '**辉', money: 1, date: '2025-02-05' },
    { name: 'insomniac', money: 6.66, date: '2025-01-21' },
    { name: '来自微信的匿名好心人', money: 1, date: '2025-01-18' },
    { name: '碳水Sir', money: 1, date: '2025-01-15' },
    { name: 'Wilbur', money: 1, date: '2025-01-11' },
    { name: '来自微信的匿名好心人', money: 1, date: '2025-01-06' },
    { name: '滴', money: 1, date: '2025-01-05' }
  ],

  totalReward: 893.59
})

// 当前显示的创造词汇索引
const currentWordIndex = ref(0)

// 是否显示打赏弹窗
const showRewardModal = ref(false)

// 启动词汇轮播
onMounted(() => {
  setInterval(() => {
    currentWordIndex.value = (currentWordIndex.value + 1) % pageData.creativeWords.length
  }, 2000)
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 显示打赏弹窗
const showReward = () => {
  showRewardModal.value = true
}

// 隐藏打赏弹窗
const hideReward = () => {
  showRewardModal.value = false
}
</script>

<template>
  <PageWrapper class="about-page">
    <!-- 作者信息区域 -->
    <div class="author-info">
      <!-- 左侧标签 -->
      <div class="author-tag-left">
        <span 
          v-for="tag in pageData.authorTags.left" 
          :key="tag"
          class="author-tag"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 中间头像 -->
      <div class="author-img">
        <div class="lottie-avatar">
          <img 
            src="/src/assets/images/PF.png" 
            alt="Avatar"
            class="avatar-image"
          />
        </div>
      </div>

      <!-- 右侧标签 -->
      <div class="author-tag-right">
        <span 
          v-for="tag in pageData.authorTags.right" 
          :key="tag"
          class="author-tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 页面标题 -->
    <div class="author-title">关于本站</div>

    <!-- 主要内容区域 -->
    <div class="author-page-content">
      <!-- 第一行：问候和追求 -->
      <div class="author-content">
        <!-- 个人介绍 -->
        <div class="author-content-item myInfoAndSayHello">
          <div class="title1">{{ pageData.personalInfo.greeting }}</div>
          <div class="title2">
            我叫 <span class="inline-word">{{ pageData.personalInfo.name }}</span>
          </div>
          <div class="title1">
            是一名 {{ pageData.personalInfo.title }}
          </div>
        </div>

        <!-- 追求理念 -->
        <div class="aboutsiteTips author-content-item">
          <div class="author-content-item-tips">追求</div>
          <h2>
            源于<br>
            热爱而去<span class="inline-word">创造</span>
            <div class="mask">
              <span 
                v-for="(word, index) in pageData.creativeWords"
                :key="word"
                :class="{ active: index === currentWordIndex }"
                class="mask-word"
              >
                {{ word }}
              </span>
            </div>
          </h2>
        </div>
      </div>

      <!-- 第二行：技能展示 -->
      <div class="author-content">
        <div class="author-content-item skills">
          <div class="card-content">
            <div class="author-content-item-tips">技能</div>
            <span class="author-content-item-title">开启创造力</span>
            
            <!-- 技能图标网格 -->
            <div class="skills-style-group">
              <div class="tags-group-all">
                <div class="tags-group-wrapper">
                  <div 
                    v-for="(skill, index) in pageData.skills"
                    :key="skill.name"
                    class="tags-group-icon-pair"
                    v-show="index < 20"
                  >
                    <div 
                      class="tags-group-icon"
                      :style="{ background: skill.color }"
                      :title="skill.name"
                    >
                      <span class="skill-emoji">{{ skill.icon }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 技能列表 -->
              <div class="skills-list">
                <div 
                  v-for="skill in pageData.skills.slice(0, 18)"
                  :key="skill.name"
                  class="skill-info"
                >
                  <div 
                    class="skill-icon"
                    :style="{ background: skill.color }"
                  >
                    <span class="skill-emoji">{{ skill.icon }}</span>
                  </div>
                  <div class="skill-name">
                    <span>{{ skill.name }}</span>
                  </div>
                </div>
                <div class="etc">...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生涯 -->
        <div class="author-content-item careers">
          <div class="card-content">
            <div class="author-content-item-tips">生涯</div>
            <span class="author-content-item-title">无限进步</span>
            <div class="careers-group">
              <div 
                v-for="career in pageData.careers"
                :key="career.name"
                class="careers-item"
              >
                <div 
                  class="circle"
                  :style="{ background: career.color }"
                ></div>
                <div class="name">{{ career.name }}</div>
              </div>
            </div>
            <img 
              class="author-content-img"
              src="/src/assets/images/cover-1.jpg"
              alt="生涯"
            />
          </div>
        </div>
      </div>

      <!-- 第三行：性格和照片 -->
      <div class="author-content">
        <!-- 性格 -->
        <div class="author-content-item personalities">
          <div class="author-content-item-tips">性格</div>
          <span class="author-content-item-title">{{ pageData.personality.name }}</span>
          <div 
            class="title2"
            :style="{ color: pageData.personality.color }"
          >
            {{ pageData.personality.type }}
          </div>
          <div class="image">
            <img 
              :alt="pageData.personality.type"
              :src="pageData.personality.image"
            />
          </div>
          <div class="content-bottom">
            <div class="post-tips">
              <a href="#" target="_blank">了解{{ pageData.personality.name }}高级性格档案</a>
            </div>
          </div>
        </div>

        <!-- 照片 -->
        <div class="author-content-item myphoto">
          <img 
            class="author-content-img"
            alt="自拍"
            src="/src/assets/images/PF.png"
          />
          <img 
            class="author-content-memoji"
            alt="memoji"
            src="/src/assets/images/PF.png"
          />
        </div>
      </div>

      <!-- 第四行：座右铭和特长 -->
      <div class="author-content">
        <!-- 座右铭 -->
        <div class="author-content-item maxim">
          <div class="author-content-item-tips">座右铭</div>
          <span class="maxim-title">
            <span style="opacity: 0.6; margin-bottom: 8px;">荆棘之路，</span>
            <span>劈风斩浪。</span>
          </span>
        </div>

        <!-- 特长 -->
        <div class="author-content-item buff">
          <div class="card-content">
            <div class="author-content-item-tips">特长</div>
            <span class="buff-title">
              <span style="opacity: 0.6; margin-bottom: 8px;">
                玄学流电脑疑难问题解决<span class="inline-word">专家</span>
              </span>
              <span>软件折腾能力 <span class="inline-word">大师级</span></span>
            </span>
          </div>
          <div class="card-background-icon">
            <i class="fas fa-dice-d20"></i>
          </div>
        </div>
      </div>

      <!-- 第五行：游戏爱好 -->
      <div class="author-content">
        <!-- 英雄联盟 -->
        <div class="author-content-item game-lol">
          <div class="card-content">
            <div class="author-content-item-tips">爱好游戏</div>
            <div class="author-content-item-title">
              <span class="author-content-item-title-text">{{ pageData.games.apex.title }}</span>
            </div>
            <div class="content-bottom">
              <div class="hero-group">
                <div 
                  v-for="(hero, index) in pageData.games.apex.heroes"
                  :key="hero"
                  class="hero-group-item"
                  :style="{ '--index': index }"
                  :title="`擅长英雄：${hero}`"
                >
                  {{ hero.charAt(0) }}
                </div>
              </div>
              <div class="tips">{{ pageData.games.apex.region }}</div>
            </div>
          </div>
        </div>

        <!-- 狼人杀 -->
        <div class="author-content-item game-wolf">
          <div class="card-content">
            <div class="author-content-item-tips">爱好游戏</div>
            <span class="author-content-item-title">{{ pageData.games.wutheringwave.title }}</span>
            <div class="content-bottom">
              <div class="tips">{{ pageData.games.wutheringwave.platform }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第六行：兴趣偏好 -->
      <div class="author-content">
        <!-- 数码科技 -->
        <div class="author-content-item like-technology">
          <div class="card-content">
            <div class="author-content-item-tips">关注偏好</div>
            <span class="author-content-item-title">{{ pageData.interests.technology }}</span>
            <div class="content-bottom">
              <div class="tips">手机、电脑软硬件</div>
            </div>
          </div>
        </div>

        <!-- 音乐偏好 -->
        <div class="author-content-item like-music">
          <div class="card-content">
            <div class="author-content-item-tips">音乐偏好</div>
            <span class="author-content-item-title">{{ pageData.interests.music }}</span>
            <div class="content-bottom">
              <div class="tips">跟 {{ pageData.personalInfo.name }} 一起欣赏更多音乐</div>
              <div class="banner-button-group">
                <TransitionLink 
                  to="/mlog" 
                  class="banner-button"
                >
                  <i class="icon-arrow-right-circle"></i>
                  <span class="banner-button-text">更多推荐</span>
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第七行：统计数据和个人信息 -->
      <div class="author-content">
        <!-- 访问统计 -->
        <div class="about-statistic author-content-item">
          <div class="card-content">
            <div class="author-content-item-tips">数据</div>
            <span class="author-content-item-title">访问统计</span>
            <div class="statistic">
              <div><span>今日人数</span><span>{{ pageData.statistics.todayUv }}</span></div>
              <div><span>今日访问</span><span>{{ pageData.statistics.todayPv }}</span></div>
              <div><span>昨日人数</span><span>{{ pageData.statistics.yesterdayUv }}</span></div>
              <div><span>昨日访问</span><span>{{ pageData.statistics.yesterdayPv }}</span></div>
              <div><span>最近月访问</span><span>{{ pageData.statistics.lastMonthPv }}</span></div>
            </div>
            <div class="content-bottom">
              <div class="banner-button-group">
                <TransitionLink 
                  to="/blog/stats" 
                  class="banner-button"
                >
                  <i class="icon-arrow-right-circle"></i>
                  <span class="banner-button-text">文章统计</span>
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>

        <!-- 地图和个人信息 -->
        <div class="author-content-item-group column mapAndInfo">
          <div class="author-content-item map single">
            <span class="map-title">我现在住在 <b>中国，北京市</b></span>
          </div>
          <div class="author-content-item selfInfo single">
            <div 
              v-for="info in pageData.selfInfo"
              :key="info.title"
              class="self-info-item"
            >
              <div class="selfInfo-img-wrapper">
                <div class="selfInfo-img">{{ info.content.charAt(0) }}</div>
              </div>
              <span 
                class="selfInfo-content"
                :style="{ color: info.color }"
              >
                {{ info.content }}
              </span>
              <span class="selfInfo-title">{{ info.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 第八行：建站初衷 -->
      <div class="author-content">
        <div class="create-site-post author-content-item single">
          <div class="author-content-item-tips">心路历程</div>
          <span class="author-content-item-title">为什么建站？</span>
          <div class="site-reason-content">
            <p v-for="paragraph in pageData.createSiteReason.split('\n\n')" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>

      <!-- 第九行：打赏名单 -->
      <div class="author-content">
        <div class="author-content-item single reward">
          <div class="author-content-item-tips">致谢</div>
          <span class="author-content-item-title">打赏名单</span>
          <div class="author-content-item-description">
            感谢打赏的人，因为你们，让我感受到写博客这件事情能够给你们创造了价值。这会让我在这条路上走得更远。
          </div>
          
          <!-- 打赏列表 -->
          <div class="reward-list-all">
            <div 
              v-for="reward in pageData.rewardList"
              :key="`${reward.name}-${reward.date}`"
              class="reward-list-item"
            >
              <div class="reward-list-item-name">{{ reward.name }}</div>
              <div class="reward-list-bottom-group">
                <div class="reward-list-item-money">¥ {{ reward.money }}</div>
                <time class="reward-list-item-time">{{ formatDate(reward.date) }}</time>
              </div>
            </div>
            <a class="reward-list-item reward-list-item-more" href="#" target="_blank">
              查看全部<i class="icon-arrow-right-circle"></i>
            </a>
          </div>

          <!-- 总金额 -->
          <div class="reward-list-tips">
            <p>总金额：¥ {{ pageData.totalReward }}</p>
          </div>

          <!-- 打赏按钮 -->
          <div class="post-reward">
            <div class="reward-button" @click="showReward">
              <i class="icon-heart"></i> 打赏作者
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打赏弹窗 -->
    <div v-if="showRewardModal" class="reward-modal" @click="hideReward">
      <div class="reward-modal-content" @click.stop>
        <div class="reward-title">感谢你赐予我前进的力量</div>
        <div class="reward-qr-group">
          <div class="reward-item">
            <img src="/src/assets/images/PF.png" alt="微信" />
            <div class="reward-desc">微信</div>
          </div>
          <div class="reward-item">
            <img src="/src/assets/images/PF.png" alt="支付宝" />
            <div class="reward-desc">支付宝</div>
          </div>
        </div>
        <button class="reward-close" @click="hideReward">关闭</button>
      </div>
    </div>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.about-page {
  .page-content {
    max-width: 1200px;
    padding: var(--space-xl);
  }
}

// 作者信息区域
.author-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xxl);
  margin-bottom: var(--space-xxxl);
  padding: var(--space-xxl) 0;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    gap: var(--space-xl);
  }
}

.author-tag-left,
.author-tag-right {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-width: 200px;
  
  @media (max-width: 768px) {
    min-width: auto;
    align-items: center;
  }
}

.author-tag {
  background: var(--bg-glass);
  backdrop-filter: var(--backdrop-blur);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-subhead);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  transition: var(--global-transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.author-img {
  .lottie-avatar {
    width: 200px;
    height: 200px;
    border-radius: var(--radius-full);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    transition: var(--global-transition);
    
    &:hover {
      transform: scale(1.05);
    }
    
    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

// 页面标题
.author-title {
  text-align: center;
  font-size: var(--font-size-large-title);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xxxl);
}

// 主要内容
.author-page-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxl);
}

.author-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}

.author-content-item {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--global-transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &.single {
    grid-column: 1 / -1;
  }
}

.author-content-item-tips {
  font-size: var(--font-size-caption1);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-sm);
}

.author-content-item-title {
  font-size: var(--font-size-title2);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  display: block;
}

// 问候和介绍
.myInfoAndSayHello {
  text-align: center;
  
  .title1 {
    font-size: var(--font-size-title2);
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }
  
  .title2 {
    font-size: var(--font-size-title1);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }
}

.inline-word {
  color: var(--accent-primary);
  font-weight: var(--font-weight-semibold);
}

// 追求理念
.aboutsiteTips {
  text-align: center;
  
  h2 {
    font-size: var(--font-size-title1);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    line-height: var(--line-height-tight);
    
    .mask {
      position: relative;
      height: 1.2em;
      overflow: hidden;
      
      .mask-word {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.5s ease;
        
        &.active {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
}

// 技能展示
.skills {
  .skills-style-group {
    margin-top: var(--space-lg);
  }
  
  .tags-group-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }
  
  .tags-group-icon {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--global-transition);
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    .skill-emoji {
      font-size: 24px;
    }
  }
  
  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    
    .skill-info {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      
      .skill-icon {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .skill-emoji {
          font-size: 16px;
        }
      }
      
      .skill-name {
        font-size: var(--font-size-subhead);
        color: var(--text-primary);
      }
    }
    
    .etc {
      color: var(--text-secondary);
      font-size: var(--font-size-title1);
      padding: var(--space-sm);
    }
  }
}

// 生涯
.careers {
  .careers-group {
    margin: var(--space-lg) 0;
    
    .careers-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
      
      .circle {
        width: 16px;
        height: 16px;
        border-radius: var(--radius-full);
      }
      
      .name {
        font-size: var(--font-size-subhead);
        color: var(--text-primary);
      }
    }
  }
  
  .author-content-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin-top: var(--space-md);
  }
}

// 性格
.personalities {
  text-align: center;
  
  .title2 {
    font-size: var(--font-size-title1);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-lg);
  }
  
  .image {
    margin: var(--space-lg) 0;
    
    img {
      width: 120px;
      height: 120px;
      border-radius: var(--radius-lg);
      object-fit: cover;
    }
  }
  
  .content-bottom {
    .post-tips a {
      color: var(--accent-primary);
      text-decoration: none;
      font-size: var(--font-size-subhead);
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 照片
.myphoto {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  
  .author-content-img,
  .author-content-memoji {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: var(--radius-lg);
  }
}

// 座右铭
.maxim {
  text-align: center;
  
  .maxim-title {
    font-size: var(--font-size-title2);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    line-height: var(--line-height-tight);
    display: block;
  }
}

// 特长
.buff {
  position: relative;
  overflow: hidden;
  
  .buff-title {
    font-size: var(--font-size-headline);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    line-height: var(--line-height-normal);
    display: block;
  }
  
  .card-background-icon {
    position: absolute;
    top: var(--space-lg);
    right: var(--space-lg);
    font-size: 48px;
    color: var(--fill-tertiary);
    opacity: 0.3;
  }
}

// 游戏
.game-lol,
.game-wolf {
  .content-bottom {
    margin-top: var(--space-lg);
    
    .hero-group {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
      
      .hero-group-item {
        width: 32px;
        height: 32px;
        background: var(--accent-primary);
        color: white;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-subhead);
        font-weight: var(--font-weight-bold);
      }
    }
    
    .tips {
      font-size: var(--font-size-caption1);
      color: var(--text-secondary);
    }
  }
}

// 兴趣偏好
.like-technology,
.like-music {
  .content-bottom {
    margin-top: var(--space-lg);
    
    .tips {
      font-size: var(--font-size-subhead);
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
    }
    
    .banner-button-group {
      .banner-button {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
        color: var(--accent-primary);
        text-decoration: none;
        font-size: var(--font-size-subhead);
        transition: var(--global-transition);
        
        &:hover {
          color: var(--accent-secondary);
        }
      }
    }
  }
}

// 统计数据
.about-statistic {
  .statistic {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-md);
    margin: var(--space-lg) 0;
    
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      
      span:first-child {
        font-size: var(--font-size-caption1);
        color: var(--text-secondary);
      }
      
      span:last-child {
        font-size: var(--font-size-headline);
        font-weight: var(--font-weight-bold);
        color: var(--accent-primary);
      }
    }
  }
}

// 地图和个人信息
.mapAndInfo {
  .map {
    text-align: center;
    padding: var(--space-xl);
    
    .map-title {
      font-size: var(--font-size-headline);
      color: var(--text-primary);
    }
  }
  
  .selfInfo {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    
    .self-info-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      
      .selfInfo-img-wrapper {
        .selfInfo-img {
          width: 40px;
          height: 40px;
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-bold);
        }
      }
      
      .selfInfo-content {
        font-size: var(--font-size-headline);
        font-weight: var(--font-weight-semibold);
      }
      
      .selfInfo-title {
        font-size: var(--font-size-subhead);
        color: var(--text-secondary);
      }
    }
  }
}

// 建站初衷
.create-site-post {
  .site-reason-content {
    margin-top: var(--space-lg);
    
    p {
      font-size: var(--font-size-body);
      line-height: var(--line-height-loose);
      color: var(--text-primary);
      margin-bottom: var(--space-md);
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 打赏
.reward {
  .author-content-item-description {
    font-size: var(--font-size-subhead);
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-lg);
  }
  
  .reward-list-all {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
    
    .reward-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-sm) var(--space-md);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      
      &.reward-list-item-more {
        color: var(--accent-primary);
        text-decoration: none;
        justify-content: center;
        
        &:hover {
          background: var(--accent-hover);
        }
      }
      
      .reward-list-item-name {
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }
      
      .reward-list-bottom-group {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--space-xxs);
        
        .reward-list-item-money {
          color: var(--accent-primary);
          font-weight: var(--font-weight-semibold);
        }
        
        .reward-list-item-time {
          font-size: var(--font-size-caption1);
          color: var(--text-tertiary);
        }
      }
    }
  }
  
  .reward-list-tips {
    text-align: center;
    margin-bottom: var(--space-lg);
    
    p {
      font-size: var(--font-size-headline);
      font-weight: var(--font-weight-bold);
      color: var(--accent-primary);
    }
  }
  
  .post-reward {
    text-align: center;
    
    .reward-button {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-xl);
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-callout);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: var(--global-transition);
      
      &:hover {
        background: var(--accent-secondary);
        transform: translateY(-2px);
      }
    }
  }
}

// 打赏弹窗
.reward-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  
  .reward-modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: var(--space-xxl);
    max-width: 400px;
    width: 90%;
    text-align: center;
    
    .reward-title {
      font-size: var(--font-size-title2);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--space-xl);
    }
    
    .reward-qr-group {
      display: flex;
      gap: var(--space-xl);
      justify-content: center;
      margin-bottom: var(--space-xl);
      
      .reward-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-md);
        
        img {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-lg);
        }
        
        .reward-desc {
          font-size: var(--font-size-callout);
          color: var(--text-secondary);
        }
      }
    }
    
    .reward-close {
      background: var(--fill-secondary);
      color: var(--text-primary);
      border: none;
      padding: var(--space-sm) var(--space-xl);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--global-transition);
      
      &:hover {
        background: var(--fill-primary);
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .about-page .page-content {
    padding: var(--space-lg) var(--space-md);
  }
  
  .author-info {
    margin-bottom: var(--space-xl);
    padding: var(--space-xl) 0;
  }
  
  .author-img .lottie-avatar {
    width: 150px;
    height: 150px;
  }
  
  .author-title {
    font-size: var(--font-size-title1);
    margin-bottom: var(--space-xl);
  }
  
  .author-page-content {
    gap: var(--space-xl);
  }
  
  .author-content-item {
    padding: var(--space-md);
  }
}

@media (max-width: 576px) {
  .author-tag-left,
  .author-tag-right {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .reward-modal .reward-modal-content {
    padding: var(--space-xl);
    
    .reward-qr-group {
      flex-direction: column;
      gap: var(--space-lg);
    }
  }
}
</style>