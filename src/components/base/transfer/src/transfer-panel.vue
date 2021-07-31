<template>
  <div
    class="el-transfer-panel"
    :class="{
      'is-left': isLeft,
      'is-vip': isVip,
      'is-vip-tip': isVipTip && isVip
    }"
  >
    <el-input
      class="el-transfer-panel__filter"
      v-model="query"
      size="small"
      :placeholder="placeholder"
      @mouseenter.native="inputHover = true"
      @mouseleave.native="inputHover = false"
      v-if="filterable"
    >
      <i
        slot="suffix"
        :class="['iconfont el-input__icon icontubiaozhizuomoban21']"
      ></i>
    </el-input>
    <div
      class="el-transfer-panel__header flex align-center justify-between"
      :class="{ 'is-bg': !isLeft }"
    >
      <div class="vip-checked flex align-center" v-if="isVip && isLeft">
        <el-checkbox
          v-model="allChecked"
          @change="handleAllCheckedChange"
          :indeterminate="isIndeterminate"
        >
          <!-- {{ isLeft ? '全选' : `${checked.length}/${filteredData.length}项` }} -->
        </el-checkbox>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link flex align-center">
            <i class="el-icon-arrow-down"></i>
            {{ checkedSelect.label }}
            <i
              v-show="checkedSelect.value === 2"
              class="iconfont icontubiaozhizuomoban4 vip-icon"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown" align="center">
            <el-dropdown-item
              v-for="item in checkedSelectList"
              :key="item.value"
              :command="item"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="right-item" v-else>
        <div class="flex align-center" v-if="isVip">
          <el-checkbox
            v-model="rightNoVipChecked"
            @change="handleRightNoVipCheckedChange"
            :indeterminate="isIndeterNoVipminate"
          >
            {{
              `${isNoVipLenChecked}/${
                filteredData.filter(ele => !ele.isVip).length
              }项`
            }}
          </el-checkbox>
          <el-checkbox
            v-model="rightVipChecked"
            @change="handleRightVipCheckedChange"
            :indeterminate="isIndeterVipminate"
            style="margin-left: 17px;"
          >
            {{
              `${isVipLenChecked}/${
                filteredData.filter(ele => ele.isVip).length
              }项`
            }}
            <i class="iconfont icontubiaozhizuomoban4 vip-icon-right"></i>
          </el-checkbox>
        </div>
        <el-checkbox
          v-else
          v-model="allChecked"
          @change="handleAllCheckedChange"
          :indeterminate="isIndeterminate"
        >
          {{ isLeft ? '全选' : `${checked.length}/${filteredData.length}项` }}
        </el-checkbox>
      </div>

      <!-- <span>{{ checkedSummary }}</span> -->
      <!-- <el-switch v-model="leval" active-text="仅看本级" v-if="isLeft" @change="handleaveChange"></el-switch> -->
      <span v-if="!isLeft" class="clear" @click="clearAll">全部清空</span>
    </div>

    <div
      :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']"
    >
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list"
      >
        <el-checkbox
          class="el-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData"
        >
          <option-content v-if="!isLeft" :option="item"></option-content>
          <div class="info" v-else>
            <p class="word-ellipsis-1">
              {{ item[labelProp] }}
            </p>
            <p class="order-num">10000</p>
            <i
              class="iconfont icontubiaozhizuomoban5 vip-icon"
              v-if="isVip && item.isVip"
            ></i>
          </div>
          <i
            class="iconfont icontubiaozhizuomoban4 vip-icon-right"
            v-if="!isLeft && isVip && item.isVip"
          ></i>
        </el-checkbox>
      </el-checkbox-group>
      <p class="el-transfer-panel__empty" v-show="hasNoMatch">
        {{ t('el.transfer.noMatch') }}
      </p>
      <p
        class="el-transfer-panel__empty is-transfer-empty"
        v-show="data.length === 0 && !hasNoMatch"
      >
        <i class="iconfont"></i>
        <span>暂无数据</span>
      </p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
import ElCheckbox from 'element-ui/packages/checkbox';
import ElInput from 'element-ui/packages/input';
import Locale from 'element-ui/src/mixins/locale';

export default {
  mixins: [Locale],

  name: 'ElTransferPanel',

  componentName: 'ElTransferPanel',

  components: {
    ElCheckboxGroup,
    ElCheckbox,
    ElInput,
    OptionContent: {
      props: {
        option: Object
      },
      render(h) {
        const getParent = vm => {
          if (vm.$options.componentName === 'ElTransferPanel') {
            return vm;
          } else if (vm.$parent) {
            return getParent(vm.$parent);
          } else {
            return vm;
          }
        };
        const panel = getParent(this);
        const transfer = panel.$parent || panel;
        return panel.renderContent ? (
          panel.renderContent(h, this.option)
        ) : transfer.$scopedSlots.default ? (
          transfer.$scopedSlots.default({ option: this.option })
        ) : (
          <span>
            {this.option[panel.labelProp] || this.option[panel.keyProp]}
          </span>
        );
      }
    }
  },

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    isLeft: Boolean,
    isVip: Boolean,
    isVipTip: Boolean,
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    levalMethod: Function,
    defaultChecked: Array,
    props: Object,
    levalKey: String | Number
  },

  data() {
    return {
      leval: false,
      checked: [],
      allChecked: false,
      rightNoVipChecked: false,
      rightVipChecked: false,
      query: '',
      inputHover: false,
      checkChangeByUser: true,
      checkedSelectList: [
        {
          label: '全选',
          value: 1
        },
        {
          label: '付费全选',
          value: 2
        }
      ],
      checkedSelect: {
        label: '全选',
        value: 1
      }
    };
  },

  watch: {
    checked(val, oldVal) {
      this.updateAllChecked();
      if (this.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
        this.$emit('checked-change', val, movedKeys);
      } else {
        this.$emit('checked-change', val);
        this.checkChangeByUser = true;
      }
    },

    data() {
      const checked = [];
      const filteredDataKeys = this.filteredData.map(
        item => item[this.keyProp]
      );
      this.checked.forEach(item => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item);
        }
      });
      this.checkChangeByUser = false;
      this.checked = checked;
    },

    checkableData() {
      this.updateAllChecked();
    },

    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (
          oldVal &&
          val.length === oldVal.length &&
          val.every(item => oldVal.indexOf(item) > -1)
        )
          return;
        const checked = [];
        const checkableDataKeys = this.checkableData.map(
          item => item[this.keyProp]
        );
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      }
    }
  },

  computed: {
    filteredData() {
      return this.data.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(
            this.query,
            this.levalKey,
            this.leval,
            this.isLeft,
            item
          );
        } else {
          const label = item[this.labelProp] || item[this.keyProp].toString();
          return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }
      });
    },

    checkableData() {
      return this.filteredData.filter(item => !item[this.disabledProp]);
    },

    checkedSummary() {
      const checkedLength = this.checked.length;
      const dataLength = this.data.length;
      const { noChecked, hasChecked } = this.format;
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked
              .replace(/\${checked}/g, checkedLength)
              .replace(/\${total}/g, dataLength)
          : noChecked.replace(/\${total}/g, dataLength);
      } else {
        return `${checkedLength}/${dataLength}`;
      }
    },

    isIndeterminate() {
      const checkedLength = this.checked.length;
      return checkedLength > 0 && checkedLength < this.checkableData.length;
    },
    isIndeterNoVipminate() {
      const checkedLength = this.checked.length;
      return (
        checkedLength > 0 &&
        checkedLength < this.checkableData.length &&
        this.rightNoVipChecked
      );
    },
    isIndeterVipminate() {
      const checkedLength = this.checked.length;
      return (
        checkedLength > 0 &&
        checkedLength < this.checkableData.length &&
        this.rightVipChecked
      );
    },
    isVipLenChecked() {
      return this.filteredData.filter(
        ele => ele.isVip && this.checked.includes(ele.key)
      ).length;
    },
    isNoVipLenChecked() {
      return this.filteredData.filter(
        ele => !ele.isVip && this.checked.includes(ele.key)
      ).length;
    },

    hasNoMatch() {
      return this.query.length > 0 && this.filteredData.length === 0;
    },

    inputIcon() {
      return this.query.length > 0 && this.inputHover
        ? 'circle-close'
        : 'search';
    },

    labelProp() {
      return this.props.label || 'label';
    },

    keyProp() {
      return this.props.key || 'key';
    },

    disabledProp() {
      return this.props.disabled || 'disabled';
    },

    hasFooter() {
      return !!this.$slots.default;
    }
  },

  methods: {
    updateAllChecked() {
      const checkableDataKeys = this.checkableData.map(
        item => item[this.keyProp]
      );
      this.allChecked =
        checkableDataKeys.length > 0 &&
        checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
    },

    handleAllCheckedChange(value) {
      if (this.isVip) {
        this.checked = value
          ? this.checkableData
              .filter(ele => {
                return this.checkedSelect.value === 1 ? ele : ele.isVip;
              })
              .map(item => item[this.keyProp])
          : [];
        // this.checked = value
        //   ? this.checkableData.map(item => item[this.keyProp])
        //   : [];
        return;
      }
      this.checked = value
        ? this.checkableData.map(item => item[this.keyProp])
        : [];
    },
    handleRightVipCheckedChange(value) {
      let normalArr = [];
      if (this.rightNoVipChecked) {
        normalArr = this.checkableData
          .filter(ele => {
            return !ele.isVip;
          })
          .map(ele => ele.key);
      }
      this.checked = value
        ? this.checkableData
            .filter(ele => {
              return this.rightNoVipChecked ? ele : ele.isVip;
            })
            .map(item => item[this.keyProp])
        : normalArr;
    },
    handleRightNoVipCheckedChange(value) {
      let normalArr = [];
      if (this.rightVipChecked) {
        normalArr = this.checkableData
          .filter(ele => {
            return ele.isVip;
          })
          .map(ele => ele.key);
      }
      this.checked = value
        ? this.checkableData
            .filter(ele => {
              return this.rightVipChecked ? ele : !ele.isVip;
            })
            .map(item => item[this.keyProp])
        : normalArr;
    },
    handleaveChange(value) {
      this.leval = value;
    },
    clearQuery() {
      if (this.inputIcon === 'circle-close') {
        this.query = '';
      }
    },
    clearAll() {
      this.$emit('clearMethod');
    },
    handleCommand(command) {
      this.checkedSelect = command;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
$empty: '~@/assets/img/empty.png';
::v-deep.el-transfer-panel {
  width: 250px;
  padding-left: 20px;
  border: 0;
  border-radius: 0;
  border-left: 1px solid #e8e8e8;
  .is-transfer-empty {
    padding-top: 11vh;
    & > * {
      display: block;
    }
    i {
      background: url($empty) no-repeat;
      background-size: 100% 100%;
      width: 92px;
      height: 84px !important;
      margin: 0 auto;
    }
    span {
      color: $mainBlack45;
    }
  }

  &.is-vip {
    width: 337px;
  }
  &.is-vip-tip {
    padding-top: 52px !important;
  }

  &.is-left {
    width: 270px;
    padding: 0 20px;
    border-left: 0;
    border-right: 1px solid #e8e8e8;
    .el-transfer-panel__body {
      .el-checkbox {
        padding: 8px 12px;
        height: auto;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        line-height: 18px;
        &.el-transfer-panel__item .el-checkbox__input {
          top: 20px;
        }
        &:hover {
          background: $mainBgHover;
        }
        .el-checkbox__label {
          max-width: calc(100% - 12px);
        }
        .info {
          line-height: 18px;
        }
      }
      .el-transfer-panel__item {
        .vip-icon {
          position: absolute;
          right: -1px;
          top: -2px;
          color: #fd8f14;
          margin: 0 0 0 4px;
        }
      }
    }
    .order-num {
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .vip-checked {
    .el-dropdown {
      height: 20px;
      line-height: 20px;
      .el-icon-arrow-down {
        margin: 0 4px 0 2px;
      }
      .vip-icon {
        color: #fd8f14;
        margin: 0 0 0 4px;
      }
    }
  }

  .el-transfer-panel__header {
    background: transparent;
    border: 0;
    &.is-bg {
      margin-top: 8px;
      padding: 6px 12px;
      border-radius: 4px;
      background: $mainBgHover;
      border: 1px solid $mainBorderColor;
      .clear {
        font-size: 14px;
        color: var(--primary);
        cursor: pointer;
      }
    }
    .el-checkbox {
      margin: 0;
      .el-checkbox__label {
        font-size: 14px;
      }
    }
  }
  .el-transfer-panel__body {
    height: 40vh;
    .el-checkbox-group {
      height: 100%;
    }
    .el-checkbox {
      display: flex !important;
      align-items: center;
      margin-bottom: 8px;
      .el-checkbox__label {
        max-width: calc(100% - 12px);
      }
    }
  }
  .vip-icon-right {
    color: #fd8f14;
    margin: 0 0 0 4px;
  }
}
::v-deep {
  .el-transfer-panel__filter {
    margin: 10px 0 0 0;
    .el-input__inner {
      padding: 0 32px 0 15px;
      border-radius: 4px;
    }
  }
  .el-switch {
    &.is-checked {
      .el-switch__core {
        &:after {
          margin-left: -14px;
        }
      }
    }
    .el-switch__core {
      height: 16px;
      width: 28px !important;
      &:after {
        top: 0;
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>
