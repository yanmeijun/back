<!--
  下拉组织树组件
  Attributes：详情描述见 props
  Events：详情见methods中emit开头的函数
  Slots：无
  Methods：
    getFlatData: 获取已经懒加载的所有平铺数据
-->
<template>
  <div class="el-select">
    <el-popover
      ref="popover"
      placement="bottom-start"
      trigger="click"
      transition="el-zoom-in-top"
      :disabled="disabled"
      @show="onDropdownShow"
      @hide="onDropdownHide"
    >
      <div class="select_input-wrap" slot="reference">
        <div
          ref="tags"
          class="el-select__tags flex"
          style="flex-wrap: nowrap; overflow: hidden"
        >
          <el-tag
            v-for="(item, index) in selection"
            :key="item.id"
            :title="item.custName"
            type="info"
            :closable="!disabled"
            disable-transitions
            @close="onSelectionItemClose(item, index)"
          >
            <span class="tag_name">{{ item.custName }}</span>
          </el-tag>
        </div>
        <el-input
          ref="input"
          class="select-input"
          readonly
          :disabled="disabled"
          :placeholder="selection.length ? '' : placeholder"
        >
          <span slot="suffix">
            <span
              :class="[
                'el-select__caret',
                'el-input__icon',
                'el-icon-arrow-up',
                {
                  'is-reverse': dropdown.visible
                }
              ]"
            ></span>
          </span>
        </el-input>
      </div>

      <!-- 过滤 -->
      <div class="filter" v-if="filter">
        <el-input
          class="filter-kw"
          v-model="filterKW"
          placeholder="输入关键字进行过滤"
        />
      </div>
      <!-- 树 -->
      <el-tree
        v-if="reloadFlag"
        v-loading="loading"
        class="tree"
        ref="tree"
        :node-key="valueKey"
        :show-checkbox="multiple"
        lazy
        icon-class="el-icon-arrow-right"
        :check-strictly="checkStrictly"
        :current-node-key="!multiple ? value : null"
        :default-checked-keys="multiple ? value : []"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :props="props"
        :data="data"
        :load="loadNode"
        @current-change="onCurrentChange"
        @check="onCheck"
      >
      </el-tree>
    </el-popover>
  </div>
</template>

<script>
import debounce from 'throttle-debounce/debounce';
import * as commonApi from '@/api/new-media/common';
import * as custAccountApi from '@/api/cust-account';
export default {
  props: {
    /**
     * 数据映射主键 配置后值以此属性作为返回和回显
     * 注：暂时弃用 接口暂不支持 后续有需求再扩展
     */
    valueKey: {
      type: [String, Number],
      default: 'id'
    },
    /**
     * 初始父级
     */
    parent: Object,
    placeholder: String,
    /**
     * 双向绑定值
     * 单选是主键
     * 多选是主键数组
     */
    value: {
      type: [String, Number, Array],
      default() {
        return null;
      }
    },
    /**
     * 是否显示过滤框
     * 默认true 显示
     */
    filter: {
      type: Boolean,
      default: true
    },
    /**
     * 是否多选 默认false
     * 注：暂时弃用 无回显接口（根据主键列表获取节点列表信息）
     */
    multiple: Boolean,
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 同el-tree配置：在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
     */
    checkStrictly: Boolean
  },
  data() {
    return {
      loading: false,
      reloadFlag: true,
      innerValue: this.value, // 记录内部操作的value（非外部修改传入）
      filterKW: '', // 筛选关键字
      // 树属性映射
      props: {
        label: 'custName',
        children: 'children'
      },
      data: [],
      // 选中数据
      selection: [],
      // input
      input: {
        el: null,
        elInitHeight: null
      },
      // 下拉 popover
      dropdown: {
        visible: false
      },
      flatData: [] // 平铺树数据
    };
  },
  watch: {
    value(val, old) {
      // 如果是外部修改值引发的变动
      if (val !== this.innerValue) {
        this.updateSection();
      }
    },
    filterKW(val) {
      this.remoteFilter(val);
    },
    selection: {
      deep: true,
      handler() {
        this.updateInputHeight();
      }
    },
    'parent.id'() {
      this.reload();
    }
  },
  methods: {
    // 懒加载树node
    async loadNode(node, resolve) {
      let isLoadRoot = node.key ? false : true;
      // 如果指定根级则返回指定根级
      if (isLoadRoot && this.parent && this.parent.id) {
        let parent = JSON.parse(JSON.stringify(this.parent));
        resolve([parent]);
        // 平铺树数据累加
        this.flatData.push(parent);
        return;
      }

      if (isLoadRoot) {
        this.loading = true;
      }
      let { code, data } = await commonApi.getCustomerTree({
        isAll: 0,
        custCode: isLoadRoot ? '' : node.data.custCode,
        parentId: isLoadRoot ? 0 : '',
        delFlag: 2
      });
      if (isLoadRoot) {
        this.loading = false;
      }
      if (code === 0) {
        resolve(data);
        // 平铺树数据累加
        this.flatData.push(...data);
      } else {
        resolve([]);
      }
    },
    // 远程筛选
    // eslint-disable-next-line
    remoteFilter: debounce(500, false, async function (val) {
      if (!val) {
        this.reloadFlag = false;
        this.$nextTick(() => {
          this.reloadFlag = true;
        });
        return;
      }
      this.loading = true;
      // 远程加载
      let { code, data } = await commonApi.getCustomerTree({
        custInfo: val,
        isAll: 2, // 查询树结构
        delFlag: 2
      });
      if (code === 0) {
        this.data = data;
      } else {
        this.data = [];
      }
      this.loading = false;
    }),
    onDropdownShow() {
      this.dropdown.visible = true;
    },
    onDropdownHide() {
      this.dropdown.visible = false;
    },
    // 选中标签关闭回调
    onSelectionItemClose(item, index) {
      this.selection.splice(index, 1);
      // 如果单选 移除后去除高亮
      if (!this.multiple) {
        this.$refs.tree.setCurrentKey(null);
      } else {
        this.$refs.tree.setChecked(item.id, false);
      }
      this.emitInput();
      this.emitChange();
    },
    // 树当前节点改变回调(对应单选)
    onCurrentChange(data) {
      if (!this.multiple) {
        // 单选处理
        this.selection = [data];
        this.emitInput();
        this.emitChange();
        this.$refs['popover'].doClose();
      }
    },
    onCheck(data, obj) {
      this.selection = obj.checkedNodes;
      this.emitInput();
      this.emitChange();
    },
    // 树选中节点变化回调(对应多选)
    // onCheckChange(data, checked, childHasChecked) {
    //   debugger
    //   if (checked) {
    //     this.selection.push(data);
    //   } else {
    //     let index = this.selection.findIndex(item => item.id === data.id);
    //     if (index !== -1) {
    //       this.selection.splice(index, 1);
    //     }
    //   }
    //   this.emitInput();
    //   this.emitChange();
    // },
    updateInputHeight() {
      if (!this.multiple) {
        return;
      }
      this.$nextTick(() => {
        if (!this.selection.length) {
          this.input.el.style.height = this.input.elInitHeight;
          return;
        }
        this.input.el.style.height = this.$refs.tags.clientHeight + 4 + 'px';
      });
    },
    // 根据主键集合获取节点列表
    getNodeListByKeys(keys) {
      return new Promise(async (resolve, reject) => {
        if (!keys || !keys.length) {
          resolve([]);
        }
        if (this.multiple) {
          // 多选
          let msg = '暂不支持多选回显';
          console.warn(msg);
          resolve([]);
        } else {
          // 单选
          let { code, data } = await custAccountApi.get(keys[0]);
          if (code === 0) {
            resolve([data]);
          } else {
            resolve([]);
          }
        }
      });
    },
    // 初始化数据
    async initData() {
      // input相关
      let inputEl = this.$refs.input.$el.querySelector('input');
      this.input.el = inputEl;
      this.input.elInitHeight = inputEl.clientHeight;
      this.updateSection();
    },
    // 更新选中
    async updateSection() {
      if (this.value) {
        let keys = this.multiple ? this.value : [this.value];
        this.selection = await this.getNodeListByKeys(keys);
      } else {
        this.selection = [];
      }
    },
    /**
     * 自定义事件：input（v-model）
     * 返回：
     *   单选时：标识key值
     *   多选时：标识key值集合
     */
    emitInput() {
      let val = null;
      if (this.multiple) {
        val = this.selection.map(item => item[this.valueKey]);
      } else {
        val = this.selection.length ? this.selection[0][this.valueKey] : null;
      }
      this.innerValue = val;
      this.$emit('input', val);
    },
    /**
     * 自定义事件：change
     * 返回：
     *   单选时：当前节点data对象
     *   多选时：选中节点data对象集合
     */
    emitChange() {
      let data = null;
      if (this.multiple) {
        data = JSON.parse(JSON.stringify(this.selection));
      } else {
        data = this.selection.length ? this.selection[0] : null;
      }
      this.$emit('change', data);
    },
    // 对外-获取已经懒加载的所有平铺数据
    getFlatData() {
      return JSON.parse(JSON.stringify(this.flatData));
    },
    reload() {
      this.reloadFlag = false;
      this.$nextTick(() => {
        this.reloadFlag = true;
      });
      if (this.selection.length) {
        this.selection = [];
        this.emitInput();
        this.emitChange();
      }
    }
  },
  mounted() {
    this.initData();
    if (this.multiple) {
      window.addEventListener('resize', this.updateInputHeight);
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.updateInputHeight);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.select_input-wrap {
  position: relative;
  .el-select__tags {
    right: 32px;
    left: 0;
    .el-tag {
      display: flex;
      align-items: center;
      max-width: 100%;
      .tag_name {
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      /deep/ .el-tag__close {
        flex-shrink: 0;
      }
    }
  }
}

.filter {
  margin-bottom: 10px;
}

.tree {
  max-height: 180px;
  overflow: auto;
}
</style>
