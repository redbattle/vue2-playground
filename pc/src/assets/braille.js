// brailleConverter.js
class BrailleConverter {
  constructor() {
    // 字母到盲文的映射表
    this.letterMap = {
      'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
      'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
      'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
      'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
      'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
      'z': '⠵',
      // 大写字母（需要大写符号前缀）
      'A': '⠠⠁', 'B': '⠠⠃', 'C': '⠠⠉', 'D': '⠠⠙', 'E': '⠠⠑',
      'F': '⠠⠋', 'G': '⠠⠛', 'H': '⠠⠓', 'I': '⠠⠊', 'J': '⠠⠚',
      'K': '⠠⠅', 'L': '⠠⠇', 'M': '⠠⠍', 'N': '⠠⠝', 'O': '⠠⠕',
      'P': '⠠⠏', 'Q': '⠠⠟', 'R': '⠠⠗', 'S': '⠠⠎', 'T': '⠠⠞',
      'U': '⠠⠥', 'V': '⠠⠧', 'W': '⠠⠺', 'X': '⠠⠭', 'Y': '⠠⠽',
      'Z': '⠠⠵',
      // 数字（需要数字符号前缀）
      '0': '⠼⠚', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙',
      '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
      // 常用标点
      '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖',
      ':': '⠒', ';': '⠆', '-': '⠤', ' ': ' '  // 空格
    };
    
    // 数字模式标志
    this.numberMode = false;
  }
  
  /**
   * 将普通文本转换为盲文
   * @param {string} text - 输入文本
   * @returns {string} 盲文字符串
   */
  convert(text) {
    let result = '';
    let i = 0;
    
    while (i < text.length) {
      const char = text[i];
      // const nextChar = text[i + 1];
      
      // 处理数字序列
      if (this.isDigit(char)) {
        // 检查是否需要开启数字模式
        if (!this.numberMode) {
          result += '⠼'; // 数字符号
          this.numberMode = true;
        }
        
        // 将数字转换为对应的字母盲文
        const digitToLetter = ['j', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        const letter = digitToLetter[parseInt(char)];
        result += this.letterMap[letter];
        i++;
        continue;
      }
      
      // 退出数字模式（遇到非数字且非小数点）
      if (this.numberMode && char !== '.') {
        this.numberMode = false;
      }
      
      // 处理字母和其他字符
      if (this.letterMap[char]) {
        result += this.letterMap[char];
      } else {
        // 未知字符保持原样或跳过
        result += char;
      }
      
      i++;
    }
    
    // 重置数字模式
    this.numberMode = false;
    return result;
  }
  
  /**
   * 判断字符是否为数字
   */
  isDigit(char) {
    return char >= '0' && char <= '9';
  }
  
  /**
   * 将盲文转换回文字（用于验证）
   */
  reverse(brailleText) {
    // 反向映射表
    const reverseMap = {};
    for (const [key, value] of Object.entries(this.letterMap)) {
      reverseMap[value] = key;
    }
    
    let result = '';
    let i = 0;
    let numberMode = false;
    
    while (i < brailleText.length) {
      const char = brailleText[i];
      
      if (char === '⠼') {
        numberMode = true;
        i++;
        continue;
      }
      
      if (reverseMap[char]) {
        if (numberMode) {
          // 数字模式：将字母映射回数字
          const letterToDigit = {
            'a': '1', 'b': '2', 'c': '3', 'd': '4', 'e': '5',
            'f': '6', 'g': '7', 'h': '8', 'i': '9', 'j': '0'
          };
          result += letterToDigit[reverseMap[char]];
          numberMode = false;
        } else {
          result += reverseMap[char];
        }
      }
      
      i++;
    }
    
    return result;
  }
  
  /**
   * 获取盲文的点阵可视化表示
   */
  visualize(brailleChar) {
    // 盲文点位映射表（6位二进制，表示6个点）
    const brailleDotPatterns = {
      '⠁': [1,0,0,0,0,0], // a
      '⠃': [1,1,0,0,0,0], // b
      '⠉': [1,0,0,1,0,0], // c
      '⠙': [1,0,0,1,1,0], // d
      '⠑': [1,0,0,0,1,0], // e
      '⠋': [1,1,0,1,0,0], // f
      '⠛': [1,1,0,1,1,0], // g
      '⠓': [1,1,0,0,1,0], // h
      '⠊': [0,1,0,1,0,0], // i
      '⠚': [0,1,0,1,1,0], // j
      '⠅': [1,0,0,0,0,1], // k
      '⠇': [1,1,0,0,0,1], // l
      '⠍': [1,0,0,1,0,1], // m
      '⠝': [1,0,0,1,1,1], // n
      '⠕': [1,0,0,0,1,1], // o
      '⠏': [1,1,0,1,0,1], // p
      '⠟': [1,1,0,1,1,1], // q
      '⠗': [1,1,0,0,1,1], // r
      '⠎': [0,1,0,1,0,1], // s
      '⠞': [0,1,0,1,1,1], // t
      '⠥': [1,0,1,0,0,1], // u
      '⠧': [1,1,1,0,0,1], // v
      '⠺': [1,0,1,1,0,1], // w
      '⠭': [1,0,1,1,1,1], // x
      '⠽': [1,0,1,0,1,1], // y
      '⠵': [1,1,1,1,1,1], // z
    };
    
    const pattern = brailleDotPatterns[brailleChar] || [0,0,0,0,0,0];
    
    // 返回2x3网格的可视化
    return `
      ${pattern[0] ? '●' : '○'} ${pattern[3] ? '●' : '○'}
      ${pattern[1] ? '●' : '○'} ${pattern[4] ? '●' : '○'}
      ${pattern[2] ? '●' : '○'} ${pattern[5] ? '●' : '○'}
    `;
  }
}

export default BrailleConverter;