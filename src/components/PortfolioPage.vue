<script>
import CoverComponent from './CoverComponent.vue';
export default {
    name: "PortfolioPage",
    components:{CoverComponent}
}
</script>
<template>
    <div>
        <CoverComponent />
        <div class="main-content">
            <div id="portfolio">
                <h2>Portfolio</h2>
                <!-- 瀑布流展示作品集 -->
            </div>

            <div id="about">
                <h2>About</h2>
                <!-- 关于页面内容 -->
            </div>

            <div id="blog">
                <h2>Blog</h2>
                <!-- 博客内容 -->
            </div>

            <div id="contact">
                <h2>Contact</h2>
                <!-- 联系信息 -->
            </div>
        </div>
    </div>

</template>



<style>
.main-content {
    padding: 50px;
    width: 100vw;
    height: 200vh;
}
</style>