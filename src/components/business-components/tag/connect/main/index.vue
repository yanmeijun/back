<template>
  <div class="main">
    <!-- 左边 -->
    <div class="left">
      <type-tree
        :type="type"
        :current.sync="current"
        head-fixed
        show-manage-btn
        @change="onCurrentChange"
      />
    </div>
    <!-- 中间 -->
    <div class="center">
      <draggable
        :class="[
          'tag-list',
          {
            'tag-list--empty': !center.tags.length,
            'tag-list--modify': isModify
          }
        ]"
        v-loading="center.loading"
        v-model="center.tags"
        group="taglist"
        chosenClass="item--chosen"
        :sort="true"
        :animation="500"
        @add="onAdd"
      >
        <div
          class="item"
          v-for="(item, index) in center.tags"
          :key="item.id"
          @click="onRemove(index)"
        >
          <span>{{ item.name }}</span>
          <span class="close el-icon-close"></span>
        </div>
      </draggable>
      <div v-show="isModify" class="footer">
        <el-button @click="onCancelModify">取消</el-button>
        <el-button type="primary" @click="onSubmitModify">提交</el-button>
      </div>
    </div>
    <!-- 右边 -->
    <div class="right">
      <div class="head">
        <el-input
          v-model.trim="right.keyword"
          prefix-icon="el-icon-search"
          placeholder="搜索标签，与左侧树建立关联"
        ></el-input>
      </div>
      <div class="body" v-loading="right.loading">
        <no-data
          v-if="!right.tags.length"
          class="no-data"
          text="拖拽标签进行关联"
        />
        <draggable
          v-else
          class="tag-list"
          v-model="right.tags"
          :group="{
            name: 'taglist',
            pull: 'clone'
          }"
          :sort="false"
          :forceFallback="true"
          :animation="500"
          chosenClass="item--chosen"
          filter=".item--disabled"
          :move="onMove"
          @choose="onChoose"
          @unchoose="onUnchoose"
        >
          <div
            v-for="item in right.tags"
            :key="item.id"
            :class="[
              'item',
              {
                'item--disabled': item.ex.disabled
              }
            ]"
          >
            {{ item.name }}
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import * as tagApi from '@/api/tag';
import debounce from 'throttle-debounce/debounce';
import Draggable from 'vuedraggable';
import NoData from '@/components/base/no-data';
import TypeTree from '../../common/type-tree';
export default {
  components: {
    Draggable,
    NoData,
    TypeTree
  },
  props: {
    /**
     * 类别标识
     * region：地区
     * org：机构
     * trade：行业
     */
    type: {
      type: String,
      default: 'region'
    }
  },
  computed: {
    // 是否修改了
    isModify() {
      let val = this.center.tags
        .map(item => item.id)
        .sort()
        .toString();
      let old = this.center.oldTags
        .map(item => item.id)
        .sort()
        .toString();
      return val !== old;
    }
  },
  watch: {
    'right.keyword'() {
      this.searchTags();
    },
    type() {
      this.reset();
    }
  },
  setup(props, { root }) {
    let state = reactive({
      // 类别映射
      typeMap: {
        region: 1,
        trade: 2,
        org: 3
      },
      current: null, // 当前节点
      center: {
        loading: false,
        state: '',
        tags: [],
        oldTags: [] // 记录修改前标签
      },
      right: {
        loading: false,
        keyword: '',
        tags: []
      }
    });
    // 重置
    function reset() {
      state.right.keyword = '';
      state.center.tags = [];
      state.center.oldTags = [];
      state.right.tags = [];
    }
    // 当前节点变化回调
    function onCurrentChange(data) {
      data && this.getCurNodeTags();
    }
    // 鼠标点击选中要拖拽元素时的事件
    function onChoose(e) {
      state.center.state = 'wait-drop';
    }
    // 选中后松开鼠标的事件
    function onUnchoose(e) {
      state.center.state = '';
    }
    // 拖动时与其他项产生联系时事件
    function onMove(data) {
      // 自身列框不允许排序（:sort="false"不生效 此处强制不让停靠进行解决）
      if (data.from === data.to) {
        return false;
      }
      return true;
    }
    // 从一个数组拖拽到另外一个数组时触发的事件
    function onAdd(e) {
      updateDisabled();
    }
    // 关联的标签移除
    function onRemove(index) {
      state.center.tags.splice(index, 1);
      updateDisabled();
    }
    // 取消修改
    function onCancelModify() {
      state.center.tags = JSON.parse(JSON.stringify(state.center.oldTags));
      updateDisabled();
    }
    // 提交修改
    async function onSubmitModify() {
      state.center.loading = true;
      let labelId = state.center.tags.map(item => item.id);
      let { code, msg } = await tagApi.categoryLabelRelationship({
        type: state.typeMap[props.type],
        classificationId: state.current.id,
        labelId
      });
      state.center.loading = false;
      if (code === 0) {
        root.$message.success('操作成功');
        state.center.oldTags = JSON.parse(JSON.stringify(state.center.tags));
      } else {
        root.$message.error(msg);
      }
    }

    // 更新禁用状态
    function updateDisabled() {
      // 已经关联的标签禁用
      state.right.tags.forEach(item => {
        let isConnected = !!state.center.tags.find(t => item.id === t.id);
        item.ex.disabled = isConnected ? true : false;
      });
    }

    // 获取当前节点标签列表
    async function getCurNodeTags() {
      state.center.loading = true;
      let { code, data } = await tagApi.getDataById({
        type: state.typeMap[props.type],
        classificationId: state.current.id
      });
      if (code === 0) {
        // // 置灰右侧已关联标签
        // state.right.tags.forEach(item => {
        //   let isConnected = !!data.find(m => m.id === item.id);
        //   item.ex.disabled = isConnected;
        // });
        state.center.tags = JSON.parse(JSON.stringify(data));
        state.center.oldTags = JSON.parse(JSON.stringify(data));
      }
      state.center.loading = false;
      updateDisabled();
    }

    // 获取标签列表
    let searchTags = debounce(500, false, async () => {
      if (state.right.keyword === '') {
        state.right.tags = [];
        return;
      }
      state.right.loading = true;
      let { code, data } = await tagApi.search({
        type: state.typeMap[props.type],
        search: state.right.keyword
      });
      state.right.loading = false;
      if (code === 0) {
        data.forEach(item => {
          item.ex = {
            disabled: false
          };
        });
        state.right.tags = data;
      } else {
        state.right.tags = [];
      }
      updateDisabled();
    });

    return {
      ...toRefs(state),
      reset,
      onCurrentChange,
      onChoose,
      onUnchoose,
      onMove,
      onAdd,
      onRemove,
      onCancelModify,
      onSubmitModify,
      getCurNodeTags,
      searchTags
    };
  }
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  border: 1px solid #e8e8e8;

  .left {
    flex: 0 0 242px;
    overflow: auto;
    border-right: 1px solid #e8e8e8;
  }
  .center {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 1px;
    overflow-x: hidden;
    .tag-list {
      flex: 1 1 auto;
      padding: 15px;
      background-color: transparent;
      outline: 1px dashed transparent;
      .item {
        flex: 0 1 auto;
        padding-right: 32px;
        min-width: auto;
        cursor: inherit;
      }
      // 无关联数据
      &--empty {
        background-image: url('./images/no-connect.jpg');
        background-size: 323px 215px;
        background-position: center;
        background-repeat: no-repeat;
      }
      // 等待放置状态
      &--wait-drop {
        outline: 1px dashed rgb(0, 145, 255);
      }
    }
    .footer {
      position: sticky;
      bottom: 0;
      padding: 15px;
      border-top: 1px solid #e8e8e8;
      text-align: right;
      z-index: 10;
      background-color: #fff;
    }
  }
  .right {
    flex: 0 0 365px;
    display: flex;
    flex-direction: column;
    width: 365px;
    border-left: 1px solid #e8e8e8;
    overflow-x: hidden;
    .head {
      position: sticky;
      top: 0;
      padding: 15px 15px 0 15px;
      z-index: 10;
      background-color: #fff;
    }
    .body {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      height: 0;
      /deep/ .el-loading-mask {
        overflow: hidden;
      }
      .no-data {
        align-self: center;
        margin-top: 30%;
      }
      .tag-list {
        flex: 1 0 auto;
        padding: 15px;
        height: 0;
      }
    }
  }

  .tag-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-right: -6px;
    .item {
      box-sizing: border-box;
      position: relative;
      flex: 1 1 auto;
      margin: 0 6px 6px 0;
      padding: 0 12px;
      min-width: 145px;
      line-height: 31px;
      background-color: #f4f6fc;
      border: 1px solid #f4f6fc;
      cursor: move;
      transition: border-color 0.2s ease, background-color 0.2s ease;
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

      // 拖拽状态
      &--drag {
        border: 1px dashed #0091ff;
      }
      // 选中状态
      &--chosen {
        border: 1px dashed #0091ff;
      }
      // 禁用状态
      &--disabled {
        color: #ccc;
        cursor: not-allowed;
      }
    }
    // 状态-修改
    &--modify {
      .item {
        background-color: #f0faff;
        border-color: #abdcff;
      }
    }
  }
}
</style>
