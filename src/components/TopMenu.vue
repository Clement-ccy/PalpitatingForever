<template>
  <nav class="top-menu" :style="{ transform: topMenuTransform }">
    <ul>
      <span style="margin-right: 30vw">PalpitatingForever</span>
      <li><a @click="goto('/portfolio')">Portfolio</a></li>
      <li><a @click="goto('/about')">About</a></li>
      <li><a @click="goto('/blog')">Blog</a></li>
      <li><a @click="goto('/contact')">Contact</a></li>
    </ul>
    <hr />
  </nav>
</template>

<script>
export default {
  name: "TopMenu",
  data() {
    return {
      ifportfolio: true,
      topMenuTransform: "translateY(-100%)",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (this.ifportfolio === true) {
        if (window.scrollY > 200) {
          this.topMenuTransform = "translateY(0)";
        } else {
          this.topMenuTransform = "translateY(-100%)";
        }
      }
      else {
        this.topMenuTransform = "translateY(0)";
      }

    },
    goto(url) {
      this.$router.push(url);
      if (url === "/portfolio") {
        this.ifportfolio = true;
        this.topMenuTransform = "translateY(-100%)";
      }
      else {
        this.ifportfolio = false;
      }
    },
  },
};
</script>

<style scoped>
.top-menu {
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: transform 0.5s ease-in-out;
  backdrop-filter: blur(3px);
}

.top-menu ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  text-align: center;
}

.top-menu li {
  display: inline-block;
  margin: 0 10px;
}

.top-menu span {
  font-size: 1.333rem;
}

.top-menu a {
  color: var(--c-text-selected);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease-in-out;
}

.top-menu a:hover {
  color: var(--c-red);
}

hr {
  width: 90vw;
  align-self: center;
  margin-top: 1rem;
}
</style>
