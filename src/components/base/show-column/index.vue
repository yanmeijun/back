<template>
  <el-popover
    popper-class="column-popper"
    placement="bottom-end"
    width="470"
    trigger="click"
  >
    <div class="flex justify-between align-center title">
      <span>列展示</span>
      <el-button type="text" @click="onReset">重置</el-button>
    </div>
    <el-checkbox-group
      class="flex flex-wrap group"
      v-model="sVal"
      @change="onChange"
    >
      <div
        class="checkbox-item"
        v-for="item in list"
        :key="item.prop"
        :class="{ hide: item.hiddenColumn }"
      >
        <el-checkbox
          v-if="!item.hiddenColumn"
          :label="item.prop"
          :disabled="allShowColumn.includes(item.prop)"
          >{{ item.label }}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <el-button slot="reference" class="show-btn"
      >显示字段<i class="el-icon-arrow-down el-icon--right"></i
    ></el-button>
    <div class="bg" v-show="fullscreenLoading">
      <img class="bg-loading" :src="svg" alt="loading" />
    </div>
  </el-popover>
</template>
<script>
import svg from '@/assets/img/loading-spin2.svg';
export default {
  name: 'show-column',
  data() {
    return {
      svg,
      sVal: [],
      preVal: [],
      list: [],
      fullscreenLoading: false
    };
  },
  props: {
    // 显示字段
    value: {
      type: Array,
      default: () => []
    },
    // 表格配置信息
    tableOption: {
      type: Object,
      default: () => {}
    },
    // 一直显示字段: disabled 不可修改显示/隐藏
    allShowColumn: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.sVal = val;
      },
      deep: true
    },
    tableOption(val) {
      this.list = this.getList(val.column).flat(Infinity);
    }
  },
  mounted() {
    this.sVal = this.value;
    this.preVal = this.value;
    this.list = this.getList(this.tableOption.column).flat(Infinity);
  },
  methods: {
    onChange(val) {
      let _self = this;
      _self.fullscreenLoading = true;
      setTimeout(() => {
        _self.$emit('input', val);
        _self.fullscreenLoading = false;
      }, 500);
    },
    onReset() {
      let _self = this;
      _self.fullscreenLoading = true;
      setTimeout(() => {
        _self.$emit('input', this.preVal);
        _self.fullscreenLoading = false;
      }, 500);
    },
    getList(arr) {
      return arr.map(ele => {
        if (ele.children && ele.children.length > 0) {
          return this.getList(ele.children);
        }
        return ele;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  &.flex-wrap {
    flex-wrap: wrap;
  }
  &.justify-between {
    justify-content: space-between;
  }
  &.align-center {
    align-items: center;
  }
}
.show-btn {
  margin: 0 10px;
}
.title {
  padding: 0 10px 0 16px;
  height: 44px;
  border-bottom: 1px solid #e8eaec;
}
.group {
  padding: 16px 16px 6px;
  ::v-deep {
    .checkbox-item {
      flex: 0 0 33.33%;
      &.hide {
        display: none;
      }
    }
    .el-checkbox {
      padding-right: 8px;
      margin-right: 0;
      margin-bottom: 10px;
    }
    .label {
      flex: 1;
    }
  }
}
.bg {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
  .bg-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 24px;
    height: 24px;
    margin: -12px 0 0 -12px;
    animation: loading-rotate 0.7s linear infinite;
  }
}
</style>
<style>
.column-popper {
  padding: 0;
}
</style>
