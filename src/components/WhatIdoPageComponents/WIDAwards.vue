<template>
    <div class="background">
        <section class="pf-rewards">
            <div class="awards">
                <h2 class="tag">
                    <span>我的奖项</span>
                </h2>

                <div class="inner">
                    <div class="text-to-animate">
                        <p>从xxx起，在xxxx领域获得了很多奖项</p>
                    </div>
                </div>
                <div class="prices">
                    <a href="" target="_blank" class="price">
                        <span class="logo">NCDA</span>
                        <span class="count">
                            <span>x</span>
                            <span class="number">2</span>
                        </span>
                    </a>
                    <a href="" target="_blank" class="price">
                        <span class="logo">3Ds</span>
                        <span class="count">
                            <span>x</span>
                            <span class="number">1</span>
                        </span>
                    </a>
                    <a href="" target="_blank" class="price">
                        <span class="logo">CCDCE</span>
                        <span class="count">
                            <span>x</span>
                            <span class="number">1</span>
                        </span>
                    </a>
                </div>
                <a herf="" class="link">
                    <span>查看详细</span>
                </a>
            </div>
            <div class="relations">
                <h2 class="tag">
                    <span>与我有关</span>
                </h2>
                <div class="case">
                    <div class="logo"><img src="https://api.wokine.com/wp-content/uploads/2024/01/kerialis.svg" alt="">
                    </div>
                    <p>Wokine has been the digital partner of Kerialis for more than 5 years. We’ve been namely helping
                        them to digitalize their processes, set up online sales tunnels, increase their conversion rate,
                        etc.</p>
                    <a href="" class="link">了解更多</a>
                </div>
            </div>

        </section>
    </div>
</template>

<script></script>

<style>
.background {
    background-color: #181717;
}

.pf-rewards {
    overflow: hidden;
    position: relative;
    background-color: var(--c-background);
    border-bottom-left-radius: 2vw;
    border-bottom-right-radius: 2vw;
}

.pf-rewards .awards {
    margin-left: 33.3333333333vw;
    padding-right: 8.3333333333vw;
}

.pf-rewards .awards .inner .text-to-animate {
    font-size: 3.7037037037vw;
    letter-spacing: -.04em;
    line-height: normal;
}

.text-to-animate {
    display: grid;
    grid-gap: 1.2em;
}

.pf-rewards .prices {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 4.6296296296vw;
    margin-top: 4.6296296296vw;
}

.pf-rewards .prices .price {
    align-items: flex-end;
    display: flex;
    gap: .3em;
}

.pf-rewards .prices .logo {
    font-size: 1.7361111111vw;
    font-weight: 700;
    line-height: 1;
}

.pf-rewards .prices .count {
    font-size: 1.1574074074vw;
    min-width: 2.025462963vw;
}

.pf-rewards .link {
    display: block;
    display: inline-flex;
    font-size: 1.125rem;
    margin-top: 2.5rem;
    padding-bottom: .3em;
    position: relative;
    margin-top: 4.6296296296vw;
    padding-bottom: .3em;
    font-size: 1.2731481481vw;
}

.pf-rewards .link:after {
    border-bottom: .0625rem solid #181717;
    content: "";
    display: block;
    left: 0;
    position: absolute;
    top: 92%;
    transform: scaleX(1);
    transition: transform .42s cubic-bezier(.36, .33, 0, 1);
    width: 100%;
}

.pf-rewards .link:hover:after {
    transform: scaleX(0.1);
    /* 悬停状态下缩放为 0 */
}

.pf-rewards .relations {
    margin-top: 6.9444444444vw;
    padding-top: 6.9444444444vw;
}

.relations .tag {
    margin-bottom: 5.787037037vw;
}

.case {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 2.8935185185vw;
    max-width: 23.1481481481vw;
    padding-right: 3.4722222222vw;
    width: 100%;
}

.case .logo {
    height: 2.0833333333vw;
    max-width: 9.2592592593vw;
}

.case .logo img {
    height: 100%;
    -o-object-fit: contain;
    object-fit: contain;
}

.case p {
    font-size: 1.2731481481vw;
    line-height: 1.4;
    opacity: .7;
}

.case .link {
    font-size: .9259259259vw;
    margin-top: 0;
    padding-bottom: .3em;
}
</style>