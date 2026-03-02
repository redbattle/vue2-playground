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
    </div>
  </div>
</template>

<script>
import PageWatermark from '@/assets/watermark';

const wm_fontsize = 48;

export default {
  name: 'BrailleWatermark',

  data() {
    return {
      inputText: 'abcdefg',
      brailleText: '',
      
      pageWatermark: null,
    };
  },

  watch: {
    inputText(newVal) {
      this.convertToBraille(newVal + 'l');
    },
  },
  mounted() {
    // 最简单的使用
    const default_text = '1234567890';
    this.pageWatermark = new PageWatermark({
      text: default_text,
      fontSize: wm_fontsize,
      opacity: 0.2,
      logoUrl: require('@/assets/jd-logo.png'),
      width: 840, // 根据盲文长度调整水印宽度
      height: 1006, // 固定高度，确保水印显示
    });
    this.pageWatermark.init();
  },

  methods: {
    /**
     * 将文字转换为盲文
     */
    convertToBraille(text) {
      this.pageWatermark.update({
        text: text + 'l',
        // width: wm_fontsize * Math.ceil(this.brailleText.length / wm_size), // 根据盲文长度调整水印宽度
      });
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
