<!-- eslint-disable no-unused-vars -->
<!-- MyTransition.vue -->
<script>
import { gsap } from "gsap"

// JavaScript 钩子逻辑...
export default {
    // ...
    methods: {
        // 在元素被插入到 DOM 之前被调用
        // 用这个来设置元素的 "enter-from" 状态
        onBeforeEnter(el) { },

        // 在元素被插入到 DOM 之后的下一帧被调用
        // 用这个来开始进入动画
        onEnter(el, done) {
            gsap.to(el, { duration: 0.5, opacity: 1, ease: "elastic.out(1, 0.5)" });
            // 调用回调函数 done 表示过渡结束
            // 如果与 CSS 结合使用，则这个回调是可选参数
            done()
        },

        // 当进入过渡完成时调用。
        onAfterEnter(el) { },

        // 当进入过渡在完成之前被取消时调用
        onEnterCancelled(el) { },

        // 在 leave 钩子之前调用
        // 大多数时候，你应该只会用到 leave 钩子
        onBeforeLeave(el) { },

        // 在离开过渡开始时调用
        // 用这个来开始离开动画
        onLeave(el, done) {

            // 调用回调函数 done 表示过渡结束
            // 如果与 CSS 结合使用，则这个回调是可选参数
            done()
        },

        // 在离开过渡完成、
        // 且元素已从 DOM 中移除时调用
        onAfterLeave(el) { },

        // 仅在 v-show 过渡中可用
        onLeaveCancelled(el) { }
    }
}
</script>

<template>
    <!-- 包装内置的 Transition 组件 -->
    <Transition name="universal-transition" @before-enter="onBeforeEnter" @enter="onEnter" @after-enter="onAfterEnter"
        @enter-cancelled="onEnterCancelled" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave"
        @leave-cancelled="onLeaveCancelled" :css="false">
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