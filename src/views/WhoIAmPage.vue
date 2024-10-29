<template>
    <div class="who-i-am">
        <h2>年龄 + 座右铭</h2>
        <div class="timeline">我的成长历程</div>
        <div class="responsibilities">我的社会责任</div>
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