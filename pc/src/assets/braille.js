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
      // 'A': '⠠⠁', 'B': '⠠⠃', 'C': '⠠⠉', 'D': '⠠⠙', 'E': '⠠⠑',
      // 'F': '⠠⠋', 'G': '⠠⠛', 'H': '⠠⠓', 'I': '⠠⠊', 'J': '⠠⠚',
      // 'K': '⠠⠅', 'L': '⠠⠇', 'M': '⠠⠍', 'N': '⠠⠝', 'O': '⠠⠕',
      // 'P': '⠠⠏', 'Q': '⠠⠟', 'R': '⠠⠗', 'S': '⠠⠎', 'T': '⠠⠞',
      // 'U': '⠠⠥', 'V': '⠠⠧', 'W': '⠠⠺', 'X': '⠠⠭', 'Y': '⠠⠽',
      // 'Z': '⠠⠵',
      // 数字（需要数字符号前缀）
      // '0': '⠼⠚', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙',
      // '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
      // 常用标点
      // '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖',
      // ':': '⠒', ';': '⠆', '-': '⠤', ' ': ' '  // 空格
    };
    
  }
  
  /**
   * 将普通文本转换为盲文
   * @param {string} text - 输入文本
   * @returns {string} 盲文字符串
   */
  /**
   * 将普通文本转换为盲文，并在字符间插入1或2个随机字母(k-z)（这些随机字母也会被转换为盲文）
   * 可选参数 `fixedLength` 用于指定返回的最终字符数；不足时循环补齐，超出时截断。
   * @param {string} text - 输入文本
   * @param {number|null} fixedLength - 可选，目标输出长度（盲文字符数），默认不裁剪/补齐
   * @returns {string} 盲文字符串
   */
  convert(text, fixedLength = null) {
    if (typeof text !== 'string') text = String(text || '');

    const charsOut = [];

    // helper: convert single character (letters/digits) to braille or keep as-is
    const toBraille = (c) => {
      if (this.isDigit(c)) {
        const digitToLetter = ['j', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        const letter = digitToLetter[parseInt(c, 10)];
        return this.letterMap[letter] || letter;
      }
      if (this.letterMap[c]) return this.letterMap[c];
      const lower = c.toLowerCase();
      if (this.letterMap[lower]) return this.letterMap[lower];
      return c;
    };

    // random letter generator from k..z
    const randLetters = 'kmnopqrstuvwxyz';
    const randLetter = () => randLetters[Math.floor(Math.random() * randLetters.length)];

    // Build base output with random insertions between characters
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const b = toBraille(ch);
      charsOut.push(b);

      // insert 1 or 2 random letters (converted to braille)
      const count = Math.random() < 0.5 ? 1 : 2;
      for (let k = 0; k < count; k++) {
        const r = randLetter();
        charsOut.push(toBraille(r));
      }
    }

    // If fixedLength provided, pad by cycling the current sequence or truncate
    if (Number.isInteger(fixedLength) && fixedLength > 0) {
      if (charsOut.length === 0) return ''.padEnd(fixedLength, ' ');
      // pad by repeating the sequence
      const base = charsOut.slice();
      let idx = 0;
      while (charsOut.length < fixedLength) {
        charsOut.push(base[idx % base.length]);
        idx++;
      }
      if (charsOut.length > fixedLength) charsOut.length = fixedLength;
    }

    return charsOut.join('');
  }
  
  /**
   * 判断字符是否为数字
   */
  isDigit(char) {
    return char >= '0' && char <= '9';
  }
}

export default BrailleConverter;