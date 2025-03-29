<template>
    <div class=".loader"></div>
</template>

<style lang="scss">
*, *:before, *:after {
  box-sizing: border-box;
}

html {
  font-size: 18px;
}

body {
  font-family: "Roboto", sans-serif;
  font-size: 1em;
  line-height: 1.6;
  background: #F2F1EF;
}

$animation-duration: 1.8s;

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 10px;
  background: #3498DB;
  border-radius: 5px;
  animation: load $animation-duration ease-in-out infinite; 
  &:before, &:after {
    position: absolute; 
    display: block;
    content: "";
    animation: load $animation-duration ease-in-out infinite;
    height: 10px;
    border-radius: 5px;
  }
    &:before {
    top: -20px;
    left: 10px;
    width: 40px;
    background: #EF4836;
  }
  &:after {
    bottom: -20px;
    width: 35px;
    background: #F5AB35; 
  }
}

@keyframes load {
  0% {
    transform: translateX(40px);
  }
  
  50% {
    transform: translateX(-30px);
  }
  100% {
    transform: translateX(40px);
  }
}
</style>