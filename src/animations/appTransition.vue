<!-- eslint-disable no-unused-vars -->
<!-- MyTransition.vue -->
<script>
import { gsap } from "gsap"

// JavaScript 钩子逻辑...
export default {
    // ...
    methods: {
        // 在元素被插入到 DOM 之后的下一帧被调用
        // 用这个来开始进入动画
        onEnter(el, done) {
            gsap.to(el, { duration: 0.5, opacity: 1, ease: "elastic.out(1, 0.5)" });
            // 调用回调函数 done 表示过渡结束
            // 如果与 CSS 结合使用，则这个回调是可选参数
            done()
        },

        onLeave(el, done) {

            // 调用回调函数 done 表示过渡结束
            // 如果与 CSS 结合使用，则这个回调是可选参数
            done()
        },
    }
}
</script>

<template>
    <!-- 包装内置的 Transition 组件 -->
    <Transition name="universal-transition" @enter="onEnter" @leave="onLeave" :css="false">
        <slot></slot> <!-- 向内传递插槽内容 -->
    </Transition>
</template>

<style>
/*
  必要的 CSS...
  注意：避免在这里使用 <style scoped>
  因为那不会应用到插槽内容上
*/
</style>