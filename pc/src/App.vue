<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <ScrollLink />
  </div>
</template>

<script>
import ScrollLink from './components/ScrollLink.vue';
export default {
  name: "App",
  components: {ScrollLink},
  data() {
    return {
      content: "",
    };
  },
  created() {},
  methods: {},
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
</style>
