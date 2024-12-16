<template>
  <div class="menu">
    <div class="float"></div>
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
    changeContent(page) {
      this.$emit('changeMenu', page);
    },
    activateMenu(label) {
      this.currentLabel = label;

      // 使用 GSAP 实现弹性变形到活动状态
      gsap.to(".menu", {
        duration: 0.5,
        width: "calc-size(auto)",
        ease: "elastic.out(1, 0.5)",
        onStart: () => {
          this.menuState = "breadCrumb"
        }
      });
    },
    resetMenu() {
      this.menuState = "default"

      // 使用 GSAP 实现弹性变形回到默认状态
      gsap.to(".menu", {
        duration: 0.5,
        width: "calc-size(auto)",
        ease: "elastic.out(1, 0.5)"
      });
    },
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