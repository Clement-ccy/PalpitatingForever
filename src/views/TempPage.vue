<template>
    <div>
        <div ref="box" class="box" :class="currentState"></div>
        <button @click="toggleState">Toggle State</button>
    </div>
</template>

<script>
import { ref } from 'vue';
import { gsap } from 'gsap';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 进入页面的动画
            gsap.from(vm.$el, { opacity: 0, yPercent:100, duration: 1 })
        })
    },
    beforeRouteLeave(to, from, next) {
        // 离开页面的动画
        gsap.to(this.$el, { opacity: 0, yPercent:-100, duration: 1, onComplete: next })
    },
    setup() {
        const box = ref(null);
        const states = ['state1', 'state2', 'state3'];
        const currentState = ref(states[0]);
        
        const toggleState = () => {
            const currentIndex = states.indexOf(currentState.value);
            const nextIndex = (currentIndex + 1) % states.length;
            const nextState = states[nextIndex];

            // GSAP 动画
            gsap.to(box.value, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    currentState.value = nextState;
                    gsap.to(box.value, {
                        opacity: 1,
                        duration: 0.5,
                    });
                },
            });
        };

        return {
            box,
            currentState,
            toggleState,
        };
    },
};
</script>

<style>
.box {
    width: 100px;
    height: 100px;
    transition: background-color 0.5s;
}

.state1 {
    background-color: red;
}

.state2 {
    background-color: green;
}

.state3 {
    background-color: blue;
}
</style>