<template>
    <header id="Header">
        <div class="main">
            <a href="/en" class="brand">
                <div class="brand-avatar">
                    <svg width="25" height="27" viewBox="0 0 25 27" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M2.14026 4.21037V11.7796C2.14026 21.3449 10.4331 24.5229 12.1422 25.0741L12.1469 25.0756L12.1515 25.0772C12.1845 25.0883 12.2203 25.0883 12.2532 25.0772L12.2574 25.0758L12.2616 25.0744C13.9717 24.5206 22.2645 21.339 22.2645 11.7772V4.21037C22.1352 4.14296 21.9747 4.06131 21.786 3.96898C21.2266 3.69524 20.4212 3.32889 19.445 2.96241C17.4836 2.22611 14.8747 1.5054 12.2024 1.5054C9.52997 1.5054 6.92109 2.22611 4.95972 2.96241C3.98348 3.32889 3.17814 3.69524 2.61869 3.96898C2.43001 4.06131 2.26957 4.14296 2.14026 4.21037ZM23.037 3.76738L23.4305 3.11967L23.8095 3.33827V11.7772C23.8095 22.4049 14.5553 25.9173 12.7526 26.5018C12.3961 26.6206 12.0092 26.6206 11.6526 26.502C9.84782 25.9191 0.595215 22.4101 0.595215 11.7796V3.33827L0.974193 3.11967L1.36774 3.76738C0.974193 3.11968 0.974193 3.11967 0.974193 3.11967L0.976375 3.11842L0.980471 3.11607L0.994347 3.10817C1.00611 3.10151 1.02286 3.09207 1.04446 3.08004C1.08765 3.05598 1.15024 3.02157 1.23104 2.97828C1.39262 2.89172 1.62721 2.76955 1.9253 2.62369C2.52107 2.33218 3.37284 1.94486 4.40424 1.55767C6.45813 0.786633 9.26656 0 12.2024 0C15.1382 0 17.9466 0.786633 20.0005 1.55767C21.0319 1.94486 21.8836 2.33218 22.4794 2.62369C22.7775 2.76955 23.0121 2.89172 23.1737 2.97828C23.2545 3.02157 23.3171 3.05598 23.3603 3.08004C23.3819 3.09207 23.3986 3.10151 23.4104 3.10817L23.4242 3.11607L23.4283 3.11842L23.4305 3.11967C23.4305 3.11967 23.4305 3.11968 23.037 3.76738Z">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M13.6638 13.1909L12.207 9.09479L10.7471 13.1909H9.5093L7.30173 6.88613H8.82566L10.1654 11.1251L11.6159 6.8682H12.835L14.2855 11.1251L15.6253 6.88613H17.1128L14.9047 13.1909H13.6638Z">
                        </path>
                        <path
                            d="M12.5482 15.2772C12.6007 16.4559 13.5693 17.3998 14.7791 17.4508C14.9829 17.4594 14.9829 17.753 14.7791 17.7618C13.5693 17.8129 12.6007 18.7567 12.5482 19.9354C12.5395 20.134 12.2381 20.134 12.2291 19.9354C12.1766 18.7567 11.208 17.8129 9.9982 17.7618C9.79442 17.7533 9.79442 17.4596 9.9982 17.4508C11.208 17.3998 12.1766 16.4559 12.2291 15.2772C12.2378 15.0787 12.5392 15.0787 12.5482 15.2772Z"
                            data-svg-origin="12.388657569885254 17.606337547302246" transform="matrix(1,0,0,1,0,0)">
                        </path>
                    </svg>
                </div>
                <div class="brand-clement">
                    <svg width="112" height="14" viewBox="0 0 112 14" fill="none">
                        <path
                            d="M14.8123 9.39813L11.7358 0.193444H9.14967L6.07323 9.39813L3.23292 0.232322H0L4.68295 13.8644H7.30798L10.4034 5.00772L13.4988 13.8644H16.1238L20.8077 0.232322H17.6535L14.8123 9.39813ZM32.0883 0C27.8559 0 24.7804 3.15199 24.7804 7V7.03888C24.7804 10.8869 27.817 14 32.0494 14C36.2819 14 39.3574 10.848 39.3574 7V6.96112C39.3574 3.11311 36.3208 0 32.0883 0ZM36.2023 7.03888C36.2023 9.35925 34.518 11.2548 32.0883 11.2548C29.6587 11.2548 27.9346 9.32132 27.9346 7.00095V6.96207C27.9346 4.6417 29.6198 2.74709 32.0494 2.74709C34.4791 2.74709 36.2032 4.68057 36.2032 7.00095L36.2023 7.03888ZM57.3969 0.232322H53.7534L48.1894 6.14942V0.232322H45.1718V13.7677H48.1894V9.62951L49.776 8.00515L54.0274 13.7677H57.652L51.814 5.97494L57.3969 0.232322ZM62.7418 13.7677H65.7595V0.232322H62.7418V13.7677ZM81.5296 8.56651L75.1035 0.232322H72.3211V13.7677H75.2989V5.16324L81.9411 13.7677H84.5074V0.232322H81.5296V8.56651ZM93.9273 8.27635H100.393V5.62693H93.9273V2.88174H101.275V0.232322H90.9296V13.7677H101.373V11.1183H93.9273V8.27635ZM109.766 0.344216C108.532 0.344216 107.531 1.33135 107.531 2.5489C107.531 3.76646 108.532 4.75359 109.766 4.75359C110.999 4.75359 112 3.76646 112 2.5489C112 1.33135 110.999 0.344216 109.766 0.344216Z"
                            fill="#181717"></path>
                    </svg>
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
                        <svg data-v-f7929264="" width="8" height="7" viewBox="0 0 8 7" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path data-v-f7929264="" d="M4.09091 0.5L7 3.5M7 3.5L4.09091 6.5M7 3.5H1" stroke="white"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                </button>
                <a href="mailto:319788356@qq.com" class="link --email --min">
                    <span>319788356@qq.com</span>
                </a>
            </div>
            <nav class="LangSwitch">
                <ul>
                    <li><a class="link --min" :class="--current" href="/">zh-CN</a></li>
                    <li><a class="link --min" :class="--current" href="/en">en</a></li>
                </ul>
                <div class="mask"></div>
            </nav>
        </div>
    </header>
</template>

<script>
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
    max-width: 6.4814814815vw;
    min-width: 6.4814814815vw;
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