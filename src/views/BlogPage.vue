<template>
    <div class="blog-sidebar">
        <input type="text" placeholder="搜索..." v-model="searchTerm" />
        <ul>
            <li v-for="post in filteredPosts" :key="post.id">{{ post.title }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchTerm: '',
            posts: [
                { id: 1, title: '文章 1' },
                { id: 2, title: '文章 2' },
            ],
        };
    },
    computed: {
        filteredPosts() {
            return this.posts.filter((post) =>
                post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        },
    },
};
</script>

<style>
.blog-sidebar {
    width: 250px;
    padding: 20px;
}
</style>