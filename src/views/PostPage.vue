<template>
    <section class="post-container">
        <h1>{{ postData.title }}</h1>
        <div class="meta">
            <span>{{ formatDate(postData.created_time) }}</span>
            <div class="tags">
                <span v-for="tag in postData.tags" :key="tag">{{ tag }}</span>
            </div>
        </div>

        <NotionRenderer :blocks="blocksData" />
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPage } from '@/utils/notion'
import NotionRenderer from '@/components/BlogComponents/NotionRenderer.vue'

const route = useRoute()
const postData = ref({})
const blocksData = ref([])

onMounted(async () => {
    const { page, blocks } = await getPage(route.params.id)
    postData.value = page
    blocksData.value = blocks.results
})
</script>