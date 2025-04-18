<template>
    <section class="post-container neum-panel">
        <div v-if="isLoading">Loading post...</div>
        <div v-else-if="error" class="error-message">
            Failed to load post: {{ error.message }}
        </div>
        <article v-else-if="postData">
            <h1>{{ postData.title }}</h1>
            <div class="meta">
                <span>{{ formattedDate }}</span>
                <div class="tags" v-if="postData.tags && postData.tags.length">
                    <span v-for="tag in postData.tags" :key="tag" class="tag neum-button">{{ tag }}</span>
                </div>
            </div>

            <NotionRenderer :blocks="blocksData" />
        </article>
        <div v-else>Post not found.</div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { retrieveBlogPage, queryPageBlocks } from '@/utils/notion.js'
import NotionRenderer from '@/components/PostComponents/NotionRenderer.vue'

const route = useRoute()
const postData = ref(null) // Initialize as null
const blocksData = ref([])
const isLoading = ref(true)
const error = ref(null)

const formattedDate = computed(() => {
    if (!postData.value?.createdTime) return ''
    try {
        return new Date(postData.value.createdTime).toLocaleDateString()
    } catch (e) {
        console.error("Error formatting date:", e);
        return postData.value.createdTime; // Fallback to original string
    }
})

onMounted(async () => {
    isLoading.value = true
    error.value = null
    try {
        const pageId = route.params.id
        if (!pageId) {
            throw new Error("No post ID provided in the route.")
        }
        const page = await retrieveBlogPage(pageId)
        // Assuming retrieveBlogPage returns null or throws error if not found
        if (!page) {
             throw new Error("Post not found.");
        }

        // Extract only necessary data if needed, or keep the whole object
        postData.value = page;
        console.log("Post data:", postData.value);

        const blocks = await queryPageBlocks(pageId)
        console.log("Blocks data:", blocks);
        blocksData.value = blocks || [] // Ensure blocksData is an array

    } catch (err) {
        console.error('Failed to load post:', err)
        error.value = err
        postData.value = null; // Clear post data on error
        blocksData.value = []; // Clear blocks data on error
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
.post-container {
    max-width: 800px; /* Keep max-width */
    margin: 2rem auto; /* Keep margin */
    /* Remove padding - handled by neum-panel */
}

.meta {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tags {
    display: flex;
    gap: 0.5rem;
}

.tag {
    /* Remove background, padding, radius - handled by neum-button */
    font-size: 0.8em; /* Keep font-size adjustment */
    /* Adjust neum-button padding if needed via specificity or new class */
    /* Example: padding: 0.1em 0.4em; */
}

.error-message {
    color: red;
    border: 1px solid red;
    padding: 1rem;
    border-radius: 4px;
    background-color: #ffebeb;
}

h1 {
    margin-bottom: 0.5rem;
}
</style>