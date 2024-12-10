<template>
    <!-- <CoverComponent></CoverComponent> -->
    <div class="what-i-do">
        <!-- 封面 & ShowReel -->
        <section ref="cover" class="content-section whatido-cover">
            <img src="../assets/image/ye.gif">
        </section>
        <!-- 页面内容 -->
        <section ref="showReel" class="content-section">

        </section>
        <!-- <video src="cover-video.mp4" autoplay muted loop></video> -->
        <section ref="section1" class="content-section">
            <h2 class="tag">Section 1 做的方向简介</h2>
            <p class="text-to-animate">我主要进行数字处理方案和流程体验的设计，能够在符合个人宗旨的条件下进行创意和技术的融合。
            </p>
        </section>
        <section ref="section2" class="content-section">
            <h2 class="tag">Section 2 精通</h2>
            <p class="text-to-animate">能够增强产品表现的技能
                查看能力细节
                用户体验
                创意设计
                网页开发
                数据处理
                摄影
                剪辑
                产品设计
                嵌入式设计
                元宇宙
                AR / VR
                建模
                渲染
                …

            </p>
        </section>
        <section ref="section3" class="content-section">
            <h2 class="tag">Section 3 工作路径</h2>
            <p class="text-to-animate">见面->倾听需求->提出疑问->思考->寻找参考->头脑风暴->筛选总结->设计->设计->开发->呈现->现场复现->跟进->总结阶段性成果->支持->维护->迭代
                我工作经历的描述
                查看详细
            </p>
        </section>
        <section ref="section4" class="content-section">
            <h2 class="tag">Section 4 我的作品</h2>
            <div class="filters-1">
                <button class="checkbox">
                    <div class="checkbox__custom">
                        <span>全部</span>
                    </div>
                </button>
                <label class="checkbox">
                    <input type="checkbox" name="category" value="productDesign">
                    <div class="checkbox__custom">
                        <span>产品设计</span>
                        <sup>1</sup>
                    </div>
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="category" value="research">
                    <div class="checkbox__custom">
                        <span>研究</span>
                        <sup>6</sup>
                    </div>
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="category" value="music">
                    <div class="checkbox__custom">
                        <span>音乐</span>
                        <sup>3</sup>
                    </div>
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="category" value="photograph">
                    <div class="checkbox__custom">
                        <span>摄影</span>
                        <sup>11</sup>
                    </div>
                </label>
            </div>
            <div class="filters-2"></div>
            <div class="works-grid">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </section>
        <section ref="section5" class="content-section">
            <h2>Section 5 我的奖项</h2>
            <p class="text-to-animate">从xxx起，在xxxx领域获得了很多奖项
                Xxx几次xxx几次
                查看详细
            </p>
        </section>
        <section ref="section6" class="content-section">
            <h2>Section 6 合作单位</h2>
            <p class="text-to-animate">从xxx起，在xxxx领域获得了很多奖项
                Xxx几次xxx几次
                查看详细
            </p>
        </section>
        <!-- 其他内容 -->
    </div>
</template>

<script>
// import CoverComponent from '@/components/CoverComponent.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '@/js/splitText';
gsap.registerPlugin(ScrollTrigger, SplitText);
export default {
    components: {
        // CoverComponent
    },
    mounted() {

        const texts = document.querySelectorAll('.text-to-animate');
        
        texts.forEach((text) => {
            new SplitText(text, { type: "chars" })
            // 创建动画
            gsap.fromTo(
                text.querySelectorAll(".aki__char"), // 动画目标
                {
                    opacity: 0, // 初始不透明度
                    y: 50, // 初始位置向下偏移
                },
                {
                    opacity: 1, // 结束时完全可见
                    y: 0, // 最终位置居中
                    duration: 1,
                    stagger: 0.1, // 每个字的动画间隔
                    scrollTrigger: {
                        trigger: text,
                        start: "top 90%", // 当顶部到达视口80%位置时触发
                        end: "top 80%",
                        scrub: true, // 随着滚动进度播放动画
                    },
                }
            );
        });
        const options = {
            root: null,
            threshold: 0.5,
        };
        this.observer = new IntersectionObserver(this.handleIntersect, options);
        this.observer.observe(this.$refs.section1);
    },
    beforeUnmount() {
        this.observer.disconnect();
    },
    methods: {
        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.$emit('activateMenu', 'Section 1');
                } else {
                    this.$emit('deactivateMenu');
                }
            });
        },
    },
};
</script>

<style>
.what-i-do {
    padding: 50px;
}

.content-section {
    width: 100%;
}

.whatido-cover {
    display: flex;
    align-items: center;
    justify-content: center;
}

.text-to-animate{
    display: inline;
    margin-top:300px;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>