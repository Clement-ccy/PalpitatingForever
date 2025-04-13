<template>
    <div class="loading-page">
        <div class="loader"></div>
    </div>
</template>

<script>
import { gsap } from "gsap";

export default {
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         // 进入页面的动画
    //         gsap.from(vm.$el, { opacity: 0, duration: 1 })
    //     })
    // },
    // beforeRouteLeave(to, from, next) {
    //     // 离开页面的动画
    //     gsap.to(this.$el, { opacity: 0, yPercent:-100, duration: 1, onComplete: next })
    // },
    mounted() {
        gsap.to(".loader", {
            duration: 2,
            width: "100%",
            ease: "power2.out",
            onComplete: () => {
                gsap.to(".loading-page", {
                    duration: 0.5,
                    yPercent: -100,
                    opacity: 0,
                    ease: "power2.inOut",
                    onComplete: () => {
                        this.$emit('loadOver', '/');
                        this.$emit('setMenuState','true')
                    }
                })
            }
        });
    },
};
</script>

<style>
.loading-page {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    z-index: 9999;
}

.loader {
    width: 0;
    height: 5px;
    background-color: #fff;
}
</style>