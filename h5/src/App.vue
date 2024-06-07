<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div style="height: 1000px"></div>
    <NotifyBtn />
  </div>
</template>

<script>
import { Notify } from "vant";
import NotifyBtn from "./components/NotifyBtn.vue";
import Bus from "@/utils/eventBus";

export default {
  name: "App",
  components: {
    NotifyBtn,
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
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
</style>
