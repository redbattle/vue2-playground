<template>
  <div class="rb-slide">
    <div ref="track" class="rb-slide-track" :style="this.trackStyle">
      <slot />
    </div>
  </div>
</template>

<script>
import { on } from "./utils";

function getDirection(x, y) {
  if (x > y) {
    return "horizontal";
  }
  if (y > x) {
    return "vertical";
  }
  return "";
}

export default {
  name: "RbSlide",
  props: {
    vertical: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: [Number, String],
      default: 500,
    },
  },
  data() {
    return {
      offset: 0,
      currentPosition: 0,
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      active: 0,
      swiping: false,
      direction: "",
      touchStartTime: 0,
    };
  },
  computed: {
    delta() {
      return this.vertical ? this.deltaY : this.deltaX;
    },
    isCorrectDirection() {
      const expect = this.vertical ? "vertical" : "horizontal";
      return this.direction === expect;
    },
    size() {
      return this.children[this.active].offsetHeight;
    },
    perSize() {
      return this.children[this.active - 1].offsetHeight;
    },
    children() {
      return this.$refs.track.children;
    },
    trackStyle() {
      const style = {
        transitionDuration: `${this.swiping ? 0 : this.duration}ms`,
        transform: `translate${this.vertical ? "Y" : "X"}(${this.offset}px)`,
      };
      return style;
    },
  },
  mounted() {
    this.bindTouchEvent(this.$refs.track);
  },
  methods: {
    initialize() {
      if (!this.$el) {
        return;
      }
      this.swiping = true;
    },
    resize() {
      this.initialize();
    },
    resetTouchStatus() {
      this.direction = "";
      this.deltaX = 0;
      this.deltaY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
    },
    onTouchStart(event) {
      this.swiping = true;
      this.touchStartTime = Date.now();
      this.resetTouchStatus();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.currentPosition = this.offset;
      console.log("onTouchStart", event, this.children, this.active);
    },
    onTouchMove(event) {
      if (!this.swiping) return;
      const touch = event.touches[0];
      this.deltaX = touch.clientX < 0 ? 0 : touch.clientX - this.startX;
      this.deltaY = touch.clientY - this.startY;
      this.offsetX = Math.abs(this.deltaX);
      this.offsetY = Math.abs(this.deltaY);
      const LOCK_DIRECTION_DISTANCE = 10;
      if (
        !this.direction ||
        (this.offsetX < LOCK_DIRECTION_DISTANCE &&
          this.offsetY < LOCK_DIRECTION_DISTANCE)
      ) {
        this.direction = getDirection(this.offsetX, this.offsetY);
      }
      this.offset = this.currentPosition + this.delta;
    },
    onTouchEnd() {
      if (!this.swiping) return;
      const safeHeight = 100;
      const duration = Date.now() - this.touchStartTime;
      const speed = this.delta / duration;
      const shouldSwipe =
        Math.abs(speed) > 0.25 || Math.abs(this.delta) > safeHeight;
      const rect = this.rectInfo();
      console.log(rect);
      if (rect.height > this.$el.offsetHeight) {
        console.log(this.$el.offsetHeight, rect);
        if (rect.bottom + safeHeight < this.$el.offsetHeight) {
          this.offset = -(rect.offsetTop + rect.height);
          this.active++;
        } else if (
          rect.bottom + safeHeight > this.$el.offsetHeight &&
          rect.bottom < this.$el.offsetHeight
        ) {
          this.offset = -(rect.offsetTop + rect.height - this.$el.offsetHeight);
        } else if (rect.bottom > rect.height + safeHeight) {
          this.offset = -(rect.offsetTop - this.perSize);
          this.active--;
        } else if (rect.bottom > rect.height) {
          this.offset = -rect.offsetTop;
        } else {
          this.offset = this.currentPosition + this.delta;
        }
      } else if (shouldSwipe && this.isCorrectDirection) {
        if (this.delta < 0) {
          if (this.active < this.children.length) {
            this.offset = this.currentPosition - this.size;
            this.active++;
          } else {
            this.offset = this.currentPosition;
          }
        } else {
          if (this.active > 0) {
            this.offset = this.currentPosition + this.perSize;
            this.active--;
          } else {
            this.offset = 0;
            this.active = 0;
          }
        }
      } else if (this.delta) {
        this.offset = this.currentPosition;
      }
      this.swiping = false;
      console.log(
        "onTouchEnd",
        this.delta,
        this.size,
        shouldSwipe,
        this.isCorrectDirection,
        this.active
      );
    },
    bindTouchEvent(el) {
      const { onTouchStart, onTouchMove, onTouchEnd } = this;
      on(el, "touchstart", onTouchStart);
      on(el, "touchmove", onTouchMove);
      if (onTouchEnd) {
        on(el, "touchend", onTouchEnd);
        on(el, "touchcancel", onTouchEnd);
      }
    },
    rectInfo() {
      const rect = this.children[this.active].getBoundingClientRect();
      rect.offsetTop = this.children[this.active].offsetTop;
      return rect;
    },
  },
};
</script>

<style lang="less" scoped>
.rb-slide {
  height: 650px;
  background-color: #ccc;
  position: relative;
    overflow: hidden;
    transform: translateZ(0);
    cursor: grab;
    user-select: none;


  &-track{
    display: flex;
    flex-direction: column;
    

  }
}
// @supports (top: constant(safe-area-inset-top)) or
//   (top: env(safe-area-inset-top)) {
//   @safe-top: constant(safe-area-inset-top); // < ios 11.2
//   @safe-top: env(safe-area-inset-top); // >= ios 11.2
//   .rb-slide {
//     height: calc(100vh - @safe-top);
//   }
// }
</style>
