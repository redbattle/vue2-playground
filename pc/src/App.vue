<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <WaterMark content="123456" />
  </div>
</template>

<script>
import WaterMark from '@/components/WaterMark.vue';

export default {
  name: 'App',
  components: { WaterMark },
  data() {
    return {
      content: '',
    };
  },
  created() {},
  mounted(){
    
  },
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
