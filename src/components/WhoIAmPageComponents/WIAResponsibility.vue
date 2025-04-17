<template>
    <section class="wia-responsibility">
        <div class="content-wrapper">
            <h2 class="tag">
                我的社会责任
            </h2>
            <div class="sdg-grid">
                <div v-for="(item, index) in sdgItems" :key="index" class="sdg-card" :data-category="item.category"
                    @mouseenter="handleCardHover(index)" @mouseleave="handleCardLeave(index)">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="icon-wrapper">
                                <i class="sdg-icon" :class="item.icon"></i>
                            </div>
                            <h3 class="title">{{ item.title }}</h3>
                        </div>
                        <div class="card-back">
                            <p class="description">{{ item.description }}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="glow-effect"></div>
                </div>
            </div>
        </div>

        <div class="floating-particles"></div>
    </section>
</template>

<script>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
    data() {
        return {
            sdgItems: [
                {
                    title: '消除贫困',
                    icon: 'icon-poverty',
                    description: '在全球范围内消除一切形式的贫困...',
                    progress: 65,
                    category: 'social'
                },
                {
                    title: '消除贫困',
                    icon: 'icon-poverty',
                    description: '在全球范围内消除一切形式的贫困...',
                    progress: 65,
                    category: 'social'
                },
                {
                    title: '消除贫困',
                    icon: 'icon-poverty',
                    description: '在全球范围内消除一切形式的贫困...',
                    progress: 65,
                    category: 'social'
                },
                {
                    title: '消除贫困',
                    icon: 'icon-poverty',
                    description: '在全球范围内消除一切形式的贫困...',
                    progress: 65,
                    category: 'social'
                },
                {
                    title: '消除贫困',
                    icon: 'icon-poverty',
                    description: '在全球范围内消除一切形式的贫困...',
                    progress: 65,
                    category: 'social'
                },
                {
                    title: '消除贫困',
                    icon: 'icon-poverty',
                    description: '在全球范围内消除一切形式的贫困...',
                    progress: 65,
                    category: 'social'
                },
            ]
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger)

        // 卡片入场动画
        gsap.utils.toArray('.sdg-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 95%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                scale: 0.9,
                duration: 0.48,
                delay: i * 0.1,
                ease: 'back.out(1.7)'
            })
        })
    },
    methods: {
        handleCardHover(index) {
            const tl = gsap.timeline()
            tl.to(`.sdg-card:nth-child(${index + 1}) .card-inner`, {
                rotateY: 180,
                duration: 0.6,
                ease: 'power2.inOut'
            })
                .to(`.sdg-card:nth-child(${index + 1}) .glow-effect`, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4
                }, "<")
        },
        handleCardLeave(index) {
            const tl = gsap.timeline()
            tl.to(`.sdg-card:nth-child(${index + 1}) .card-inner`, {
                rotateY: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            })
                .to(`.sdg-card:nth-child(${index + 1}) .glow-effect`, {
                    opacity: 0,
                    scale: 0,
                    duration: 0.4
                }, "<")
        }
    }
}
</script>

<style scoped>
.wia-responsibility {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(180deg, #181717, #1d1d1d);
}

.tag {
    text-align: center;
    margin-bottom: 4rem;
    color: white;
    perspective: 1000px;
}

.tag::before{
    background: #ffffff;
}

.sdg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.sdg-card {
    position: relative;
    height: 350px;
    perspective: 1000px;
    transform-style: preserve-3d;
    cursor: pointer;
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    /* transition: transform 0.6s; */
    transform-style: preserve-3d;
}

.card-front,
.card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.01);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    overflow: hidden;
}

.card-back {
    transform: rotateY(180deg);
}

.icon-wrapper {
    width: 80px;
    height: 80px;
    margin: 2rem auto;
    background: rgba(0, 180, 216, 0.2);
    border-radius: 50%;
    display: grid;
    place-items: center;
}

.sdg-icon {
    font-size: 2.5rem;
    color: #00b4d8;
}

.title {
    color: white;
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.6;
}

.progress-bar {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.progress-fill {
    height: 100%;
    background: #00b4d8;
    border-radius: 2px;
    transition: width 0.5s ease;
}

.glow-effect {
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
            rgba(0, 180, 216, 0.3) 0%,
            rgba(0, 180, 216, 0) 70%);
    opacity: 0;
    transform: scale(0.5);
    pointer-events: none;
}

.floating-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    background: url('@/assets/images/pieces.png');
    animation: float 40s linear infinite;
}

@keyframes float {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 1000px 1000px;
    }
}

@media (max-width: 768px) {
    .sdg-grid {
        grid-template-columns: 1fr;
    }

    .tag {
        font-size: 2.5rem;
    }
}
</style>