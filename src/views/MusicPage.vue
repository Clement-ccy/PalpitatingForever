<template>
  <div class="adventure-container">
      <!-- 主视觉区域 -->
      <div class="hero-section"
          :style="{ background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${currentCover}) center / cover` }">
          <!-- 新增控制按钮 -->
          <div class="controls">
              <a class="up" :class="{ disabled: currentIndex === 0 }" @click="navigate(-1)">&uarr;</a>
              <a class="down" :class="{ disabled: currentIndex === pictureAlbums.length - 1 }"
                  @click="navigate(1)">&darr;</a>
          </div>
          <!-- 页码显示 -->
          <span class="note">
              <span class="activeSlide">{{ currentIndex + 1 }}</span> /
              <span class="slideTotal">{{ pictureAlbums.length }}</span>
          </span>
          <!-- 左侧控制圆点 -->
          <div class="control-dots">
              <div v-for="(_, index) in pictureAlbums" :key="index" class="dot"
                  :class="{ active: currentIndex === index }" @click="selectAlbum(index)"></div>
          </div>
          <!-- 图片面板容器 -->
          <div class="panels">
              <div v-for="(album, index) in pictureAlbums" :key="index" class="panel"
                  :class="['panel-' + (index + 1), { active: currentIndex === index }]" :id="`panel_${index + 1}`">
                  <div class="clip">
                      <h2><a>{{ album.name }}</a></h2>
                      <span class="tint"></span>
                      <div class="picture-album-cover">
                          <img :src="album.cover" :alt="album.name">
                      </div>
                  </div>
              </div>
          </div>
          <div class="hero-content">
              <div class="serial-number">0{{ currentIndex + 1 }}</div>
              <h1 class="main-title">
                  And so the adventure<br>
                  begins...
              </h1>
              <button class="cta-button">Learn More</button>
              <!-- <div class="scroll-indicator">
                  <span>SCROLLDOWN</span>
                  <div class="scroll-line"></div>
              </div> -->
          </div>

          <div class="picture-album-preview">
              <div v-for="(pictureAlbum, index) in pictureAlbums" :key="index" class="picture-album-item"
                  :style="{ '--delay': index * 0.1 + 's' }" @mouseenter="handleHover(index)"
                  @mouseleave="handleHover(null)" @click="selectAlbum(index)">
                  <div class="item-container" :class="{ 'active': currentIndex === index }">
                      <div class="picture-album-cover">
                          <img :src="pictureAlbum.cover" :alt="pictureAlbum.name">
                      </div>
                      <div class="information-group">
                          <div class="picture-album-name">{{ pictureAlbum.name }}</div>
                          <div class="picture-album-type">{{ pictureAlbum.type }}</div>
                          <div class="picture-album-location">{{ pictureAlbum.location }}</div>
                          <div class="picture-album-time">{{ pictureAlbum.time }}</div>
                      </div>
                  </div>

              </div>
              <div class="selector" :style="selectorStyle">
                  Explode
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
export default {
  component:{
    
  },
  data() {
      return {
          currentIndex: 0,
          currentHoverIndex: null,
          pictureAlbums: [
              {
                  name: 'Cuffs of Mother',
                  cover: 'src/assets/images/adventure-bg0.jpg',
                  type: 'Scenery',
                  location: '(Indians)',
                  time: '2025.03.27'
              },
              {
                  name: 'The Verdon',
                  cover: 'src/assets/images/adventure-bg1.jpg',
                  type: 'Scenery',
                  location: '(France)',
                  time: '2025.03.27'
              },
              {
                  name: 'Gorge',
                  cover: 'src/assets/images/adventure-bg2.jpg',
                  type: 'Scenery',
                  location: '(France)',
                  time: '2025.03.27'
              },
              {
                  name: 'The Dolomites',
                  cover: 'src/assets/images/adventure-bg3.jpg',
                  type: 'Scenery',
                  location: '(Reb)',
                  time: '2025.03.27'
              },
          ]
      }
  },
  mounted() {
      this.initScrollTriggers()
  },
  computed: {
      currentCover() {
          return this.pictureAlbums[this.currentIndex]?.cover
      },
      selectorStyle() {
          const targetIndex = this.currentHoverIndex ?? this.currentIndex
          return {
              width: `${100 / this.pictureAlbums.length}%`,
              left: `${(targetIndex * 100) / this.pictureAlbums.length}%`,
              transition: this.currentHoverIndex ? 'all 0.3s ease' : 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
          }
      }
  },
  methods: {
      handleHover(index) {
          this.currentHoverIndex = index
      },
      selectAlbum(index) {
          this.currentIndex = index
          this.currentHoverIndex = null
      },
      initScrollTriggers() {
          const panels = document.querySelector('.panels')
          const sections = gsap.utils.toArray(".panel")

          sections.forEach((panel, index) => {
              ScrollTrigger.create({
                  trigger: panel,
                  start: "top center",
                  end: "bottom center",
                  onEnter: () => this.handleScrollChange(index),
                  onEnterBack: () => this.handleScrollChange(index - 1)
              })
          })
      },

      handleScrollChange(index) {
          if (index >= 0 && index < this.pictureAlbums.length) {
              this.currentIndex = index
          }
      },

      navigate(direction) {
          const newIndex = this.currentIndex + direction
          if (newIndex >= 0 && newIndex < this.pictureAlbums.length) {
              this.scrollToPanel(newIndex)
          }
      },

      scrollToPanel(index) {
          gsap.to('.panels', {
              duration: 1.2,
              ease: "power4.inOut",
              scrollTo: {
                  y: `#panel_${index + 1}`,
                  autoKill: false
              }
          })
      }
  }
}
</script>

<style scoped>
.adventure-container {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  font-family: 'Arial', sans-serif;
}

.controls {
position: fixed;
bottom: 40px;
right: 40px;
z-index: 100;
display: flex;
gap: 8px;
}

.controls a {
display: block;
width: 36px;
height: 36px;
line-height: 36px;
text-align: center;
border-radius: 50%;
background: rgba(255, 255, 255, 0.1);
cursor: pointer;
transition: all 0.3s;
}

.controls a:hover {
background: rgba(255, 255, 255, 0.2);
}

.controls a.disabled {
opacity: 0.3;
pointer-events: none;
}

.note {
position: fixed;
bottom: 48px;
right: 120px;
font-size: 18px;
opacity: 0.8;
}

/* 滚动面板样式 */
.panels {
height: 100vh;
width: 100vw;
overflow-y: scroll;
scroll-snap-type: y mandatory;
}

.panel {
height: 100vh;
scroll-snap-align: start;
position: relative;
}

.clip {
position: sticky;
top: 0;
height: 100vh;
}

.tint {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.3);
z-index: 1;
}

.picture-album-cover {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}

.picture-album-cover img {
width: 100%;
height: 100%;
object-fit: cover;
}

h2 {
position: absolute;
bottom: 100px;
left: 50px;
font-size: 2.5em;
z-index: 2;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  mix-blend-mode: difference;
  border-bottom: solid #fff 1px;
}

.nav-left {
  display: flex;
  align-items: center;
  padding: 2rem 4rem;
  gap: 3rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 3rem;
}

label.menu-toggle {
  position: relative;
  line-height: 0px;
  display: block;
  margin-left: 1rem;
  padding: 2rem;
  border-left: solid #fff 0.48px;
  transition: background-color .48s cubic-bezier(.36, .33, 0, 1);

  .icon {
      width: 2rem;
      height: 2rem;
  }
}

label.menu-toggle:hover {
  background-color: #dddddd93;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.link-container {
  display: flex;
  gap: 3rem;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: inherit;
  font-size: 1rem;
  transition: opacity 0.3s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: white;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.hero-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
      url('src/assets/images/adventure-bg.jpg') center/cover;
}

.control-dots {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 100;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.dot.active::after {
  content: '';
  position: absolute;
  left: -3.5px;
  top: -3.5px;
  width: 18px;
  height: 18px;
  border: 1px solid white;
  border-radius: 50%;
}

.hero-content {
  text-align: left;
  width: 70vw;
}

.serial-number {
  font-size: 10rem;
  letter-spacing: -0.02em;
  opacity: 0.6;
}

.main-title {
  font-size: 4.5vw;
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 3rem;
  letter-spacing: -0.03em;
}

.cta-button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 1rem 3rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 4rem;
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.scroll-line {
  width: 1px;
  height: 60px;
  background: white;
  animation: scrollPulse 2s infinite;
}

@keyframes scrollPulse {

  0%,
  100% {
      opacity: 0.2;
  }

  50% {
      opacity: 1;
  }
}

.picture-album-preview {
  position: fixed;
  bottom: 0;
  width: 70vw;
  height: 20vh;
  border-radius: 1rem 1rem 0 0;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #ffffff41;
}

.picture-album-item {
  padding: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s forwards;
  animation-delay: var(--delay);
}

.item-container {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  max-height: fit-content;
}

.item-container::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 0;
  right: 0;
  height: 1px;
  background: white;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.item-container.active::after,
.picture-album-item:hover .item-container::after {
  transform: scaleX(1);
}

.picture-album-cover {
  overflow: hidden;
  height: 70%;
  aspect-ratio: 4/3;

  img {
      width: 100%;
      height: 100%;
      -o-object-fit: cover;
      object-fit: cover;
  }
}

.information-group {
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  max-height: fit-content;
}

.selector {
  position: absolute;
  bottom: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px 8px 0 0;
  z-index: -1;
  transition-property: left, width;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}

@keyframes fadeInUp {
  to {
      opacity: 1;
      transform: translateY(0);
  }
}
</style>