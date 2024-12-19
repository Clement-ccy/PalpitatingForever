<template>
  <div ref="menu" class="menu">
    <div class="float">
      
    </div>
    <div v-if="menuState === 'default'" class="menu-buttons">
      <button @click="changeContent('/whatido')">What I Do</button>
      <button @click="changeContent('/whoiam')">Who I Am</button>
      <button @click="changeContent('/blog')">Blog</button>
    </div>
    <div v-else-if="menuState === 'breadCrumb'" class="menu-active-content">
      <span class="content-label">{{ currentLabel }}</span>
      <button @click="resetMenu()" class="back-button">返回</button>
    </div>
    <div v-else-if="menuState === 'contact'" class="menu-active-content">
      <span class="content-label">{{ currentLabel }}</span>
      <button @click="resetMenu()" class="back-button">返回</button>
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
    resetMenu() {
      this.menuState = 'default';
    },
    activateMenu(label) {
      this.currentLabel = label;
      // 使用 GSAP 实现弹性变形到活动状态
      gsap.fromTo(".menu", {
        width: this.$refs.menu.offsetWidth + 'px',
        onComplete: () => {
          this.menuState = "breadCrumb"
        }
      },
      {
        width: 'auto',
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
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

<style>
.menu {
  /* interpolate-size: allow-keywords; */
  /* transition: 0.5s; */
  position: fixed;
  z-index: 99999;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  color: rgb(184, 53, 53);
  overflow: hidden;
  padding: 1.7361111111vw;
  height: 60px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-buttons {
  display: flex;
}

.menu-active-content {
  display: flex;
  align-items: center;
  margin:20px;
}

.content-label {
  font-size: 18px;
  margin-right: 20px;
}

.back-button {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
}

button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin: 0 15px;
}

button:hover {
  text-decoration: underline;
}
</style>