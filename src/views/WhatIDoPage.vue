<template>
    <div class="what-i-do">
        <!-- 页面内容 -->
        <!-- <video src="cover-video.mp4" autoplay muted loop></video> -->
        <section ref="section1" class="content-section">
            <h2>Section 1 做的方向简介</h2>
            <p>一些关于项目方向的文字介绍
                封面
                做的方向简介+视频
                能力点
                做事流程
                我的作品
                曾合作单位
            </p>
        </section>
        <section ref="section2" class="content-section">
            <h2>Section 2 做的方向简介</h2>
            <p>一些关于项目方向的文字介绍
                封面
                做的方向简介+视频
                能力点
                做事流程
                我的作品
                曾合作单位
            </p>
        </section>
        <section ref="section3" class="content-section">
            <h2>Section 3 做的方向简介</h2>
            <p>一些关于项目方向的文字介绍
                封面
                做的方向简介+视频
                能力点
                做事流程
                我的作品
                曾合作单位
            </p>
        </section>
        <!-- 其他内容 -->
    </div>
</template>

<script>
export default {
    mounted() {
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
    position: relative;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>