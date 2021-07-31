<template>
  <el-select
    v-if="show"
    v-model="self_value"
    multiple
    filterable
    remote
    reserve-keyword
    :placeholder="`请输入${mapping.typeWord[type]}名称`"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="onChange"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import * as tagApi from '@/api/tag';
export default {
  props: {
    /**
     * 类别
     * region: 地区
     * org: 机构
     * trade: 行业
     */
    type: {
      type: String,
      require: true,
      validator(value) {
        return ['region', 'org', 'trade'].includes(value);
      }
    },
    /**
     * v-model双向绑定
     */
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      mapping: {
        // 类型文字映射
        typeWord: {
          region: '地区',
          org: '机构',
          trade: '行业'
        }
      },
      // 类别值映射
      typeValMap: {
        region: 1,
        trade: 2,
        org: 3
      },
      show: true,
      loading: false,
      self_value: [],
      options: []
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val, old) {
        this.self_value = val;
        // 初始化选中标签
        if (old && !old.length && !this.options.length) {
          this.initValue();
        }
      }
    }
  },
  methods: {
    async remoteMethod(val) {
      if (!val) {
        return;
      }
      this.loading = true;
      let { code, data } = await tagApi.search({
        type: this.typeValMap[this.type], // region: 1 trade: 2 org: 3
        search: val
      });
      this.loading = false;
      if (code === 0) {
        this.options = data;
      } else {
        this.options = [];
      }
    },
    async initValue() {
      if (!this.value.length) {
        return;
      }
      this.loading = true;
      let { code, data } = await tagApi.getListByIds(this.value);
      this.loading = false;
      if (code === 0) {
        this.options = data;
      } else {
        this.options = [];
      }
      this.reRender();
    },
    // 重新渲染
    reRender() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onChange(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    }
  },
  mounted() {
    this.initValue();
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  /deep/ .el-tag {
    &__close.el-icon-close {
      background-color: transparent;
      &:hover {
        color: inherit;
        background-color: #d9d9d9;
      }
    }
    &--info {
      color: rgba(0, 0, 0, 0.65);
      border-color: #d9d9d9;
      background-color: #f7f7f7;
    }
  }
}
</style>
