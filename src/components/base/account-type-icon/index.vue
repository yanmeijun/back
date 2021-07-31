<template>
  <div class="account-type-icon" :style="style"></div>
</template>
<script>
import png101 from '@/assets/img/account-icon/1.png';
import png102 from '@/assets/img/account-icon/2.png';
import png103 from '@/assets/img/account-icon/3.png';
import png111 from '@/assets/img/account-icon/4.png';
import png113 from '@/assets/img/account-icon/5.png';

// 其他 -> 1.
import png114 from '@/assets/img/account-icon/6.png';

// 人民号 -> 南方号
import png112 from '@/assets/img/account-icon/7.png';
export default {
  name: 'account-type-icon',
  data() {
    return {
      png101,
      png102,
      png103,
      png111,
      png113,
      png114,
      png112,
      style: {}
    };
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {},
  watch: {
    type() {
      this.getStyle();
    }
  },
  mounted() {
    this.getStyle();
  },
  methods: {
    getStyle() {
      if (!this.type) return {};
      let png = require(`@/assets/img/account-icon/${this.type}.png`);
      this.style = {
        backgroundImage: `url('${png}')`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.account-type-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
</style>
