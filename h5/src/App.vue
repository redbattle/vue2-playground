<template>
  <div id="app">
    <RbSlide vertical>
      <RbSlideItem v-for="item in 5" :key="item" >
        <div  :class="'swiper-slide'+item">
          666{{ item }}
        </div>
      </RbSlideItem>
    </RbSlide>
  </div>
</template>

<script>
import { Notify } from "vant";
// import NotifyBtn from "./components/NotifyBtn.vue";
import Bus from "@/utils/eventBus";
import { RbSlide, RbSlideItem } from "@/components/RbSlide";

export default {
  name: "App",
  components: {
    // NotifyBtn,
    RbSlide,
    RbSlideItem,
  },
  mounted() {
    Bus.$on("showNotify", this.showNotify);
  },
  methods: {
    showNotify(msg) {
      Notify({
        message: msg,
        duration: 2000,
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  background: #fff;
  background-color: #666;
}
.van-popup.notify-custom {
  flex-direction: row;
  width: fit-content;
  min-height: auto;
  padding: 16px 32px;
  border-radius: 50px;
  background-color: #fff;
  color: #2c3e50;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 1 16px 16px 4px #ccc;
}

.swiper-slide0,.swiper-slide3,.swiper-slide6,.swiper-slide9  {
  background-color: #00f;
  height: 400px;
}

.swiper-slide1,.swiper-slide4,.swiper-slide7,.swiper-slide10 {
  height: 1000px;
  background-color: #ff0;
}

.swiper-slide2,.swiper-slide5,.swiper-slide8,.swiper-slide11 {
  height: 600px;
  background-color: #0f0;
}
</style>
