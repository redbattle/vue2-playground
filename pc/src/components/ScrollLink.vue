<template>
  <div class="scroll-link">
    <div class="scroll-link-container" id="scroll_left" @mouseenter="mouseActive = 'left'">
      <div
        class="scroll-link-item"
        ref="item_left"
        v-for="(item, key) in tableData"
        :key="key"
        :id="`item_left_${key}`"
      >
        {{ key }}
        {{ item.left }}
      </div>
    </div>
    <div class="scroll-link-container" id="scroll_right" @mouseenter="mouseActive = 'right'">
      <div
        class="scroll-link-item"
        ref="item_right"
        v-for="(item, key) in tableData"
        :key="key"
        :id="`item_right_${key}`"
      >
        {{ key }}
        {{ item.right }}
      </div>
    </div>
  </div>
</template>

<script>
import { scroller } from 'vue-scrollto/src/scrollTo';

const scrollDefault = {
  duration: 300,
  offset: -20,
};

let timeout = null;
const debounce = (func, wait = 300, immediate = false) => {
  // 清除定时器
  if (timeout !== null) clearTimeout(timeout);
  // 立即执行，此类情况一般用不到
  if (immediate) {
    const callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow) typeof func === 'function' && func();
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
    timeout = setTimeout(() => {
      typeof func === 'function' && func();
    }, wait);
  }
};

export default {
  props: {},
  watch: {},
  data() {
    return {
      mouseActive: '',
      scrollTo: null,
      scroll_left: null,
      scroll_right: null,
      tableData: [
        {
          left: '左侧列表',
          right: '右侧列表',
        },
        {
          left: '左侧列表',
          right: '右侧列表',
        },
        {
          left: '左侧列表',
          right: '右侧列表',
        },
        {
          left: '左侧列表',
          right: '右侧列表',
        },
        {
          left: '左侧列表',
          right: '右侧列表',
        },
      ],
    };
  },
  created() {
    this.mouseActive = '';
  },
  mounted() {
    this.initScroll();
  },
  methods: {
    initScroll() {
      this.$nextTick(() => {
        this.destroyScroll();
        this.scrollTo = scroller();
        this.scroll_left = document.querySelector('#scroll_left');
        this.scroll_right = document.querySelector('#scroll_right');
        this.scroll_left.addEventListener('scroll', this.handleScrollLeft);
        this.scroll_right.addEventListener('scroll', this.handleScrollRight);
      });
    },
    handleScroll(handleTarget, scrollTarget) {
      if (this.mouseActive !== handleTarget) {
        return;
      }
      this.$nextTick(() => {
        const itemRefs = this.$refs[`item_${handleTarget}`];
        if (itemRefs && itemRefs.length > 0) {
          const scrollKeyPart = [];
          const scrollKeyFull = [];
          const parent_position = this[`scroll_${handleTarget}`].getBoundingClientRect() || {};
          itemRefs.forEach((item, key) => {
            const item_position = item.getBoundingClientRect() || {};
            if (item_position.bottom >= parent_position.top && item_position.top <= parent_position.bottom) {
              scrollKeyPart.push(key);
              if (item_position.top >= parent_position.top) {
                scrollKeyFull.push(key);
              }
            }
          });
          debounce(() => {
            let scrollKey = null;
            if (scrollKeyFull.length > 0) {
              scrollKey = scrollKeyFull[0];
            } else if (scrollKeyPart.length > 0) {
              scrollKey = scrollKeyPart[0];
            }
            console.log('scrollKey', scrollKey);
            if (scrollKey === null) {
              return;
            }
            this.scrollTo(`#item_${scrollTarget}_${scrollKey}`, {
              ...scrollDefault,
              container: `#scroll_${scrollTarget}`,
            });
          }, 300);
        }
      });
    },
    handleScrollLeft() {
      this.handleScroll('left', 'right');
    },
    handleScrollRight() {
      this.handleScroll('right', 'left');
    },
    destroyScroll() {
      if (this.scroll_left) {
        this.scroll_left.removeEventListener('scroll', this.handleScrollLeft);
        this.scroll_left = null;
      }
      if (this.scroll_right) {
        this.scroll_right.removeEventListener('scroll', this.handleScrollRight);
        this.scroll_right = null;
      }
      if (this.scrollTo) {
        this.scrollTo.destroy();
        this.scrollTo = null;
      }
    },
  },
  beforeDestroy() {
    this.destroyScroll();
  },
};
</script>

<style lang="less" scoped>
.scroll-link {
  display: flex;
  &-container {
    flex: 1;
    border: 1px solid #ccc;
    padding: 12px;
    height: 400px;
    overflow-y: auto;
  }
  &-item {
    height: 200px;
    border: 1px solid #eee;
  }
}
</style>
