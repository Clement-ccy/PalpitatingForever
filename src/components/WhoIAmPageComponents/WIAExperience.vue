<template>
    <section class="wia-experience">
        
        <div class="horizontal-container">
            <h2 class="tag">我的成长历程</h2>
            <div class="horizontal-scroll">
                
                <!-- 每个时间节点 -->
                <div v-for="(item, index) in timeline" :key="index" class="timeline-panel">
                    <div class="image-container">
                        <img :src="item.image" :alt="item.year" class="background-image">
                    </div>
                    <div class="content" :class="['content--' + (index % 2 === 0 ? 'left' : 'right')]">
                        <div class="text-wrapper">
                            <h3 class="year">{{ item.year }}</h3>
                            <p class="event">{{ item.event }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
    data() {
        return {
            timeline: [
                { year: '2003', event: 'Born in Shanghai', image: 'src/assets/images/2003.png' },
                { year: '2009', event: 'Started primary school', image: 'src/assets/images/2009.jpg' },
                { year: '2015', event: 'Entered middle school', image: 'src/assets/images/2015.jpg' },
                { year: '2018', event: 'Graduated high school', image: 'src/assets/images/2018.png' },
                { year: '2021', event: 'University enrollment', image: 'src/assets/images/2021.png' }
            ]
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger)

        // 横向滚动系统
        const panels = gsap.utils.toArray('.timeline-panel')
        const container = document.querySelector('.horizontal-scroll')

        // 设置容器宽度
        gsap.set(container, {
            width: panels.length * 100 + 'vw'
        })

        // 主滚动时间轴
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.horizontal-container',
                start: 'top top',
                end: () => "+=" + (container.offsetWidth - window.innerWidth),
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        })

        tl.to(container, {
            x: () => -(container.offsetWidth - window.innerWidth),
            ease: 'none'
        })

        // 文字动画
        panels.forEach((panel, i) => {
            const content = panel.querySelector('.content')
            const direction = i % 2 === 0 ? -100 : 100

            gsap.from(content, {
                x: direction,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: tl,
                    start: 'left center',
                    end: 'right center',
                    toggleActions: 'play none none reverse'
                }
            })
        })
    }
}
</script>

<style scoped>
.wia-experience {
    position: relative;
    padding: 0;
    /* height: 100vh; */
}

.tag {
    position: fixed;
    top: 10%;
    left: 10%;
    z-index: 10;
    color: white;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.horizontal-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.horizontal-scroll {
    display: flex;
    height: 100vh;
    /* will-change: transform; */
}

.timeline-panel {
    position: relative;
    flex: 0 0 100vw;
    height: 100vh;
}

.image-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.6);
    transform: scale(1.1);
    transition: filter 0.6s, transform 0.6s;
}

.content {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40%;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    z-index: 2;
}

.content--left {
    left: 10%;
}

.content--right {
    right: 10%;
}

.year {
    font-size: 4rem;
    color: #fff;
    margin-bottom: 1rem;
}

.event {
    font-size: 1.5rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
}

/* 响应式调整 */
@media (max-width: 768px) {
    .content {
        width: 80%;
        left: 10% !important;
        right: auto !important;
    }

    .year {
        font-size: 2.5rem;
    }

    .event {
        font-size: 1.2rem;
    }
}
</style>