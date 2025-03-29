<template>
    <div :class="['notion-block', block.type]">
        <template v-if="block.type.startsWith('heading')">
            <h :level="parseInt(block.type.slice(-1))">
                {{ getTextContent(block) }}
            </h>
        </template>
        <p v-else>
            <span v-for="(text, index) in block[block.type].rich_text" :key="index">
                <span :style="getTextStyle(text.annotations)">{{ text.plain_text }}</span>
            </span>
        </p>
    </div>
</template>

<script setup>
defineProps({
    block: Object
})

const getTextStyle = (annotations) => ({
    fontWeight: annotations.bold ? '700' : '400',
    fontStyle: annotations.italic ? 'italic' : 'normal',
    textDecoration: annotations.underline ? 'underline' : 'none'
})
</script>