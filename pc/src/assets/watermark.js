// watermark.js
class PageWatermark {
  // default configuration shared across instances
  static get DEFAULTS() {
    return {
      text: '机密文件',           // 水印文字
      subtext: '',               // 副水印文字
      fontSize: 16,              // 字体大小
      fontFamily: 'Microsoft YaHei, Arial, sans-serif',
      color: 'rgba(0, 0, 0, 0.1)', // 水印颜色
      rotate: 30,                 // 旋转角度
      gap: 100,                   // 水印间距
      opacity: 0.1,               // 透明度（仅应用于color alpha 或样式透明度之一）
      zIndex: 999999,             // 层级
      container: document.body,    // 容器
      width: 200,                 // 单个水印宽度
      height: 100,                // 单个水印高度
      observe: true,              // 是否监听DOM变化
      onRemove: null,             // 水印被移除时的回调
      dynamicInfo: null,          // 动态信息（用户ID、时间等）
      stagger: true               // 平铺时每行交错错开
    };
  }

  constructor(options = {}) {
    this.options = { ...PageWatermark.DEFAULTS, ...options };
    this.watermarkElement = null;
    this.observer = null;
    this.intervalId = null;
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
    // measure actual text width so stagger works with dynamic content
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;

    const mainText = this.getWatermarkText();
    const metrics = ctx.measureText(mainText);
    let measuredW = metrics.width;

    if (this.options.subtext) {
      ctx.font = `${this.options.fontSize * 0.8}px ${this.options.fontFamily}`;
      measuredW = Math.max(measuredW, ctx.measureText(this.options.subtext).width);
    }

    // ensure width is at least the configured value
    const baseW = Math.max(this.options.width, measuredW);
    const baseH = this.options.height;

    // update stored width so future calls stay in sync
    this.options.width = baseW;

    const tileW = this.options.stagger ? baseW * 2 : baseW;
    const tileH = this.options.stagger ? baseH * 2 : baseH;

    // prepare canvas with final tile size
    canvas.width = tileW;
    canvas.height = tileH;
    ctx.clearRect(0, 0, tileW, tileH);

    // draw helper function
    const drawOnce = (cx, cy) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((this.options.rotate * Math.PI) / 180);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
      ctx.fillStyle = this.options.color;
      ctx.globalAlpha = 1;
      ctx.fillText(mainText, 0, 0);
      if (this.options.subtext) {
        ctx.font = `${this.options.fontSize * 0.8}px ${this.options.fontFamily}`;
        ctx.fillText(this.options.subtext, 0, this.options.fontSize);
      }
      ctx.restore();
    };

    // always draw base watermark in first quadrant
    drawOnce(baseW / 2, baseH / 2);
    if (this.options.stagger) {
      drawOnce(baseW + baseW / 2, baseH + baseH / 2);
    }

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
      background-repeat: repeat;
      background-size: ${tileW}px ${tileH}px;
    `;

    this.watermarkElement.style.cssText = style;
  }

  /**
   * 获取水印文本（支持动态信息）
   */
  getWatermarkText() {
    if (typeof this.options.dynamicInfo === 'function') {
      const info = this.options.dynamicInfo();
      return `${this.options.text} ${info}`;
    }
    return this.options.text;
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
      subtree: true
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
    Object.assign(this.options, options);
    this.init();
  }
}

export default PageWatermark;