<template>
  <div class="m-nodata">
    <slot>
      <div class="m-nodata_icon">
        <!-- 图片 -->
        <template v-if="iconType === iconTypeEnum.image">
          <img :class="{ left8: icon === '01' }" :src="imageIcon" />
        </template>
        <!-- 字体图标 -->
        <template v-else-if="iconType === iconTypeEnum.iconfont">
          <i :class="icon"></i>
        </template>
        <!-- 矢量图 -->
        <template v-else-if="iconType === iconTypeEnum.svg">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="`#${icon}`"></use>
          </svg>
        </template>
      </div>
      <div class="m-nodata_msg">{{ text }}</div>
    </slot>
  </div>
</template>

<script>
import Img_01 from './images/01.png';
export default {
  props: {
    /**
     * 图标类型
     * iconfont：字体图标
     * image：图片
     * svg: svg图标
     */
    iconType: {
      type: String,
      default: 'image'
    },
    /**
     * iconType不同取值规则不同 如下：
     * iconfont: 示例：'iconfont iconfont-nodata'
     * image: 图片时 icon值只能指定值或者公网图片路径(指定值：'01')
     * svg: 项目使用svg图标代码 示例：'iconfont-nodata'
     */
    icon: {
      type: String,
      default: '01'
    },
    /**
     * 显示在图标下方的无数据文案
     */
    text: {
      type: String,
      default: '暂无数据'
    }
  },
  data() {
    return {
      iconTypeEnum: {
        image: 'image',
        iconfont: 'iconfont',
        svg: 'svg'
      }
    };
  },
  computed: {
    imageIcon() {
      if (this.iconType !== this.iconTypeEnum.image) {
        return '';
      }

      let isUrl = /^http[s]?:\/\/.*/.test(this.icon);
      if (isUrl) {
        return this.icon;
      }

      let img = '';
      switch (this.icon) {
        case '01':
          img = Img_01;
          break;
      }
      return img;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-nodata {
  display: inline-block;
  max-width: 300px;
  line-height: 24px;
  text-align: center;
  &_icon {
    line-height: 0;
    color: rgba(0, 0, 0, 0.25);
    img {
      position: relative;
      width: 100px;
      &.left8 {
        left: 8px;
      }
    }
    i,
    svg {
      font-size: 80px;
    }
    & + .m-nodata_msg {
      margin-top: 0px;
    }
  }
  &_msg {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
