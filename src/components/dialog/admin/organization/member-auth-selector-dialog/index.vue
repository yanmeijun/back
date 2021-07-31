<template>
  <el-dialog
    class="dialog"
    title="选择数据权限"
    :visible.sync="self_visible"
    :modal="false"
    :close-on-click-modal="false"
    append-to-body
    @open="onOpen"
    @closed="onClosed"
  >
    <div class="main">
      <div class="left">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="单位名称/编码"
        />
        <el-radio-group class="type" v-model="type" @change="onTypeChange">
          <el-radio-button class="el-radio-button--plain" label="org">
            组织单位
          </el-radio-button>
          <el-radio-button class="el-radio-button--plain" label="site">
            网站填报单位
          </el-radio-button>
          <el-radio-button class="el-radio-button--plain" label="newmedia">
            新媒体填报单位
          </el-radio-button>
        </el-radio-group>
        <div
          v-if="infiniteScrollShow"
          class="list"
          v-infinite-scroll="getList"
          :infinite-scroll-distance="5"
          :infinite-scroll-disabled="disabled"
        >
          <el-checkbox-group v-model="selectionVals">
            <el-checkbox
              class="item"
              v-for="item in list"
              :key="item.id"
              :label="item.id"
              border
              @change="onItemCheckChange($event, item)"
            >
              {{ item.custName }} {{ item.custCode }}
            </el-checkbox>
          </el-checkbox-group>
          <div class="load-state">
            <p class="loading" v-show="this.loading">加载中...</p>
            <p class="no-more" v-show="this.noMore">没有更多了</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div v-if="selection.length" class="list">
          <div class="item" v-for="item in selection" :key="item.id">
            <span>{{ item.custName }} {{ item.custCode }}</span>
            <span
              class="close el-icon-close"
              @click="onSelectionItemClose(item)"
            ></span>
          </div>
        </div>
        <no-data v-else class="no-data" />
      </div>
    </div>
    <div class="foot" slot="footer">
      <div class="foot-left">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="isCheckAll"
          @change="onCheckAllChange"
        >
          全选
        </el-checkbox>
        <div class="checked-info">
          <span class="item">已选组织单位 {{ result.org.length }} 项</span>
          <span class="item">网站填报单位 {{ result.site.length }} 项</span>
          <span class="item"
            >新媒体填报单位 {{ result.newmedia.length }} 项</span
          >
        </div>
      </div>
      <div class="foot-right">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onOk">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import * as accountApi from '@/api/cust-account';
import debounce from 'throttle-debounce/debounce';
import NoData from '@/components/base/no-data';
export default {
  components: {
    NoData
  },
  props: {
    /**
     * 是否显示 支持.sync
     */
    visible: {
      type: Boolean,
      default: false
    },
    // 组织|部门id集合
    deptIds: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      self_visible: this.visible,
      infiniteScrollShow: true, // 无限滚动框是否显示 触发重新渲染
      loading: false,
      noMore: false,
      keyword: '',
      type: 'org', // org site newmedia
      /**
       * 类别查询条件映射
       * custLevel|组织类别：0组织单位 1填报单位
       * source|填报类别：WZ网站 BS新媒体
       */
      typeSearchMap: {
        org: {
          custLevel: 0,
          source: 'WZ'
        },
        site: {
          custLevel: 1,
          source: 'WZ'
        },
        newmedia: {
          custLevel: 1,
          source: 'BS'
        }
      },
      list: [],
      isCheckAll: false, // 是否全选
      isIndeterminate: false, // 是否半选状态
      selectionVals: [],
      selection: [],
      page: {
        index: 1,
        size: 15,
        total: 0
      }
    };
  },
  computed: {
    // 选中结果汇总
    result() {
      let result = {
        all: [], // 全部
        org: [], // 组织单位
        site: [], // 网站填报单位
        newmedia: [] // 新媒体填报单位
      };
      this.selection.forEach(item => {
        result.all.push(item);
        if (item.ex_type === 'org') {
          result.org.push(item);
        }
        if (item.ex_type === 'site') {
          result.site.push(item);
        }
        if (item.ex_type === 'newmedia') {
          result.newmedia.push(item);
        }
      });
      return result;
    },
    // 是否禁止触发滚动加载
    disabled() {
      return this.loading || this.noMore;
    }
  },
  watch: {
    visible(val) {
      this.self_visible = val;
    },
    self_visible(val) {
      this.$emit('update:visible', val);
    },
    keyword(val) {
      if (!this.visible) {
        return;
      }
      this.keywordSearch();
    }
  },
  methods: {
    transData(data) {
      data = JSON.parse(JSON.stringify(data));
      data.forEach(item => {
        item.ex_type = this.type;
      });
      return data;
    },
    // 关键字检索
    keywordSearch: debounce(500, false, function() {
      this.page.index = 1;
      this.noMore = false;
      this.list = [];
      this.getList();
    }),
    async getList() {
      this.loading = true;
      let { code, data, total } = await accountApi.getListByDeptsAuth({
        deptIds: this.deptIds,
        searchKey: this.keyword,
        ...this.typeSearchMap[this.type],
        current: this.page.index,
        size: this.page.size
      });
      this.loading = false;
      if (code === 0 && data && data.length) {
        data = this.transData(data);
        this.list.push(...data);
        this.page.total = total;
        if (this.page.size * this.page.index >= total) {
          this.noMore = true;
        }
        this.page.index = this.page.index + 1;
      } else {
        this.list = [];
        this.noMore = true;
      }
      this.updateCheckAll();
    },
    // 类别切换
    onTypeChange(val) {
      this.page.index = 1;
      this.noMore = false;
      this.list = [];
      this.getList();
    },
    // 单项选中改变回调
    onItemCheckChange(checked, item) {
      if (checked) {
        this.selectionPush(item);
      } else {
        this.selectionRemove(item);
      }
    },
    // 全选回调
    onCheckAllChange(val) {
      if (!val) {
        this.selectionRemove(this.list);
      } else {
        this.selectionPush(this.list);
      }
    },
    // 选中单项删除回调
    onSelectionItemClose(item) {
      this.selectionRemove(item);
    },
    onCancel() {
      this.close();
    },
    onOpen() {
      this.infiniteScrollShow = true;
    },
    // Dialog关闭动画结束时的回调
    onClosed() {
      this.infiniteScrollShow = false;
      this.reset();
    },
    // 确定回调
    onOk() {
      let data = JSON.parse(
        JSON.stringify({
          selection: this.selection,
          ...this.result
        })
      );
      this.$emit('on-ok', data);
      this.close();
    },
    close() {
      this.self_visible = false;
    },
    // 更新全选状态
    updateCheckAll() {
      this.isCheckAll =
        this.list.length &&
        this.list.every(item => this.selectionVals.includes(item.id));
      this.isIndeterminate =
        !this.isCheckAll &&
        this.list.some(item => this.selectionVals.includes(item.id));
    },
    /**
     * 选中数据-重新赋值
     * @param {Array} data 数据集合
     */
    selectionSet(data) {
      data = JSON.parse(JSON.stringify(data));
      this.reset();
      this.selectionVals = data ? data.map(item => item.id) : [];
      this.selection = data || [];
      this.updateCheckAll();
    },
    /**
     * 选中数据-追加
     * @param {Array|Object} data 数据集合|单个数据对象
     */
    selectionPush(data) {
      let isArray = data instanceof Array;
      if (!isArray) {
        data = [data];
      }
      data.forEach(item => {
        // 过滤已存在数据 避免重复添加
        let isIn = this.selectionVals.some(val => val === item.id);
        if (!isIn) {
          this.selectionVals.push(item.id);
        }
        // 注：selectionVals与selection 分开判断 因selectionVals是双向绑定避免selection不能执行操作
        isIn = this.selection.some(m => m.id === item.id);
        if (!isIn) {
          this.selection.push(item);
        }
      });
      this.updateCheckAll();
    },
    /**
     * 选中数据-移除
     * @param {Array|Object} data 数据集合|单个数据对象
     */
    selectionRemove(data) {
      let isArray = data instanceof Array;
      if (!isArray) {
        data = [data];
      }
      data.forEach(item => {
        let index = this.selectionVals.indexOf(item.id);
        if (index !== -1) {
          this.selectionVals.splice(index, 1);
        }
        // 注：selectionVals与selection 分开判断 因selectionVals是双向绑定避免selection不能执行操作
        index = this.selection.findIndex(m => m.id === item.id);
        if (index !== -1) {
          this.selection.splice(index, 1);
        }
      });
      this.updateCheckAll();
    },
    // 重置
    reset() {
      this.type = 'org';
      this.list = [];
      this.keyword = '';
      this.selectionVals = [];
      this.selection = [];
      this.page.index = 1;
      this.page.total = 0;
      this.noMore = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  /deep/ .el-dialog {
    width: 760px;
    &__title {
      border: none !important;
    }
    &__body {
      padding: 0;
    }
    &__footer {
      padding: 0;
    }
  }
  .main {
    display: flex;
    height: 520px;
    border: 1px solid #e8e8e8;
    .left {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      padding: 16px;
      border-right: 1px solid #e8e8e8;
      overflow-x: hidden;
      .type {
        display: flex;
        margin-top: 12px;
        /deep/ .el-radio-button {
          flex: 1 0 auto;
          &__inner {
            padding: 8px 15px;
            width: 100%;
            font-size: 14px;
          }
        }
      }
      .list {
        flex: 1 0 auto;
        margin: 0 -16px -16px -16px;
        padding: 16px 16px 0 16px;
        height: 0;
        overflow: auto;
        .item {
          display: flex;
          align-items: center;
          margin-right: 0;
          width: 100%;
          /deep/ .el-checkbox__label {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          /deep/ .el-checkbox__inner {
            height: 14px;
            width: 14px;
          }
        }
        .item + .item {
          margin-top: 4px;
          margin-left: 0 !important;
        }
      }
      .load-state {
        text-align: center;
        .loading,
        .no-more {
          line-height: 30px;
        }
      }
    }
    .right {
      flex: 0 0 330px;
      width: 330px;
      display: flex;
      flex-direction: column;
      .no-data {
        display: block;
        margin: 40% auto 0 auto;
      }
      .list {
        flex: 1 0 auto;
        padding: 16px;
        height: 0;
        overflow: auto;
        .item {
          position: relative;
          padding: 0 32px 0 12px;
          width: 100%;
          font-size: 14px;
          height: 32px;
          line-height: 30px;
          color: rgba(0, 0, 0, 0.65);
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .close {
            position: absolute;
            top: 7px;
            right: 7px;
            padding: 2px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
            cursor: pointer;
            transition: all 0.2s ease;
            &:hover {
              background-color: rgba(0, 0, 0, 0.08);
            }
          }
        }
        .item + .item {
          margin-top: 4px;
          margin-left: 0;
        }
      }
    }
  }
  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    &-left {
      display: flex;
      .checked-info {
        margin-left: 14px;
        .item + .item {
          margin-left: 12px;
        }
        .total {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
    &-right {
    }
  }
}
</style>
