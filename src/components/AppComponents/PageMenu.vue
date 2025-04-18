<template>
  <div ref="menu" class="menu">
    <div ref="menuFloat" class="float">
      <nav v-if="menuState === 'default'" class="float-bottom">
        <div class="inner">
          <ul>
            <button @click="changeContent('/whatido')">What I Do</button>
            <button @click="changeContent('/whoiam')">Who I Am</button>
            <button @click="changeContent('/blog')">Blog</button>
            <button @click="changeContent('/photograph')">Photograph</button>
            <button @click="changeContent('/music')">Music</button>
          </ul>
          <button class="menu-btn --talk">
            <div class="inner">
              <span class="text">Talk to us...</span>
              <span class="menu-btn-icon">
                <span class="icon --message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path data-v-000e7669=""
                      d="M10.9998 8.66675V8.67841M6.33317 8.66675V8.67841M15.6665 8.66675V8.67841M1.6665 20.3334V5.16675C1.6665 4.23849 2.03525 3.34825 2.69163 2.69187C3.34801 2.0355 4.23825 1.66675 5.1665 1.66675H16.8332C17.7614 1.66675 18.6517 2.0355 19.308 2.69187C19.9644 3.34825 20.3332 4.23849 20.3332 5.16675V12.1667C20.3332 13.095 19.9644 13.9852 19.308 14.6416C18.6517 15.298 17.7614 15.6667 16.8332 15.6667H6.33317L1.6665 20.3334Z"
                      stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
              </span>
            </div>
          </button>
        </div>
      </nav>
      <div v-else-if="menuState === 'breadCrumb'" class="menu-active-content">
        <div class="inner">
          <span class="content-label">{{ currentLabel }}</span>
          <button @click="deactivateMenu()" class="back-button">返回</button>
        </div>
      </div>
      <div v-else-if="menuState === 'contact'" class="menu-active-content">
        <div class="inner">
          <span class="content-label">{{ currentLabel }}</span>
          <button @click="deactivateMenu()" class="back-button">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  data() {
    return {
      menuState: 'default',
      currentLabel: '123456',
    };
  },
  mounted() {
    console.log("Menu component mounted");
  },
  methods: {
    animateMenuWidth() {
      const menuElement = this.$refs.menu;
      // 获取 menu 当前宽度
      const currentWidth = menuElement.offsetWidth;

      // 动画效果，根据当前内容的大小调整宽度
      gsap.to(menuElement, {
        duration: 0.4, // 动画持续时间
        width: currentWidth + 'px', // 设置为当前宽度，可以替换为特定宽度
        ease: 'power2.out' // 缓动效果
      });
    },
    changeContent(page) {
      // 路由跳转或者内容变化逻辑
      this.$emit('changeMenu', page);
    },
    deactivateMenu() {
      // 使用 GSAP 实现弹性变形到默认状态
      gsap.fromTo(".float", {
        width: this.$refs.menuFloat.offsetWidth + 'px',
        onComplete: () => {
          this.menuState = "default"
        }
      },
        {
          width: 'auto',
          duration: 0.5,
          ease: "elastic.out(1, 1)",
        });
    },
    activateMenu(label) {
      this.currentLabel = label;
      // 使用 GSAP 实现弹性变形到活动状态
      gsap.fromTo(".float", {
        width: this.$refs.menuFloat.offsetWidth + 'px',
        onComplete: () => {
          this.menuState = "breadCrumb"
        }
      },
        {
          width: 'auto',
          duration: 0.5,
          ease: "elastic.out(1, 1)",
        });
    },
  },
  watch: {
    // menuState(newState, oldState) {
    //   // 等待 DOM 更新后动画化
    //   this.$nextTick(() => {
    //     this.animateMenuWidth();
    //   });
    // }
  },
};
</script>

<style scoped>
.menu {
  /* interpolate-size: allow-keywords; */
  /* transition: 0.5s; */
  align-items: center;
  bottom: 0;
  color: #fff;
  display: flex;
  justify-content: center;
  left: 0;
  padding: 1.7361111111vw;
  pointer-events: none;
  position: fixed;
  width: 100%;
  z-index: 1001;
}

.menu>.float {
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  background: #0d0d0db3;
  border: 1px solid #3e3e3e;
  border-radius: 1.5625vw;
  min-width: 0;
  display: flex;
  flex-direction: column;
  pointer-events: all;
  position: relative;
}

.float-bottom>.inner {
  align-items: center;
  display: inline-flex;
  gap: 1.5rem;
  justify-content: space-between;
  min-width: 100%;
  overflow: visible;
  padding: .5rem;
}

.float-bottom ul {
  align-items: center;
  display: flex;
  white-space: nowrap;
  justify-content: center;
  /* gap: 1.375rem;
    padding-left: 1.125rem; */
  gap: 1.3888888889vw;
  padding-left: 1.4467592593vw;
}

.menu-btn {
  align-items: center;
  background: #08080899;
  border-radius: 1.125rem;
  cursor: pointer;
  display: inline-flex;
  flex-grow: 2;
  flex-wrap: nowrap;
  max-width: 4rem;
  min-height: 4rem;
  min-width: 4rem;
  overflow: hidden;
  position: relative;
  border-radius: 1.0416666667vw;
  min-height: 3.4722222222vw;
  max-width: none;
  min-width: 0;
}

.menu-btn .inner {
  align-items: center;
  color: #fff;
  display: flex;
  flex-wrap: nowrap;
  font: 500 .875rem Moderat, sans-serif;
  justify-content: center;
  padding: .75rem;
  white-space: nowrap;
  width: 100%;
  font-size: .8101851852vw;
  gap: 1.0416666667vw;
  padding: .6944444444vw .6944444444vw .6944444444vw 1.3888888889vw;
}

.menu-btn .inner .text {
  display: block;
  line-height: 1;
}

.menu-btn-icon {
  align-items: center;
  background: #fff;
  border-radius: 50%;
  display: flex;
  height: 2.5rem;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.3148148148vw;
  min-width: 2.3148148148vw;
}

.icon {
  min-width: 50% !important;
}

.menu-active-content {
  display: flex;
  align-items: center;
  margin: 20px;
}

.menu-active-content .inner{
  align-items: center;
  display: flex;
}

.content-label {
  white-space: nowrap;
  font-size: 18px;
  margin-right: 20px;
}

.back-button {
  background: none;
  white-space: nowrap;
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  transition: all .48s cubic-bezier(.36, .33, 0, 1), opacity .24s cubic-bezier(.36, .33, 0, 1);
}
</style>