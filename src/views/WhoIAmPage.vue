<template>
    <div class="who-i-am">
        <section ref="section1" class="content-section">
            <h2>Section 1 年龄 + 座右铭</h2>
            <p style="margin: 500px 300px;">一些关于项目方向的文字介绍
                封面
                做的方向简介+视频
                asdmvj
                做事流程
                我的作品
                曾合作单位
            </p>
        </section>
        <section ref="section2" class="content-section timeline">
            <h2>Section 2 我的成长历程</h2>
            <p style="margin: 500px 300px;">一些关于项目方向的文字介绍
                asdasf
                ndsaj
                能力点
                做事流程
                我的作品
                曾合作单位
            </p>
        </section>
        <section ref="section3" class="content-section responsibilities">
            <h2>Section 3 我的社会责任</h2>
            <p style="margin: 500px 300px;">一些关于项目方向的文字介绍
                封面
                做的方向简介+视频
                能力点
                asdlkn
                vmdufhg
                曾合作单位
            </p>
        </section>
    </div>
</template>

<script>
import { gsap } from "gsap";

export default {
    mounted() {
        gsap.from(".timeline", { opacity: 0, x: -100, duration: 1 });
    },
};
</script>

<style>
.who-i-am {
    padding: 50px;
}
</style>