<template>
  <div class="card-widget pf-profile neum-card">
    <div class="card-content">
      <div class="author-tags-group">
        <div class="author-tags-group-item neum-button">
          前端开发者 & 技术博主
        </div>
      </div>
      <div class="author-avatar-group">
        <div class="avatar-img neum-panel--inset">
          <img src="@/assets/images/PF.png" alt="Profile" class="avatar" />
        </div>
      </div>
      <div class="author-info__description-group">
        <div class="author-info__description">
          西安交通大学‘博0’， 本博客分享<b>科研、编程与设计</b>相关的内容，
          主要涉及前端开发、数据可视化、机器学习等领域。
        </div>
        <div class="author-info__description">
          <br />
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
          <a
            href="https://space.bilibili.com/41665455"
            class="social-link neum-button"
            target="_blank"
            rel="external nofollow"
            title="Bilibili"
          >
            <i class="iconfont icon-bilibili-line"></i>
          </a>
          <a
            href="https://github.com/Clement-ccy"
            class="social-link neum-button"
            target="_blank"
            rel="external nofollow"
            title="GitHub"
          >
            <i class="iconfont icon-github"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
https://api.spencerwoo.com/substats/?source=bilibili&queryKey=41665455
https://api.spencerwoo.com/substats/?source=github&queryKey=Clement-ccy
https://api.spencerwoo.com/substats/?source=neteaseMusic&queryKey=1444198957
https://img.shields.io/badge/dynamic/json?color=272626&label=Github&query=%24.data.totalSubs&suffix=%20followers&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dgithub%26queryKey%3DClement-ccy
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
  opacity: 1;
  transition: all 0.3s ease-in-out 0.3s;
  transform-origin: bottom;
  z-index: 1;
}

.author-info__description-group {
  font-size: 1rem;
  line-height: 1.38;
  margin: 1rem 0;
  text-align: justify;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.avatar-img {
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  border-radius: 500px;
  position: absolute;
  overflow: hidden; /* Keep overflow */
  border-radius: 500px !important;
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
  /* 后续换成松散Button */
  .author-tags-group-item {
    font-size: 0.75rem; /* Keep font size */
    text-align: center;
    width: fit-content;
    padding: 0.2rem;
    user-select: none;
    -webkit-user-select: none;
    min-width: 100px;
    opacity: 1;
    /* transform handled by neum-button:active */
  }

  /* Remove hover/active styles - handled by neum-button */
  /* .author-tags-group-item:hover { ... } */
  /* .author-tags-group-item:active { ... } */
}



.card-content:hover {
  .author-avatar-group {
    opacity: 0;
    box-shadow: 0;
    transition: all 0.3s ease-in-out;
    /* transform: scale(0); */
  }
  .author-info__description-group {
    opacity: 1;
    transition: opacity 0.3s ease-in-out 0.3s;
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
  padding-bottom: 1rem;

  .author-info__bottom-group-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .author-info__name {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .author-info__desc {
      font-size: 0.75rem;
      font-weight: 400;
    }
  }

  .author-info__social-links {
    display: flex;
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
      margin-left: 0.5rem; /* Keep margin */
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
