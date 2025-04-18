<template>
    <section class="wia-cover">
        <div class="wia-cover__container">
            <marqueeComponent class="marquee-title"></marqueeComponent>
            <div class="gallery">
                <div v-for="(_, index) in 9" :key="index" class="gallery-item" :data-index="index + 1">
                    <img :src="`@/assets/images/cover-${index + 1}.jpg`" alt="Cover image" class="gallery-image" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import marqueeComponent from "@/components/StaticComponents/marqueeComponent.vue"
import gsap from 'gsap'
// import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
    components: {
        marqueeComponent,
    },
    data() {
        return{
            cover:'ye'
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger)

        const gallery = document.querySelector('.gallery')
        const items = gsap.utils.toArray('.gallery-item')

        // 设置初始分散布局
        items.forEach((item) => {
            gsap.set(item, {
                width: "110vw",
                height: "110vh",
                opacity: 1
            })
        })
        gsap.set(gallery, {
            gap: "40vw"
        })

        // 创建主轴动画
        const tl = gsap.timeline({
            defaults: {
                ease: "power2.inOut"
            }
        })

        // 同时控制gap和item尺寸
        tl.to(gallery, {
            gap: "1vw", // 最终间距
            duration: 1
        })
            .to(items, {
                width: "32vw",
                height: "32vh",
                duration: 1
            }, "<")
        // 滚动触发器
        ScrollTrigger.create({
            trigger: ".wia-cover",
            start: "top top",
            end: "bottom 50%",
            scrub: 1,
            animation: tl,
            // invalidateOnRefresh: true,
            onUpdate: self => {
                const progress = self.progress
                // 同步控制marquee组件透明度
                gsap.to(".marquee-title", {
                    opacity: 1 - progress * 1.2,
                    y: progress * 100
                })
            }
        })
    },
}
</script>

<style scoped>
.wia-cover {
    height: 300vh;
    padding: 0;
    position: relative;
    width: 100%;
}

.wia-cover__container {
    align-items: center;
    display: flex;
    height: 100vh;
    justify-content: center;
    overflow: hidden;
    position: relative;
    position: sticky;
    top: 0;
    width: 100%;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(3, auto);
    flex: none;
    gap: 1vw;
    width: 100%;
    height: 100%;
    position: relative;
    width: min-content;
    height: min-content;
}

.gallery-item {
    border-radius: 1.5625rem;
    height: 110vh;
    overflow: hidden;
    position: relative;
    transform-origin: center;
    /* transform: scale(1); */
    will-change: transform, opacity;
    /* transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); */
    width: 110vw;
}

.gallery-image {
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 9;
    -o-object-fit: cover;
    object-fit: cover;
    transform: scale(1.1);
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.gallery-item:hover .gallery-image {
    transform: scale(1);
}

.marquee-title {
    transition: opacity 0.3s;
    color: #ffffff;
    font-size: 20vw;
    font-weight: 400;
    left: 0;
    line-height: 1;
    mix-blend-mode: difference;
    pointer-events: none;
    position: absolute;
    text-transform: uppercase;
    top: 50%;
    transform: translate(-10%, -50%);
    white-space: nowrap;
    z-index: 100;
    font-size: 12.7314814815vw;
    transition: opacity 0.3s;
}
</style>