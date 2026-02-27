<template>
  <div class="braille-watermark">
    <!-- 输入区域 -->
    <div class="input-section">
      <h3>盲文水印生成器</h3>

      <!-- 文字输入 -->
      <div class="form-group">
        <label>输入文字：</label>
        <textarea v-model="inputText" placeholder="输入要转换为盲文的文字..." rows="3"></textarea>
      </div>

      <!-- 盲文预览 -->
      <div class="preview-section" v-if="brailleText">
        <label>盲文结果：</label>
        <div class="braille-result">{{ brailleText }}</div>
        <button @click="copyBraille">复制盲文</button>
      </div>
    </div>
  </div>
</template>

<script>
import BrailleConverter from '@/assets/braille';
import PageWatermark from '@/assets/watermark';

const wm_fontsize = 48;
const wm_size = 1.5;

export default {
  name: 'BrailleWatermark',

  data() {
    return {
      inputText: 'HelloWorld123',
      brailleText: '',
      converter: new BrailleConverter(),
      pageWatermark: null,
    };
  },

  watch: {
    inputText: {
      handler(newVal) {
        this.convertToBraille(newVal);
      },
      immediate: true,
    },
  },
  mounted() {
    // 最简单的使用
    const default_text = '⠠⠓⠑⠇⠇⠕ ⠠⠺⠕⠗⠇⠙ ⠼⠁⠃⠉⠑';
    this.pageWatermark = new PageWatermark({
      text: default_text,
      fontSize: wm_fontsize,
      opacity: 0.1,
      rotate: 0,
      width: wm_fontsize * Math.ceil(default_text.length / wm_size), // 根据盲文长度调整水印宽度
      height: wm_fontsize, // 固定高度，确保水印显示
    });
    this.pageWatermark.init();
  },

  methods: {
    /**
     * 将文字转换为盲文
     */
    convertToBraille(text) {
      this.brailleText = this.converter.convert(text);
      this.pageWatermark.update({
        text: this.brailleText,
        width: wm_fontsize * Math.ceil(this.brailleText.length / wm_size), // 根据盲文长度调整水印宽度
      });
    },

    /**
     * 获取盲文字符的点阵表示
     */
    getDotMatrix(brailleChar) {
      const pattern = this.converter.visualize(brailleChar);
      return pattern.replace(/\n/g, ' ').trim();
    },

    /**
     * 复制盲文结果
     */
    copyBraille() {
      navigator.clipboard.writeText(this.brailleText).then(() => {
        alert('盲文已复制到剪贴板！');
      });
    },
  },
};
</script>

<style scoped>
.braille-watermark {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.input-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea,
input[type='text'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.braille-result {
  font-size: 48px;
  line-height: 1.5;
  background: white;
  padding: 20px;
  border-radius: 4px;
  margin: 10px 0;
  word-break: break-all;
  font-family: 'Segoe UI', 'Arial Unicode MS', sans-serif;
}

.preview-section {
  margin-top: 20px;
}

.preview-section img {
  max-width: 100%;
  max-height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background: #45a049;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .braille-watermark {
    padding: 10px;
  }

  .braille-result {
    font-size: 24px;
  }
}
</style>
