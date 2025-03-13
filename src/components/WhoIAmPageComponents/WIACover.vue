<template>
    <section class="wia-cover">
        <div class="wia-cover__container">
            <marqueeComponent class="marquee-title"></marqueeComponent>
            <div class="gallery">
                
            </div>
        </div>
    </section>
</template>

<script>
import marqueeComponent from "@/components/basicComponents/marqueeComponent.vue"

export default {
    components:{
        marqueeComponent,
    }
}
</script>

<style>
.wia-cover {
    height: 300vh;
    padding: 0;
    position: relative;
    width: 100%;
}

.wia-cover__container {
    align-items: center;
    display: flex;
    height: 100vh;
    justify-content: center;
    overflow: hidden;
    position: relative;
    position: sticky;
    top: 0;
    width: 100%;
}

.wia-cover .marquee-title {
    color: #fff;
    font-size: 20vw;
    font-weight: 400;
    left: 0;
    line-height: 1;
    mix-blend-mode: difference;
    pointer-events: none;
    position: absolute;
    text-transform: uppercase;
    top: 50%;
    transform: translate(-10%, -50%);
    white-space: nowrap;
    z-index: 100;
    font-size: 12.7314814815vw;
}
</style>