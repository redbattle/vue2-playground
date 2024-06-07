<template>
  <van-button @click="notifyRb('提示成功')">test</van-button>
</template>

<script>
import { notifyRb } from "@/utils/index";
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    notifyRb,
  },
};
</script>

<style lang="less" scoped></style>
