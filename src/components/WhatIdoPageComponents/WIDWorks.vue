<template>
    <section class="wid-work">
        <div class="headline">
            <h2 class="tag"><span>我的作品</span></h2>
            <marqueeComponent></marqueeComponent>
        </div>

        <div class="filters-1" v-if="loaded">
            <button class="checkbox" @click="selectAll">
                <div class="checkbox__custom" :class="{ '--checked': selectedCategories.length === 0 }">
                    <span>全部</span>
                    <sup>{{ totalCount }}</sup>
                </div>
            </button>
            <label class="checkbox" v-for="category in categories" :key="category.value">
                <input type="checkbox" v-model="selectedCategories" :value="category.value" hidden>
                <div class="checkbox__custom" :class="{ '--checked': selectedCategories.includes(category.value) }">
                    <span>{{ category.name }}</span>
                    <sup>{{ category.count }}</sup>
                </div>
            </label>
        </div>

        <div class="projects-grid" v-if="loaded">
            <div>
                <div v-for="article in filteredArticles" :key="article.id" class="projects-grid-item">
                    <a :href="article.url" class="project-thumb-preview" target="_blank">
                        <div class="cover">
                            <img :src="article.cover" :alt="article.title" loading="lazy">
                        </div>
                        <h3 class="title">{{ article.title }}</h3>
                        <div class="tags">
                            <ul class="industries">
                                <li v-for="industry in article.industries" :key="industry">{{ industry }}</li>
                            </ul>
                            <div class="separator" v-if="article.industries.length && article.categories.length">✦
                            </div>
                            <ul class="categories">
                                <li v-for="category in article.categories" :key="category">{{ category }}</li>
                            </ul>
                        </div>
                    </a>
                </div>
            </div>
            <div></div>
            <div></div>
        </div>

        <div v-else class="loading">Loading...</div>
    </section>
</template>

<script>
import marqueeComponent from '../basicComponents/marqueeComponent.vue'

export default {
    components: {
        marqueeComponent,
    },
    data() {
        return {
            loaded: false,
            allArticles: [],
            categories: [],
            selectedCategories: [],
            totalCount: 0
        }
    },
    computed: {
        filteredArticles() {
            if (!this.selectedCategories.length) return this.allArticles
            return this.allArticles.filter(article =>
                article.categories.some(cat => this.selectedCategories.includes(cat))
            )
        }
    },
    async created() {
        await this.fetchNotionData()
        this.calculateCategories()
        this.loaded = true
    },
    methods: {
        async fetchNotionData() {
            try {
                let hasMore = true
                let nextCursor = null

                while (hasMore) {
                    const response = await fetch(`/notion-api/v1/databases/${import.meta.env.VITE_DATABASE_ID}/query`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: nextCursor ? JSON.stringify({ start_cursor: nextCursor }) : null
                    })

                    const data = await response.json()
                    this.processResults(data.results)

                    hasMore = data.has_more
                    nextCursor = data.next_cursor
                }
            } catch (error) {
                console.error('Error fetching Notion data:', error)
            }
        },

        processResults(results) {
            results.forEach(page => {
                const properties = page.properties

                // 处理标题
                const title = properties.Name?.title?.[0]?.plain_text || 'Untitled'

                // 处理分类
                const category = properties.Categories?.select?.name
                    ? [properties.Categories.select.name]
                    : []
                // （添加标准化转换）
                // const rawCategory = properties.Categories?.select?.name || ''
                // const category = rawCategory
                //     ? [rawCategory.toLowerCase().replace(/\s+/g, '')]
                //     : []

                // 处理行业（注意字段名称拼写检查）
                const industry = properties.Industries?.select?.name
                    ? [properties.Industries.select.name]
                    : []

                const article = {
                    id: page.id,
                    title: title,
                    cover: this.getCoverImage(page.cover),
                    categories: category,
                    industries: industry,
                    url: page.url
                }

                this.allArticles.push(article)
            })
        },

        getCoverImage(cover) {
            if (!cover) return 'https://fakeimg.pl/540x300'
            return cover.type === 'external'
                ? cover.external.url
                : cover.file.url
        },

        calculateCategories() {
            const categoryMap = new Map()

            this.allArticles.forEach(article => {
                article.categories.forEach(cat => {
                    const count = categoryMap.get(cat) || 0
                    categoryMap.set(cat, count + 1)
                })
            })

            this.categories = Array.from(categoryMap).map(([name, count]) => ({
                name,
                value: name,
                // value: name.toLowerCase().replace(/\s+/g, ''),  // 添加标准化
                count
            }))

            this.totalCount = this.allArticles.length
        },

        selectAll() {
            this.selectedCategories = []
        }
    }
}
</script>

<style scoped>
.wid-work {
    background: #181717;
    color: #fff;
}

.tag:before {
    background-color: #fff;
}

.wid-work .filters-1 {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: .6944444444vw 2.8935185185vw;
    padding: 2.8935185185vw 0;
}

.wid-work .filters-1 .checkbox {
    white-space: nowrap;
    cursor: pointer;
    position: relative;
}

.checkbox input {
    height: 100%;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
}

.checkbox__custom {
    align-items: center;
    display: flex;
    gap: .625rem;
    opacity: .4;
    position: relative;
    transition: opacity .42s cubic-bezier(.36, .33, 0, 1);
    gap: .5787037037vw;
}

.checkbox__custom:before {
    border: .1rem solid #181717;
    border-radius: 50%;
    content: "";
    display: block;
    border-width: .1157407407vw;
    height: .6944444444vw;
    min-width: .6944444444vw;
    border-color: #fff;
    transition: background .24s cubic-bezier(.36, .33, 0, 1);
}

.checkbox__custom:before:hover {
    background-color: #fff;
}

.checkbox input:checked+.checkbox__custom,
.checkbox .checkbox__custom.--checked,
html:not(.--touch) .checkbox:hover .checkbox__custom {
    opacity: 1;
}

.checkbox input:checked+.checkbox__custom:before,
.checkbox .checkbox__custom.--checked:before {
    background: #fff;
}

.checkbox span {
    font-size: 1.3310185185vw;
}

.checkbox sup {
    align-self: flex-start;
    margin-left: -.25em;
    font-size: .5em;
}

.wid-work .projects-grid {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
}

.wid-work .projects-grid>* {
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 2.8935185185vw;
}

.wid-work .projects-grid .projects-grid-item {
    min-width: 100%;
    transition: opacity 1.2scubic-bezier(.36, .33, 0, 1);
}

.project-thumb-preview {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    line-height: 1;
    max-width: 15.3125rem;
    width: 100%;
    font-size: 1.1574074074vw;
}

.projects-grid .project-thumb-preview {
    max-width: 100%;
}

.project-thumb-preview .cover {
    aspect-ratio: 1.4;
    background: #f4f4f4;
    border-radius: .625rem;
    margin-bottom: 1.25rem;
    overflow: hidden;
    position: relative;
    transition: transform .48s cubic-bezier(.36, .33, 0, 1);
    width: 100%;
    margin-bottom: 1.1574074074vw;
    background: #0b0b0b;
    aspect-ratio: 540 / 300;
}

.project-thumb-preview .cover img {
    height: 100%;
    left: 0;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    top: 0;
    transition: opacity .42scubic-bezier(.36, .33, 0, 1);
    width: 100%;
}

.project-thumb-preview .title {
    font-size: 1.5rem;
    font-weight: 400;
    font-size: 1.6203703704vw;
}

.project-thumb-preview .tags {
    align-items: center;
    display: flex;
    font-size: .9375rem;
    gap: .4375rem;
    opacity: .5;
    font-size: 1.2731481481vw;
    gap: .4050925926vw;
}

.project-thumb-preview .tags ul {
    align-items: center;
    display: inline-flex;
    gap: .4375rem;
    margin: .4375rem 0 .3125rem;
}
</style>