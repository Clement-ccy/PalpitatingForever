<template>
    <div class="card-widget pf-profile neum-card">
        <div class="card-content">
            <div class="author-tags-group">
                <div class="author-tags-group-item neum-button">前端开发者 & 技术博主</div>
            </div>
            <div class="author-avatar-group">
                <div class="avatar-img neum-panel--inset">
                    <img src="@/assets/images/PF.png" alt="Profile" class="avatar" />
                </div>
            </div>
            <div class="author-info__description-group">
                <div class="author-info__description">
                    西安交通大学 PhD 在读，
                    本博客分享<b>科研、编程与设计</b>相关的内容，
                    主要涉及前端开发、数据可视化、机器学习等领域。
                    <br />

                </div>
                <div class="author-info__description">
                    分享我的学习与成长经验，希望对你有所帮助。
                    <br />
                    欢迎交流与合作
                </div>
            </div>
            <div class="author-info__bottom-group">
                <div class="author-info__bottom-group-left">
                    <div class="author-info__name">PalpitatingForever</div>
                    <div class="author-info__desc">"Design and Love Never Fail."</div>
                </div>
                <div class="author-info__social-links">
                    <a href="" class="social-link neum-button" target="_blank" rel="external nofollow" title="Bilibili">
                        <i class="iconfont icon-bilibili-line"></i>
                    </a>
                    <a href="" class="social-link neum-button" target="_blank" rel="external nofollow" title="GitHub">
                        <i class="iconfont icon-github"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.card-widget {
    /* background handled by neum-card */
    display: flex; /* Keep flex */
    flex-direction: column; /* Keep direction */
    overflow: hidden; /* Keep overflow */
    text-align: center; /* Keep text-align */
    /* border handled by neum-card shadow */
    max-height: min-content; /* Keep max-height */
    width: 100%; /* Keep width */
}

.card-content {
    min-height: 320px;
    padding: 1rem 1.2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.author-avatar-group {
    width: 120px;
    height: 160px;
    right: calc(50% - 59px);
    top: 70px;
    border-radius: 500px;
    position: absolute;
    transition: cubic-bezier(.69, .39, 0, 1.21) .3s;
    transform-origin: bottom;
    z-index: 1;
}

.avatar-img {
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    border-radius: 500px;
    position: absolute;
    opacity: 1;
    transition: .3s; /* Keep transition for avatar visibility */
    /* border handled by neum-panel--inset */
    overflow: hidden; /* Keep overflow */
    /* background-color handled by neum-panel--inset */
    /* Ensure neum-panel--inset has appropriate border-radius */
    border-radius: 500px !important; /* Force override if needed */
}

.card-widget .avatar {
    width: 100%;
    height: 100%;
}

.author-tags-group {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 28px;

    .author-tags-group-item {
        font-size: 0.75rem; /* Keep font size */
        /* color handled by neum-button */
        /* background-color handled by neum-button */
        text-align: center; /* Keep text-align */
        width: fit-content; /* Keep width */
        margin-right: auto; /* Keep margin */
        /* padding handled by neum-button, adjust if needed */
        /* border-radius handled by neum-button */
        /* cursor handled by neum-button */
        -webkit-user-select: none; /* Keep user-select */
        /* transition handled by neum-button */
        margin: auto; /* Keep margin */
        min-width: 100px; /* Keep min-width */
        opacity: 1; /* Keep opacity */
        /* transform handled by neum-button:active */
    }

    /* Remove hover/active styles - handled by neum-button */
    /* .author-tags-group-item:hover { ... } */
    /* .author-tags-group-item:active { ... } */
}

.author-info__description-group {
    font-size: 1rem;
    line-height: 1.38;
    color: #000000;
    margin: 1rem 0;
    text-align: justify;
    opacity: 0;
    transition: opacity .3s ease-in-out;
}

.card-content:hover {
    .author-info__description-group {
        opacity: 1;
    }
    .author-avatar-group {
        transform: scale(0);
    }

}

.author-info__bottom-group {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1.2rem;

    .author-info__bottom-group-left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .author-info__name {
            font-size: 1.25rem;
            /* color: #fff; */
            font-weight: 600;
        }

        .author-info__desc {
            font-size: 0.75rem;
            /* color: #fff; */
            font-weight: 400;
        }
    }

    .author-info__social-links {
        display: flex;
        /* gap: .5rem; */
        /* margin-left: auto; */
        position: relative;

        .social-link {
            width: 36px; /* Keep size */
            height: 36px; /* Keep size */
            display: flex; /* Keep flex */
            justify-content: center; /* Keep justify */
            align-items: center; /* Keep align */
            /* color handled by neum-button */
            /* transition handled by neum-button */
            /* background-color handled by neum-button */
            border-radius: 50% !important; /* Force circle, override neum-button */
            margin-left: .5rem; /* Keep margin */
            position: relative; /* Keep position */
            /* transform handled by neum-button:hover/active */

            i {
                font-size: 1.2rem; /* Keep icon size */
            }

             /* Remove hover style - handled by neum-button */
            /* &:hover { ... } */
        }
    }
}
</style>
