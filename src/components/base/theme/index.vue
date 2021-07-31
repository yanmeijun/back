<template>
  <el-color-picker
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    v-model="theme"
    size="small"
    color-format="rgb"
    :predefine="predefineColors"
    @change="updateTheme"
  ></el-color-picker>
</template>

<script>
import { setStore, getStore } from '@/util/store';
// const ORIGINAL_THEME = '#1890ff'; // default color
const ORIGINAL_THEME = 'rgb(24,144,255)'; // default color

export default {
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: ORIGINAL_THEME,
      predefineColors: [ORIGINAL_THEME]
    };
  },
  mounted() {
    const theme = getStore({
      name: 'theme'
    });
    this.theme = theme || ORIGINAL_THEME;
    this.updateTheme(this.theme);
  },
  methods: {
    updateTheme(val) {
      setStore({
        content: val,
        name: 'theme'
      });
      const $root = document.querySelector('#root');
      const colorRgb = this.getColor(val);
      const colorHsl = this.rgbToHsl(...colorRgb.split(','));
      colorHsl[0] = colorHsl[0] * 1.03;
      colorHsl[1] = colorHsl[1] * 0.63;
      colorHsl[2] = colorHsl[2] * 0.85;
      const colorRgbDark = this.hslToRgb(...colorHsl);
      $root.innerHTML = `:root{--primary: ${val}; --primary-opacity: ${colorRgb}; --primary-dark: ${colorRgbDark}}`;
    },
    getColor(color) {
      let a = color.toLowerCase().replace(/[rgb(|)|\s]/g, '');
      return a;
    },
    rgbToHsl(r, g, b) {
      r = r / 255;
      g = g / 255;
      b = b / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const num = max - min;
      let h = 0;
      let s = 0;
      let l = 0.5 * (max + min);
      if (max !== min) {
        s = l <= 0.5 ? num / (2 * l) : num / (2 - 2 * l);
        switch (max) {
          case b:
            h = ((r - g) / num) * 60 + 240;
            break;
          case g:
            h = ((b - r) / num) * 60 + 120;
            break;
          case r:
            h = g >= b ? ((g - b) / num) * 60 : ((g - b) / num) * 60 + 360;
            break;
          default:
            break;
        }
      }
      h = Math.round(h);
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      return [h, s, l];
    },
    hslToRgb(h, s, l) {
      h = h / 360;
      s = s / 100;
      l = l / 100;
      if (s === 0) {
        l = Math.round(l * 255);
        return `rgb(${l}, ${l}, ${l})`;
      }
      const getRGB = num => {
        let q = l >= 0.5 ? l + s - l * s : l * (1 + s); // 注意是数字1加上s，不是字母l
        let p = 2 * l - q;
        if (num < 0) {
          num += 1;
        }
        if (num > 1) {
          num -= 1;
        }
        switch (true) {
          case num > 2 / 3:
            num = p;
            break;
          case num >= 1 / 2:
            num = p + (q - p) * 6 * (2 / 3 - num);
            break;
          case num >= 1 / 6:
            num = q;
            break;
          default:
            num = p + (q - p) * 6 * num;
            break;
        }
        return Math.round(num * 255);
      };
      let tr = getRGB(h + 1 / 3);
      let tg = getRGB(h);
      let tb = getRGB(h - 1 / 3);
      return `${tr},${tg},${tb}`;
    },
    colorRgb(color) {
      const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      let sColor = color.toLowerCase();
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          let sColorNew = '#';
          for (let i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        //处理六位的颜色值
        const sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
        }
        return sColorChange.join(',');
      } else {
        return sColor;
      }
    }
  }
};
</script>

<style>
.theme-picker {
  margin: 0 16px;
}
.theme-picker .el-color-picker__trigger {
  vertical-align: middle;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
