<template>
    <section class="pf-work">
        <div class="headline">
            <h2 class="tag"><span>我的作品</span></h2>
            <marqueeComponent></marqueeComponent>
        </div>

        <div class="filters-1">
            <button class="checkbox">
                <div class="checkbox__custom">
                    <span>全部</span>
                    <sup>21</sup>
                </div>
            </button>
            <label class="checkbox">
                <input type="checkbox" name="category" value="productDesign" />
                <div class="checkbox__custom">
                    <span>产品设计</span>
                    <sup>1</sup>
                </div>
            </label>
            <label class="checkbox">
                <input type="checkbox" name="category" value="research" />
                <div class="checkbox__custom">
                    <span>研究</span>
                    <sup>6</sup>
                </div>
            </label>
            <label class="checkbox">
                <input type="checkbox" name="category" value="music" />
                <div class="checkbox__custom">
                    <span>音乐</span>
                    <sup>3</sup>
                </div>
            </label>
            <label class="checkbox">
                <input type="checkbox" name="category" value="photograph" />
                <div class="checkbox__custom">
                    <span>摄影</span>
                    <sup>11</sup>
                </div>
            </label>
        </div>
        <div class="projects-grid">
            <div>
                <div class="projects-grid-item">
                    <a href="" class="project-thumb-preview">
                        <div class="cover">
                            <img src="https://api.wokine.com/wp-content/uploads/2023/12/artfx-thumb-768x402.jpg" alt="" loading="lazy">
                        </div>
                        <h3 class="title">AFREX</h3>
                        <div class="tags">
                            <ul class="industries">
                                <li>Anime</li>
                            </ul>
                            <div class="separator">✦</div>
                            <ul class="categories">
                                <li>Web Design</li>
                            </ul>
                        </div>
                    </a>
                </div>
            </div>
            <div>
            </div>
            <div></div>
        </div>
    </section>
</template>

<script>
import marqueeComponent from '../basicComponents/marqueeComponent.vue'

export default {
    components: {
        marqueeComponent,
    }
}
</script>

<style>
.pf-work {
    background: #181717;
    color: #fff;
}

.tag:before {
    background-color: #fff;
}

.pf-work .filters-1 {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: .6944444444vw 2.8935185185vw;
    padding: 2.8935185185vw 0;
}

.pf-work .filters-1 .checkbox {
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

.checkbox input:checked+.checkbox__custom, .checkbox.--checked .checkbox__custom, html:not(.--touch) .checkbox:hover .checkbox__custom {
    opacity: 1;
}

.checkbox input:checked+.checkbox__custom:before, .--d .checkbox.--checked .checkbox__custom:before {
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

.pf-work .projects-grid {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
}

.pf-work .projects-grid>* {
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 2.8935185185vw;
}

.pf-work .projects-grid .projects-grid-item {
    min-width: 100%;
    transition: opacity 1.2scubic-bezier(.36,.33,0,1);
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
    transition: transform .48s cubic-bezier(.36,.33,0,1);
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
    transition: opacity .42scubic-bezier(.36,.33,0,1);
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