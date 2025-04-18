<template>
    <header id="Header">
        <div class="main">
            <a href="/en" class="brand">
                <div class="brand-avatar">
                    
                </div>
                <div class="brand-clement">
                    <span>Palpitating Forever</span>
                </div>
            </a>
            <div class="links">
                <button class="link --contact">
                    <span>Contact me</span>
                    <div class="icons">
                        <svg data-v-f7929264="" width="8" height="7" viewBox="0 0 8 7" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path data-v-f7929264="" d="M4.09091 0.5L7 3.5M7 3.5L4.09091 6.5M7 3.5H1" stroke="white"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <!-- <svg data-v-f7929264="" width="8" height="7" viewBox="0 0 8 7" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path data-v-f7929264="" d="M4.09091 0.5L7 3.5M7 3.5L4.09091 6.5M7 3.5H1" stroke="white"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg> -->
                    </div>
                </button>
                <a href="mailto:319788356@qq.com" class="link --email --min">
                    <span>319788356@qq.com</span>
                </a>
            </div>
            <nav class="LangSwitch">
                <ul>
                    <li><a class="link --min" :class="{ '--current': isZHCN }" href="/">zh-CN</a></li>
                    <li><a class="link --min" :class="{ '--current': !isZHCN }" href="/en">en</a></li>
                </ul>
                <div class="mask"></div>
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            isZHCN: true
        }
    }
}
</script>

<style>
header {
    left: 0;
    mix-blend-mode: difference;
    padding: 3.125rem 1.5625rem 1.25rem;
    pointer-events: none;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1001;
    padding: 2.8935185185vw 4.1666666667vw;
}

header>.main {
    align-items: center;
    display: flex;
    gap: 3.125rem;
    justify-content: flex-end;
}

header>.main>* {
    pointer-events: all;
}

header .brand {
    margin-right: auto;
    position: relative;
}

header .brand .brand-avatar {
    left: 0;
    opacity: 0;
    position: absolute;
    top: 100%;
    top: 0;
    max-width: 2.3148148148vw;
    min-width: 2.3148148148vw;
    aspect-ratio: .9259259259;
}

header .brand .brand-clement {
    opacity: 1;
    aspect-ratio: 8;
    display: block;
    min-width: 5.5rem;
    pointer-events: all;
    position: relative;
    /* max-width: 6.4814814815vw; */
    /* min-width: 6.4814814815vw; */
}

header .links {
    align-items: center;
    display: flex;
    gap: 3.125rem;
    justify-content: center;
    pointer-events: all;
}

header .links .link {
    color: #fff;
    display: inline-block;
    font-size: 1rem;
    margin: 0;
    order: 1;
    font-size: .9259259259vw;
    display: flex;
    align-items: center;
}

.link svg {
    width: .6944444444vw;
}

#Header .LangSwitch {
    position: fixed;
    display: inline-block;
    right: .7em;
    top: .2em;
}

.LangSwitch>ul {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 1;
}

.LangSwitch>ul>li {
    list-style-type: none;
}

.LangSwitch>ul .link {
    color: #fff;
    display: inline-block;
    font: 500 .75rem Moderat, sans-serif;
    margin: 0;
    order: 1;
    padding: .25em .6em .15em;
    text-transform: uppercase;
    transition: all .48s cubic-bezier(.36, .33, 0, 1), opacity .24s cubic-bezier(.36, .33, 0, 1);
    font-size: .6944444444vw;
}
</style>