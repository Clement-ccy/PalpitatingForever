<template>
    <!-- <CoverComponent></CoverComponent> -->
    <main class="what-i-do">
        <!-- 封面 -->
        <section class="cover">
            <div class="container">
                <div class="hello">
                    <span>Palpitating</span>
                    <span>Forever</span>
                </div>
            </div>
            <div class="legendes">
                陈承烨, a fresh-things-exploiter born in 2003 from China.
            </div>
            <div class="spline">
                <img src="../assets/images/cover.jpeg" style="display: block; height: 100%;" />
                <!-- <canvas></canvas> -->
            </div>
        </section>
        <!-- 页面内容 -->
        <section class="intro">
            <div class="wrapper">
                <div class="showreel-container">
                    <div class="showreel">
                        <div class="video-btn">
                            <div class="video-container">
                                <video src="../assets/videos/Dogu.mp4" autoplay playsinline muted loop></video>
                            </div>
                            <button class="video-btn-play" type="button" aria-label="Play the video">
                                <span style="font-weight: 900;">Play Showreel </span>
                                <div class="btn">
                                    <span class="icon">
                                        <svg width="50" height="63" viewBox="0 0 50 63" fill="none" data-v-000e7669=""
                                            data-v-cfe672e9="">
                                            <path
                                                d="M47.916 27.6418C50.6939 29.2456 50.6939 33.255 47.916 34.8587L7.29102 58.3136C4.51323 59.9174 1.04102 57.9128 1.04102 54.7053L1.04102 7.79542C1.04102 4.58792 4.51323 2.58325 7.29102 4.18701L47.916 27.6418Z"
                                                fill="white" data-v-cfe672e9=""></path>
                                        </svg>
                                    </span>
                                </div>

                            </button>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="inner">
                        <div class="text-to-animate">
                            <p>我主要进行数字处理方案和流程体验的设计，能够在符合个人宗旨的条件下进行创意和技术的融合。</p>
                            <p>&nbsp;</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="pf-services">
            <div class="container">
                <div class="headline">
                    <h2 class="tag">
                        <span>我精通的</span>
                    </h2>
                    <p>能够作用于产品和研究的技能</p>
                    <a class="link">
                        <span>了解更多能力细节</span>
                    </a>
                </div>
                <div class="services-list">
                    <!--[-->
                    <div class="service">
                        <a href="/en/what-we-do/service/user-experience">
                            <span>User Experience</span>
                        </a>
                    </div>
                    <div class="service">
                        <a href="/en/what-we-do/service/creative-design">
                            <span>Creative Design</span>
                            </a>
                        </div>
                    <div class="service">
                        <a href="/en/what-we-do/service/web-developement">
                            <span>Web developement</span>
                        </a>
                    </div>
                    <div class="service"><a href="/en/what-we-do/service/extranet-intranet"><span>Extranet /
                                intranet</span>
                            </a>
                        </div>
                    <div class="service">
                        <a href="/en/what-we-do/service/e-commerce">
                        <span>E-commerce</span>
                    </a>
                    </div>
                    <div class="service">
                        <a href="/en/what-we-do/service/data">
                            <span>Data</span>
                        </a>
                    </div>
                    <div class="service">
                        <a href="/en/what-we-do/service/digital-strategy">
                            <span>Digital Strategy</span>
                        </a>
                    </div>
                    <!--]-->
                    <div class="service">
                        <a href="/en/what-we-do/our-expertises">…</a>
                    </div>
                    <div class="services-hover">
                    </div>
                </div>
            </div>
        </section>
        <section class="content-section">
            <h2 class="tag">Section 2 精通</h2>
            <p class="text-to-animate">
                能够增强产品表现的技能 查看能力细节 用户体验 创意设计 网页开发 数据处理
                摄影 剪辑 产品设计 嵌入式设计 元宇宙 AR / VR 建模 渲染 …
            </p>
        </section>
        <section ref="section3" class="content-section">
            <h2 class="tag">Section 3 工作路径</h2>
            <p class="text-to-animate">
                见面->倾听需求->提出疑问->思考->寻找参考->头脑风暴->筛选总结->设计->设计->开发->呈现->现场复现->跟进->总结阶段性成果->支持->维护->迭代
                我工作经历的描述 查看详细
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
                    <input type="checkbox" name="category" value="productDesign" />
                    <div class="checkbox__custom">
                        <span>产品设计</span>
                        <sup>1</sup>
                    </div>
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="category" value="research" />
                    <div class="checkbox__custom">
                        <span>研究</span>
                        <sup>6</sup>
                    </div>
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="category" value="music" />
                    <div class="checkbox__custom">
                        <span>音乐</span>
                        <sup>3</sup>
                    </div>
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="category" value="photograph" />
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
            <p class="text-to-animate">
                从xxx起，在xxxx领域获得了很多奖项 Xxx几次xxx几次 查看详细
            </p>
        </section>
        <section ref="section6" class="content-section">
            <h2>Section 6 合作单位</h2>
            <p class="text-to-animate">
                从xxx起，在xxxx领域获得了很多奖项 Xxx几次xxx几次 查看详细
            </p>
        </section>
        <!-- 其他内容 -->
    </main>
</template>

<script>
// import CoverComponent from '@/components/CoverComponent.vue';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@/js/splitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
export default {
    components: {
        // CoverComponent
    },
    mounted() {
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

        // 创建监听内容进入对象的菜单变换监听器
        // eslint-disable-next-line no-unused-vars
        const menuScrollTrigger = ScrollTrigger.create({
            trigger: ".pf-services",
            start: "top 50%",
            //   endTrigger: "#otherID",
            end: "bottom 50%+=100px",
            // scrub: true,
            onToggle: (self) => {
                if (self.isActive) {
                    this.$emit("activateMenu", "Section 1");
                }
                else {
                    this.$emit("deactivateMenu");
                }
            },
        });
    },
    beforeUnmount() {

    },
    methods: {
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

<style src="../css/WhatIDoPage.css"></style>
