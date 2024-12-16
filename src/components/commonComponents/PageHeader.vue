<template>
    <header id="Header">
        <div class="header-main">
            <a href="/en" class="brand"></a>
            <div class="header-links">
                <button class="link --contact">
                    <span>Contact me</span>
                </button>
                <a href="mailto:319788356@qq.com" class="link --email --min">319788356@qq.com</a>
            </div>
            <nav class="LangSwitch">
                <ul>
                    <li><a class="link --min" :class="--current" href="/">zh-CN</a></li>
                    <li><a class="link --min" :class="--current" href="/en">en</a></li>
                </ul>
                <div class="mask"></div>
            </nav>
        </div>

    </header>
</template>

<script>
import { gsap } from "gsap";

export default {
    data() {
        return {
            menuState: 'default',
            isActive: true,
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
            this.isActive = true;
            this.animateToActive();
        },
        resetMenu() {
            this.isActive = false;
            this.animateToDefault();
        },
        animateToActive() {
            // 使用 GSAP 实现弹性变形到活动状态
            gsap.to(".menu", { duration: 0.5, height: "80px", ease: "elastic.out(1, 0.5)" });
        },
        animateToDefault() {
            // 使用 GSAP 实现弹性变形回到默认状态
            gsap.to(".menu", { duration: 0.5, height: "60px", ease: "elastic.out(1, 0.5)" });
        },
    },
};
</script>

<style></style>