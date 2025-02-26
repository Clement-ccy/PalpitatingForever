<template>
    <div class="marquee">
                <div class="marquee-inner">
                    <!-- 原始内容翻倍实现无缝衔接 -->
                    <span>My Works</span>
                    <span>My Works</span>
                    <span>My Works</span>
                    <span>My Works</span>
                    <span>My Works</span>
                </div>
            </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

// 响应式状态
const marqueeInner = ref(null) // DOM引用
let forwardAnim = null
let backwardAnim = null
let activeAnim = null
const lastScrollY = ref(null)
const isScrollingDown = ref(true)

// 初始化跑马灯
const setupMarquee = () => {
    marqueeInner.value = document.querySelector('.marquee-inner')
    if (!marqueeInner.value) return

    // 克隆内容实现无缝滚动
    marqueeInner.value.innerHTML += marqueeInner.value.innerHTML

    // 创建GSAP动画
    forwardAnim = gsap.fromTo(marqueeInner.value,
        {
            xPercent: -50,
        },
        {
            xPercent: 0,
            duration: 20,
            ease: 'none',
            repeat: -1,
            paused: true
        }
    )
    backwardAnim = gsap.fromTo(marqueeInner.value,
        {
            xPercent: 0,
        },
        {
            xPercent: -50,
            duration: 20,
            ease: 'none',
            repeat: -1,
            paused: true
        }
    )
    // 设置初始方向
    activeAnim = forwardAnim
    activeAnim.play()
}

// 滚动处理
const handleScroll = () => {
    const currentScrollY = window.scrollY
    const newDirection = currentScrollY > lastScrollY.value
    lastScrollY.value = currentScrollY

    if (newDirection !== isScrollingDown.value) {
        switchDirection(newDirection)
    }
    isScrollingDown.value = newDirection
}

// 更新滚动方向
const switchDirection = (isDown) => {
    const progress = activeAnim.progress() // 保存当前进度

    activeAnim.pause()

    // 选择新动画
    const newAnim = isDown ? forwardAnim : backwardAnim

    // 同步进度（根据方向调整）
    newAnim.progress(1 - progress)
    newAnim.play()

    activeAnim = newAnim
}

// 生命周期
onMounted(() => {
    setupMarquee()
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    forwardAnim?.kill()
    backwardAnim?.kill()
})
</script>

<style>
.marquee {
    font: 400 20vw Moderat, sans-serif;
    line-height: 1;
    margin-bottom: 2.5rem;
    pointer-events: none;
    position: relative;
    white-space: nowrap;
    font-size: 12.7314814815vw;
    margin-bottom: 3.4722222222vw;
    display: inline-flex;
    align-items: center;
}

.marquee span:after {
    content: "✦";
    display: inline-block;
    font-size: .4em;
    padding: 2.8935185185vw;
    transform: translateY(-20%);
}

.marquee-inner {
    display: inline-flex;
    transform: translateX(-50%);
    transform: translate3d(0,0,0);
}
</style>