<template>
    <main class="who-i-am">
        <WIACover />
        <WIAIntro />
        <WIAExperience />
        <WIAInterest />
        <WIAResponsibility />
    </main>
</template>

<script>
import WIACover from "@/components/WhoIAmPageComponents/WIACover.vue";
import WIAIntro from "@/components/WhoIAmPageComponents/WIAIntro.vue";
import WIAExperience from "@/components/WhoIAmPageComponents/WIAExperience.vue";
import WIAInterest from "@/components/WhoIAmPageComponents/WIAInterest.vue";
import WIAResponsibility from "@/components/WhoIAmPageComponents/WIAResponsibility.vue";

// 插件引入
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@/js/splitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

export default {
    components: {
        WIACover,
        WIAIntro,
        WIAExperience,
        WIAInterest,
        WIAResponsibility,
    },
    mounted() {
        // 获取要渲染透明度变化的文字
        const texts = document.querySelectorAll(".text-to-animate");

        texts.forEach((text) => {
            new SplitText(text, { type: "chars" });
            // 创建动画
            gsap.fromTo(
                text.querySelectorAll(".aki__char"), // 动画目标
                {
                    opacity: 0.1, // 初始不透明度
                    y: 5, // 初始位置向下偏移
                },
                {
                    opacity: 1, // 结束时完全可见
                    y: 0, // 最终位置居中
                    duration: 1,
                    stagger: 0.1, // 每个字的动画间隔
                    scrollTrigger: {
                        trigger: text,
                        start: "top 80%", // 当顶部到达视口80%位置时触发
                        end: "top 50%",
                        invalidateOnRefresh: true,
                        scrub: true, // 随着滚动进度播放动画
                    },
                }
            );
        });
    },
};
</script>

<style>
/* .who-i-am {
    padding: 50px;
} */
</style>