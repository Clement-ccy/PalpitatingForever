<template>
    <section class="wia-intro">
        <!-- <h2 class="tag">年龄 + 座右铭</h2> -->
        <div class="headline" ref="headlineRef"><span class="number">{{ displayAge }}</span></div>
        <div class="main">
            <div class="inner">
                <div class="text-to-animate --big">
                    <p>
                        digital experts making up a team of project managers, designers, front-end and back-end web
                        developers and many other specialties…
                    </p>
                </div>
            </div>
            <a href="/en/who-we-are/we-are-hiring" class="link">
                <span>查看详情</span>
            </a>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const birthDate = new Date('2003-02-13');
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
const m = today.getMonth() - birthDate.getMonth();
if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
}

const displayAge = ref(0);
const headlineRef = ref(null);
let observer = null;
let intervalId = null;
const animationDuration = 1000; // 动画持续时间 (ms)
const frameDuration = 1000 / 60; // 60 FPS
const totalFrames = Math.round(animationDuration / frameDuration);
let currentFrame = 0;

function animateAge() {
    clearInterval(intervalId); // 清除之前的 interval
    currentFrame = 0; // 重置帧
    displayAge.value = 0; // 从 0 开始

    intervalId = setInterval(() => {
        currentFrame++;
        const progress = currentFrame / totalFrames;
        // 使用简单的线性插值，可以换成 ease-out 等效果
        const currentAge = Math.min(Math.ceil(age * progress), age);
        displayAge.value = currentAge;

        if (currentFrame >= totalFrames) {
            clearInterval(intervalId);
            displayAge.value = age; // 确保最终值为准确年龄
        }
    }, frameDuration);
}

onMounted(() => {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 当元素 10% 进入视口时触发
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAge();
                observer.unobserve(entry.target); // 触发后停止观察
            }
        });
    }, options);

    if (headlineRef.value) {
        observer.observe(headlineRef.value);
    }
});

onUnmounted(() => {
    if (observer && headlineRef.value) {
        observer.unobserve(headlineRef.value);
    }
    clearInterval(intervalId); // 清理 interval
});

</script>

<style>
.wia-intro {
    align-items: flex-start;
    display: flex;
}

.wia-intro .headline {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.wia-intro .headline>span {
    font: 400 18.75rem Moderat, sans-serif;
    letter-spacing: -.04em;
    line-height: .9;
    font-size: 27.6041666667vw;
    margin-left: -1.8518518519vw;
}

.wia-intro .main {
    margin-left: auto;
    margin-top: 2.8935185185vw;
    max-width: 54.1666666667vw;
}

.wia-intro .text-to-animate {
    font-size: 3.7037037037vw;
    letter-spacing: -.04em;
    line-height: 1.1;
}

.wia-intro .link {
    display: block;
    display: inline-flex;
    font-size: 1.125rem;
    margin-top: 2.5rem;
    padding-bottom: .3em;
    position: relative;
    font-size: 1.2731481481vw;
    margin-top: 4.6296296296vw;
    padding-bottom: .3em;
}

.wia-intro .link:after {
    border-bottom: .0625rem solid #181717;
    content: "";
    display: block;
    left: 0;
    position: absolute;
    top: 92%;
    transform: scaleX(1);
    transition: transform .42s cubic-bezier(.36, .33, 0, 1);
    width: 100%;
}

.wia-intro .link:hover:after {
    transform: scaleX(0.1);
    /* 悬停状态下缩放为 0 */
}
</style>
