<template>
    <section class="cover">
        <div class="container">
            <div class="hello">
                <span>Palpitating</span>
                <span>Forever</span>
            </div>
        </div>
        <div class="legendes">
            陈承烨, a fresh-things-exploiter born in 2003 from China.
        </div>
        <div class="spline">
            <img src="../../assets/images/cover.jpeg" style="display: block; height: 100%;" />
            <!-- <canvas></canvas> -->
        </div>
    </section>
</template>

<script>

</script>

<style>
.cover {
    align-items: center;
    background: #fff;
    color: #181717;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
}

.cover .container {
    align-items: center;
    display: flex;
    justify-content: center;
    pointer-events: none;
    width: 100%;
}

.cover .container .hello{
    width: 85%;
}

.cover .container .hello span{
    color: #fff !important;
    mix-blend-mode: difference;
    position: relative;
    z-index: 20;
    font-size: 6.25rem;
    line-height: 1;
}

.cover .legendes {
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    left: 50%;
    position: absolute;
    transform: translate(-50%);
    width: 100%;
    z-index: 100;
    color: #fff !important;
    mix-blend-mode: difference;
    bottom: 4.6296296296vw;
    font-size: .8101851852vw;
    padding: 0 4.1666666667vw;
}

.cover .spline {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 50%;
    transform: translate(-50%);
    top: 0;
    width: 100%;
    position: absolute;
    z-index: 10;
    background-color:#01082e ;
}
</style>