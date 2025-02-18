<template>
    <section class="pf-services --g">
        <div class="container">
            <div class="headline">
                <h2 class="tag">
                    <span>我精通的</span>
                </h2>
                <p>能够作用于产品和研究的技能</p>
                <a class="link" href="">
                    <span>了解更多能力细节</span>
                </a>
            </div>
            <div class="services-list">
                <!--[-->
                <div class="service">
                    <a href="/en/what-we-do/service/user-experience">
                        <span>用户体验</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/creative-design">
                        <span>创意设计</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/web-developement">
                        <span>网页开发</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/extranet-intranet">
                        <span>数据处理</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/e-commerce">
                        <span>摄影</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/data">
                        <span>剪辑</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/digital-strategy">
                        <span>产品设计</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/digital-strategy">
                        <span>嵌入式设计</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/digital-strategy">
                        <span>元宇宙</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/digital-strategy">
                        <span>AR / VR</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/digital-strategy">
                        <span>建模</span>
                    </a>
                </div>
                <div class="service">
                    <a href="/en/what-we-do/service/digital-strategy">
                        <span>渲染</span>
                    </a>
                </div>
                <!--]-->
                <div class="service">
                    <a href="/en/what-we-do/our-expertises">…</a>
                </div>
                <div class="services-hover">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
</script>

<style scoped>
.pf-services .container {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: 8.3333333333vw;
    justify-content: space-between;
}

.pf-services .headline {
    max-width: 20.8333333333vw;
    position: sticky;
    top: 8.1018518519vw;
}

.pf-services .services-list {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    perspective: 1000px;
    position: relative;
    width: 100%;
    max-width: 58.3333333333vw;
    transform: translate(0%, 0.8249%) translate3d(0px, 0px, 0px);
}

.pf-services .services-list .service {
    font-size: 9vw;
    line-height: 1.1;
    position: relative;
    width: 100%;
    z-index: 10;
    font-size: 5.787037037vw;
}

.pf-services .headline p {
    font-size: 7.7vw;
    line-height: 1.1;
    font-size: 1.9675925926vw;
}

.pf-services .link {
    display: block;
    display: inline-flex;
    font-size: 1.125rem;
    margin-top: 2.5rem;
    padding-bottom: .3em;
    position: relative;
    font-size: 1.2731481481vw;
    margin-top: 4.6296296296vw;
    padding-bottom: .3em;
}

.link:after {
    border-bottom: .0625rem solid #181717;
    content: "";
    display: block;
    left: 0;
    position: absolute;
    top: 92%;
    transform: scaleX(1);
    transition: transform .42s cubic-bezier(.36,.33,0,1);
    width: 100%;
}

.link:hover:after {
  transform: scaleX(0.1); /* 悬停状态下缩放为 0 */
}
</style>