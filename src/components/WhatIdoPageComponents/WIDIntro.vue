<template>
    <section class="wid-intro">
        <div class="wrapper">
            <div class="showreel-container">
                <div class="showreel">
                    <div class="video-btn">
                        <div class="video-container">
                            <video src="@/assets/videos/Dogu.mp4" autoplay playsinline muted loop></video>
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
</template>

<script>
// 插件引入
import gsap from "gsap";
import { CustomEase } from "gsap/all";
gsap.registerPlugin(CustomEase);

export default {
    mounted() {
        const showreel = document.querySelector(".showreel-container");
        const wrapper = document.querySelector(".wid-intro .wrapper");
        // const content = document.querySelector(".wid-intro .content");

        const getAnimParams = () => {
            const showreelRect = showreel.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            // const contentRect = content.getBoundingClientRect();

            // const endY1 = contentRect.y - showreelRect.bottom + showreelRect.height * 0.8
            const endX = wrapperRect.right - showreelRect.right;
            const endY = wrapperRect.bottom - showreelRect.bottom + showreelRect.height * 0.8;
            // console.log(wrapperRect.bottom)
            // console.log(showreelRect.bottom)
            // console.log(contentRect.y)
            return {
                // y1: endY1,
                x: endX,
                y: endY,
                // scale: scaleFactor,
                // width: `${scaleFactor * 100}%`,
                // height: `${scaleFactor * 100}%`
            };
        }

        gsap.to(
            ".showreel", // 动画目标
            {
                keyframes: {
                    "0%": { x: 0, y: 0, width:"100%", height:"100%" },
                    "30%": { x: () => getAnimParams().x * 0.3, y: () => getAnimParams().y*0.3, width:"70%", height:"70%"},
                    "80%": { x: () => getAnimParams().x * 0.7, y: () => getAnimParams().y*0.8, width:"30%", height:"30%"},
                    "100%": { x: () => getAnimParams().x, y: () => getAnimParams().y, width:"20%", height:"20%", ease: "power1.out" },
                },
                // x: () => getAnimParams().x,
                // y: () => getAnimParams().y,
                // width: "20%",
                // height: "20%",
                
                scrollTrigger: {
                    trigger: ".wrapper",
                    start: "top top", // 当顶部到达视口80%位置时触发
                    end: "bottom 90%",
                    scrub: true, // 随着滚动进度播放动画
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                },
            }
        );

        // 窗口大小变化时刷新
        // window.addEventListener("resize", () => {
        //     ScrollTrigger.refresh();
        // });
    }
}
</script>

<style>
.wid-intro {
    margin-top: -3.4722222222vw;
    padding-top: 0;
    position: relative;
    z-index: 100;
}

.wid-intro .wrapper {
    position: relative;
}

.wid-intro .wrapper .showreel-container {
    aspect-ratio: 16 / 9;
    position: relative;
    width: 100%;
    height: calc(100vh - 4.16667vw);
    margin-left: -2.0833333333vw;
    max-height: calc(100vh - 4.16667vw);
    width: calc(100% + 4.16667vw) !important;
}

.wid-intro .wrapper .showreel-container .showreel {

    height: 100%;
    width: 100%;
    margin: 0 0 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
}

.wid-intro .showreel-container .showreel .video-btn {
    cursor: pointer;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
}

.wid-intro .showreel-container .showreel .video-container {
    aspect-ratio: 16 / 9;
    background: #181717;
    border-radius: .625rem;
    overflow: hidden;
    position: relative;
    transition: transform .48s cubic-bezier(.36, .33, 0, 1);
    width: 100%;
    height: 100%;
    background: 0;
    border-radius: .5787037037vw;
    transform: none !important;
}

.video-btn .video-container video {
    height: 100%;
    left: 0;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 100%;
}

.wid-intro .showreel-container .showreel .video-btn-play {
    position: absolute;
    right: 0;
    justify-content: center;
    align-items: center;
    display: flex;
    font-weight: 900;
    font-size: .6944444444vw;
    gap: .9259259259vw;
    margin: 1.1574074074vw 0 0 auto;
}

.video-btn-play .btn {
    align-items: center;
    display: flex;
    justify-content: center;
    background: #181717;
    border-radius: 50%;
    position: relative;
    left: 0;
    top: 0;
    /* width: 100%;
    height: 100%; */
    height: 2.3148148148vw;
    min-width: 2.3148148148vw;
}

.video-btn-play .btn .icon {
    display: inline-block;
    aspect-ratio: 1;
    min-width: 33%;
    position: relative;
    z-index: 10;
}

.icon svg {
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    aspect-ratio: .7936507937;
}

.wid-intro .wrapper .content {
    padding-top: 100vh;
    max-width: 58.3333333333vw;
}

.wid-intro .wrapper .content .inner {
    position: relative;
}

.wid-intro .wrapper .content .text-to-animate {
    display: grid;
    grid-gap: 1.2em;
    line-height: 1.7;
    letter-spacing: -.04em;
    /* line-height: 1.1; */
    font-size: 3.22vw;
}
</style>