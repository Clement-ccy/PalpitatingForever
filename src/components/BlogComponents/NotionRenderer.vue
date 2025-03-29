<template>
    <div class="notion-renderer">
        <component v-for="block in blocks" :is="getComponent(block.type)" :key="block.id" :block="block" />
    </div>
</template>

<script setup>
import TextBlock from './blocks/TextBlock.vue'
import ImageBlock from './blocks/ImageBlock.vue'
import CodeBlock from './blocks/CodeBlock.vue'
// 导入其他block组件...

// eslint-disable-next-line no-unused-vars
const props = defineProps({
    blocks: Array
})

const getComponent = (type) => {
    const components = {
        paragraph: TextBlock,
        heading_1: TextBlock,
        heading_2: TextBlock,
        image: ImageBlock,
        code: CodeBlock,
        // 添加更多类型映射
    }
    return components[type] || TextBlock
}
</script>