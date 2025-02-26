<template>
    <main class="what-i-do">
        <!-- 封面 -->
        <WIDCover></WIDCover>
        <!-- 简介 -->
        <WIDIntro></WIDIntro>
        <!-- 能力 -->
        <WIDServices></WIDServices>
        <!-- 工作方式 -->
        <WIDApproach></WIDApproach>
        <!-- 我的作品 -->
        <WIDWorks></WIDWorks>
        <!-- 我的奖项 -->
        <WIDAwards></WIDAwards>
        <!-- 其他内容 -->
    </main>
</template>

<script>
// 页内组件引入
import WIDCover from '@/components/WhatIDoPageComponents/WIDCover.vue';
import WIDIntro from '@/components/WhatIDoPageComponents/WIDIntro.vue';
import WIDServices from '@/components/WhatIDoPageComponents/WIDServices.vue';
import WIDApproach from '@/components/WhatIDoPageComponents/WIDApproach.vue';
import WIDWorks from '@/components/WhatIDoPageComponents/WIDWorks.vue';
import WIDAwards from '@/components/WhatIDoPageComponents/WIDAwards.vue';
// 插件引入
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@/js/splitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
export default {
    components: {
        // CoverComponent
        WIDCover,
        WIDIntro,
        WIDServices,
        WIDApproach,
        WIDWorks,
        WIDAwards,
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
                        scrub: true, // 随着滚动进度播放动画
                    },
                }
            );
        });
        this.createMenuChangeTrigger(".pf-services","我精通的");
        this.createMenuChangeTrigger(".pf-approach","我的工作路径");
    },
    beforeUnmount() {

    },
    methods: {
        createMenuChangeTrigger(trigger, label) {
            // 创建监听内容进入对象的菜单变换监听器
            // eslint-disable-next-line no-unused-vars
            const menuScrollTrigger = ScrollTrigger.create({
                trigger: trigger,
                start: "top 50%",
                //   endTrigger: "#otherID",
                end: "bottom 50%",
                // scrub: true,
                onToggle: (self) => {
                    if (self.isActive) {
                        this.$emit("activateMenu", label);
                    }
                    else {
                        this.$emit("deactivateMenu");
                    }
                },
            });
        }

        // handleIntersect(entries) {
        //   entries.forEach((entry) => {
        //     if (entry.isIntersecting) {
        //       this.$emit("activateMenu", "Section 1");
        //     } else {
        //       this.$emit("deactivateMenu");
        //     }
        //   });
        // },
    },
};
</script>

<style>
section {
    width: 100%;
    min-height: 100vh;
    padding: 11.5740740741vw 4.1666666667vw;
}

.text-to-animate {
    display: inline;
    margin-top: 300px;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>