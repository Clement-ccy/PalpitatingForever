<template>
    <!-- 导航栏 -->
    <nav class="navbar">
        <div class="nav-left">
            <span class="brand">Palpitating-Forever</span>

        </div>
        <div class="nav-right">
            <div class="link-container">
                <router-link v-for="(item, index) in navItems" :key="index" :to="item.path" class="nav-link">
                    {{ item.text }}
                </router-link>
            </div>
            <label class="menu-toggle" for="menu">
                <svg t="1743072726418" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2646">
                    <path
                        d="M170.666667 213.333333h682.666666v85.333334H170.666667V213.333333z m0 512h426.666666v85.333334H170.666667v-85.333334z m0-256h682.666666v85.333334H170.666667v-85.333334z"
                        fill="#ffffff" p-id="2647"></path>
                </svg>
            </label>
            <!-- <span class="language">EN</span> -->
        </div>
    </nav>
</template>

<script>

export default {
    data() {
        return {
            navItems: [
                { text: 'Blog', path: '/blog' },
                { text: 'Photograph', path: '/photograph' },
                { text: 'Music', path: '/music' }
            ],
        }
    }
}
</script>

<style>
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 100;
    mix-blend-mode: difference;
    border-bottom: solid #fff 1px;
    color: #fff;
}

.nav-left {
    display: flex;
    align-items: center;
    padding: 2rem 6rem;
    gap: 3rem;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 3rem;
}

label.menu-toggle {
    position: relative;
    line-height: 0px;
    display: block; /* Keep display block */
    margin-left: 1rem; /* Keep margin */
    padding: 2rem;
    border-left: 1px solid #fff;
    transition: background-color 0.3s ease-in-out;

    .icon {
        width: 2rem;
        height: 2rem;
    }
}

/* Remove hover style - handled by neum-button */
label.menu-toggle:hover {
    background-color: #dddddd93;
}

.brand {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.1em;
}

.link-container {
    display: flex;
    gap: 3rem;
}

.nav-link {
    position: relative;
    text-decoration: none;
    color: inherit;
    font-size: 1rem;
    transition: opacity 0.3s;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: white;
    transition: width 0.3s;
}

.nav-link:hover::after {
    width: 100%;
}
</style>