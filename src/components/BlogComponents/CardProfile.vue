<template>
    <div class="card-widget pf-profile">
        <div class="card-content">
            <div class="author-tags-group">
                <div class="author-tags-group-item">前端开发者 & 技术博主</div>
            </div>
            <div class="author-avatar-group">
                <div class="avatar-img">
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
                    <a href="" class="social-link" target="_blank" rel="external nofollow" title="Bilibili">
                        <i class="iconfont icon-bilibili-line"></i>
                    </a>
                    <a href="" class="social-link" target="_blank" rel="external nofollow" title="GitHub">
                        <i class="iconfont icon-github"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.card-widget {
    background: var(--card-bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-align: center;
    border-bottom: 1px solid #000;
    border-top: 1px solid #000;
    max-height: min-content;
    width: 100%;
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
    transition: .3s;
    border: 5px solid #000;
    overflow: hidden;
    background-color: #928f8faf;
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
        font-size: 0.75rem;
        color: #fff;
        background-color: #000;
        text-align: center;
        width: fit-content;
        margin-right: auto;
        padding: 2px 10px;
        border-radius: 12px;
        cursor: pointer;
        -webkit-user-select: none;
        transition: transform .3s;
        margin: auto;
        min-width: 100px;
        opacity: 1;
        transform: scale(1);
    }

    .author-tags-group-item:hover {
        transform: scale(1.1);
    }

    .author-tags-group-item:active {
        transform: scale(0.9);
        opacity: 0.8;
    }
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
            width: 36px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            transition: all .3s ease-in-out;
            background-color: #000;
            border-radius: 32px;
            margin-left: .5rem;
            position: relative;
            transform: scale(1);

            i {
                font-size: 1.2rem;
            }

            &:hover {
                transform: scale(1.1);
            }
        }
    }
}
</style>
