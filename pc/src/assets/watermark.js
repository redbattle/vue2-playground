// watermark.js
import BrailleConverter from '@/assets/braille';
const converter = new BrailleConverter();
class PageWatermark {
  // default configuration shared across instances
  static get DEFAULTS() {
    return {
      text: '机密文件', // 水印文字
      fontSize: 16, // 字体大小
      fontFamily: 'Microsoft YaHei, Arial, sans-serif',
      color: 'rgba(255, 255, 255, 0.4)', // 水印颜色
      opacity: 0.1, // 支持通过CSS opacity 控制整体透明度（与 color alpha 可叠加）
      zIndex: 999999, // 层级
      container: document.body, // 容器
      width: 200, // 单个水印宽度
      height: 100, // 单个水印高度
      observe: true, // 是否监听DOM变化
      onRemove: null, // 水印被移除时的回调
      dynamicInfo: null, // 动态信息（用户ID、时间等）
      logoUrl: null, // 可选：水印中显示的logo图片URL
      logoPadding: 0, // logo与文字之间的间距，默认 0 为无间距
      // no tiling: watermark rendered once per container
    };
  }

  constructor(options = {}) {
    this.options = { ...PageWatermark.DEFAULTS, ...options };
    this.watermarkElement = null;
    this.observer = null;
    this.intervalId = null;
    this.logoImg = null;
  }

  /**
   * 初始化水印
   */
  init() {
    // ensure only one watermark instance is active
    this.remove();
    this.createWatermark();
    this.setupObservers();
    this.setupDynamicUpdate();
    return this;
  }

  /**
   * 创建水印
   */
  createWatermark() {
    // if logo url provided but image not loaded yet, load asynchronously and redraw
    if (this.options.logoUrl && !this.logoImg) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.logoImg = img;
        this.createWatermark();
      };
      img.src = this.options.logoUrl;
      return;
    }

    // measure actual text width for proper sizing of single watermark
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;

    const mainText = this.getWatermarkText();
    // split text into individual characters for separate placement
    const chars = Array.from(mainText);
    // const chars = [];
    // for (let i = 0; i < 100; i++) {
    //   chars.push(i + '');
    // }

    // compute height of text block (using font size)
    let textHeight = this.options.fontSize;

    // logo does not affect measured width/height directly;
    // watermark tile size will be used to scale logo later

    // ensure width/height respect configured minimums
    const baseW = Math.max(this.options.width, 0);
    let baseH = Math.max(this.options.height, 0);

    // determine scaled logo dimensions which will fill the tile while preserving aspect
    let logoDrawW = 0;
    let logoDrawH = 0;
    if (this.logoImg) {
      const iw = this.logoImg.width;
      const ih = this.logoImg.height;
      const tileRatio = baseW / baseH;
      const imgRatio = iw / ih;
      if (tileRatio > imgRatio) {
        // tile is wider - scale by width
        logoDrawW = baseW;
        logoDrawH = baseW / imgRatio;
      } else {
        // tile is taller - scale by height
        logoDrawH = baseH;
        logoDrawW = baseH * imgRatio;
      }
    }

    // update stored width so future calls stay in sync
    // this.options.width = baseW;

    // prepare canvas with final tile size
    canvas.width = baseW;
    canvas.height = baseH;
    ctx.clearRect(0, 0, baseW, baseH);

    // draw helper function (center the content at cx,cy)
    const drawOnce = (cx, cy) => {
      ctx.save();
      ctx.translate(cx, cy);

      // draw logo scaled to tile
      if (this.logoImg) {
        ctx.drawImage(this.logoImg, -logoDrawW / 2, -logoDrawH / 2, logoDrawW, logoDrawH);
      }

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
      ctx.fillStyle = this.options.color;
      ctx.globalAlpha = 1;
      // draw each char spaced horizontally
      // let yOffset = -baseH / 2;
      console.log(1111, chars, baseW, baseH);
      chars.forEach((ch, idx) => {
        // 1
        if (idx < 16) {
          ctx.fillText(ch, -baseW / 2 + textHeight * ((idx % 2) + 1) - 10, -baseH / 2 + textHeight + idx * textHeight);
        } else if (idx < 25) {
          let x = textHeight * 1.5 * Math.floor((idx - 15) / 2);
          let y = textHeight * (0.4 * (idx - 15) + Math.floor((idx - 15) % 2));
          ctx.fillText(ch, -baseW / 2 + textHeight * 2 + 10 + x, -baseH / 2 + 16 * textHeight + y);
        } else if (idx < 32) {
          let x = textHeight * 1.5 * Math.floor((idx - 15) / 2);
          let y = textHeight * (0.4 * (31 - idx) + Math.floor((idx - 31) % 2)) + textHeight * 2.4;
          ctx.fillText(ch, -baseW / 2 + textHeight * 2 + 10 + x, -baseH / 2 + 16 * textHeight + y - 10);
        } else if (idx < 36) {
          let x = textHeight * 1.3 * Math.floor((idx - 15) / 2);
          let y = textHeight * (0.6 * (32 - idx) + Math.floor((idx - 32) % 2)) + textHeight;
          ctx.fillText(ch, -baseW / 2 + textHeight * 2 + 60 + x, -baseH / 2 + 16 * textHeight + y - 20);
        } else if (idx < 38) {
          let x = textHeight * 1.2 * Math.floor((idx - 15) / 2);
          let y = textHeight * (0.6 * (36 - idx) + Math.floor((idx - 36) % 2)) + textHeight;
          ctx.fillText(ch, -baseW / 2 + textHeight * 2 + 60 + x, -baseH / 2 + 16 * textHeight + y - 150);
        } else if (idx < 40) {
          let x = textHeight * 1.2 * Math.floor((idx - 15) / 2);
          let y = textHeight * (0.6 * (36 - idx) + Math.floor((idx - 36) % 2)) + textHeight;
          ctx.fillText(ch, -baseW / 2 + textHeight * 2 + 20 + x, -baseH / 2 + 16 * textHeight + y - 150);
        } else if (idx < 47) {
          ctx.fillText(
            ch,
            -baseW / 4 + textHeight * ((idx % 2) + 1) - 60,
            -baseH / 2 + textHeight + (idx - 40) * textHeight - 20,
          );
        } else if (idx < 54) {
          ctx.fillText(
            ch,
            baseW / 4 + textHeight * ((idx % 2) + 1) - 76,
            -baseH / 2 + textHeight + (idx - 47) * textHeight - 20,
          );
        } else if (idx < 61) {
          ctx.fillText(
            ch,
            baseW / 2 + textHeight * ((idx % 2) + 1) - 124,
            -baseH / 2 + textHeight + (idx - 54) * textHeight - 20,
          );
        } else if (idx < 64) {
          ctx.fillText(ch, baseW / 4 + textHeight * (61 - idx) * 1.2, (61 - idx) * textHeight * 1.2 - 80);
        } else if (idx < 68) {
          ctx.fillText(ch, baseW / 4 + textHeight * (64 - idx) - 80, (64 - idx) * textHeight - 20);
        } else if (idx < 74) {
          let x = -textHeight * 1.5 * Math.floor((idx - 68) / 2);
          let y = -textHeight * (0.6 * (68 - idx) - Math.floor((idx - 68) % 2)) + textHeight * 2.4;
          ctx.fillText(ch, -baseW / 4 + 120 + x, -baseH / 4 + y - 0);
        } else if (idx < 82) {
          let x = textHeight * 1.5 * Math.floor((idx - 74) / 2);
          let y = -textHeight * (0.5 * (73 - idx) - Math.floor((idx - 74) % 2)) + textHeight * 2.4;
          ctx.fillText(ch, -baseW / 4 + 0 + x, -baseH / 4 + y + 200);
        } else if (idx < 88) {
          let x = textHeight * 1.5 * Math.floor((idx - 82) / 2);
          let y = textHeight * (0.5 * (82 - idx) - Math.floor((idx - 82) % 2));
          ctx.fillText(ch, -baseW / 4 + 280 + x, -baseH / 4 + y + 500);
        }
      });
      ctx.restore();
    };

    // single watermark centered inside the tile
    drawOnce(baseW / 2, baseH / 2);

    const base64Data = canvas.toDataURL('image/png');

    if (!this.watermarkElement) {
      this.watermarkElement = document.createElement('div');
      this.watermarkElement.setAttribute('data-watermark', 'true');
      this.options.container.appendChild(this.watermarkElement);
    }

    const style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${this.options.zIndex};
      background-image: url(${base64Data});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: ${this.options.width}px ${this.options.height}px;
      opacity: ${this.options.opacity};
    `;

    this.watermarkElement.style.cssText = style;
  }

  /**
   * 获取水印文本（支持动态信息）
   */
  getWatermarkText() {
    if (typeof this.options.dynamicInfo === 'function') {
      const info = this.options.dynamicInfo();
      return `${converter.convert(this.options.text)} ${info}`;
    }
    return converter.convert(this.options.text, 88);
  }

  /**
   * 设置观察者（防止水印被删除）
   */
  setupObservers() {
    if (!this.options.observe) return;

    // combine attribute and childList monitoring in one observer
    if (this.observer) this.observer.disconnect();

    this.observer = new MutationObserver((mutations) => {
      let removed = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.removedNodes.length) removed = true;
        if (m.type === 'attributes') removed = true;
      }
      if (removed) this.handleWatermarkChange();
    });

    this.observer.observe(this.options.container, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  /**
   * 处理水印变化
   */
  handleWatermarkChange() {
    if (!this.watermarkElement || !document.body.contains(this.watermarkElement)) {
      this.onWatermarkRemoved();
    }
  }

  /**
   * 水印被移除时的处理
   */
  onWatermarkRemoved() {
    // 触发回调
    if (this.options.onRemove) {
      this.options.onRemove();
    }

    // 重新创建水印（防删除）
    this.init();

    // 可以在这里发送日志到服务器
    console.warn('水印被尝试移除，已自动恢复');
  }

  /**
   * 设置动态更新（定期更新水印信息）
   */
  setupDynamicUpdate() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    if (typeof this.options.dynamicInfo === 'function') {
      const refresh = () => {
        this.createWatermark();
        this.intervalId = setTimeout(refresh, 60000);
      };
      refresh();
    }
  }

  /**
   * 移除水印
   */
  remove() {
    if (this.watermarkElement?.parentNode) {
      this.watermarkElement.parentNode.removeChild(this.watermarkElement);
    }
    this.observer?.disconnect();
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    this.watermarkElement = null;
  }

  /**
   * 更新水印配置
   */
  update(options = {}) {
    const prevLogo = this.options.logoUrl;
    Object.assign(this.options, options);
    if (options.logoUrl && options.logoUrl !== prevLogo) {
      this.logoImg = null; // force re-load
    }
    this.init();
  }
}

export default PageWatermark;
