<template>
  <div class="flex error-search">
    <div class="flex align-center left">
      <span class="left-title">{{ title }}</span>
      <!-- <el-button class="mini-btn" :type="isAllTags" @click="changeAllMethod"
        >全部</el-button
      > -->
    </div>
    <div class="tags" :class="{ line: line }">
      <transition enter-active-class="animated fadeIn">
        <div class="flex top" v-if="!showFiltrate">
          <div class="select-tags" :class="{ 'pack-up': !isPackUp }">
            <el-select
              ref="refTags"
              class="input-select-tags"
              v-model="values"
              multiple
              filterable
              clearable
              remote
              placeholder="请输入关键词(最多选择10条数据)"
              :remote-method="remoteMethod"
              :loading="loading"
              @click.native="showMethod"
              @change="onEmitValue"
              @visible-change="onVisibleChange"
              @remove-tag="onRemoveTag"
              @clear="onRemoveTag"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="flex align-center select-btn">
            <pack-button
              v-show="showPackUpBtn"
              @packClick="packUpHandleMethod"
              :packUp="isPackUp"
            ></pack-button>
            <span @click="showFiltrateMethod"
              ><i class="el-icon-magic-stick icon-select"></i>筛选</span
            >
          </div>
        </div>
      </transition>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="filtrate" v-if="showFiltrate">
          <TipAlert :content="tipContent" />
          <div class="filtrate-tags">
            <div class="flex list" v-show="values.length > 0">
              <span class="title">已选条件</span>
              <div class="flex con">
                <el-tag effect="dark" v-for="item in values" :key="item"
                  >{{ item
                  }}<i
                    class="el-icon-close"
                    @click="filtrateDelMethod(item)"
                  ></i
                ></el-tag>
              </div>
            </div>
            <div class="filtrate-search">
              <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="queryTxt"
                clearable
                @input="filtrateSearchMethod"
              >
              </el-input>
            </div>
            <div class="flex filtrate-content" v-loading="sLoading">
              <span
                v-for="ele in queryList"
                :class="{ active: ele.isActive }"
                :key="ele.label"
                @click="checkQueryListItemMethod(ele)"
                >{{ ele.label }}</span
              >
              <p class="no-data" v-if="queryList.length === 0">暂无数据</p>
            </div>
            <!-- <el-pagination
              class="filtrate-pagination"
              background
              layout="total, prev, pager, next, jumper"
              :hide-on-single-page="true"
              :pager-count="5"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pageSize"
              :total="total"
              :current-page.sync="currentPage"
            >
            </el-pagination> -->
            <div class="filtrate-btns">
              <el-button @click="cancelFiltrateMethod">取消</el-button>
              <el-button type="primary" @click="hideFiltrateMethod"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { getErrorFilter } from '@/api/website/data-review';
import { debounce } from '@/util/common';

import TipAlert from '@/components/base/tip-alert';
import {
  reactive,
  ref,
  toRefs,
  watch,
  nextTick,
  onMounted
} from '@vue/composition-api';
export default {
  name: 'error-sensitive-search',
  components: {
    TipAlert
  },
  props: {
    line: Boolean,
    title: {
      type: String,
      default: '错敏词'
    },
    initData: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit, root }) {
    const refTags = ref(null);
    const { initData } = toRefs(props);
    let preValues = [];

    const state = reactive({
      loading: false,
      sLoading: false,
      showPackUpBtn: false,
      isPackUp: false,
      showFiltrate: false,
      tipContent: '最大选择10条数据哦！',
      queryTxt: '',
      options: [],
      values: [],
      list: [],
      queryList: [],
      currentPage: 1,
      pageSize: 100,
      total: 1000,
      timer: null
    });

    // const isAllTags = computed(() => {
    //   return state.values.length === 0 ? 'primary' : 'info';
    // });

    // watch
    watch(
      () => state.values,
      () => {
        if (!refTags || !refTags.value) return;
        refTags.value.resetInputHeight();
        nextTick(() => {
          const refTagsChild = refTags.value.$el.querySelector(
            '.el-select__tags'
          );
          const h = refTagsChild.offsetHeight;
          state.showPackUpBtn = h > 28;
          if (state.showPackUpBtn) {
            state.isPackUp = true;
          }
        });
      }
    );

    onMounted(() => {
      // state.list = state.states.map(ele => {
      //   return {
      //     value: ele,
      //     label: ele
      //   };
      // });
      // state.queryList = state.states.map(ele => {
      //   return {
      //     isActive: false,
      //     label: ele
      //   };
      // });
    });

    // 方法 ---------------------------------

    // 重置参数
    const getParams = () => {
      const codeTypeVal =
        initData.value.codeTypeVal.length > 0 && initData.value.codeType === 1
          ? initData.value.codeTypeVal
          : [initData.value.codeTypeValInput];
      const accountInfo = initData.value.accountInfo.join(',');
      const [startDate = '', endDate = ''] = initData.value.time;
      return Object.assign(
        {
          ...initData.value
        },
        {
          codeTypeVal,
          accountInfo,
          advancedFilterType: props.type,
          startDate,
          endDate
        }
      );
    };

    // 获取列表
    const onGetList = async query => {
      state.sLoading = true;
      const params = getParams();
      params['advancedFilter'] = query;
      let { data } = await getErrorFilter(params);
      state.sLoading = false;
      state.queryList = data.map(ele => {
        return {
          label: ele,
          value: ele,
          isActive: false
        };
      });
    };
    const onRemote = async query => {
      const params = getParams();
      params['advancedFilter'] = query;
      state.loading = true;
      let { data } = await getErrorFilter(params);
      state.loading = false;
      // data = ['<重复词语>', '杨文意', '良好的', '高原', '人民代表大会'];
      state.options = data.map(ele => {
        return {
          label: ele,
          value: ele
        };
      });
    };
    // 下拉搜索
    const remoteMethod = async query => {
      if (query === '') return;
      // state.options = state.list.filter(item => {
      //   return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      // });
      onRemote(query);
    };

    // 筛选--- 显示
    const showFiltrateMethod = async () => {
      state.showFiltrate = true;
      preValues = Object.assign([], state.values);

      // 获取全部推荐结果
      await onGetList();
      viewQueryListMethod();
    };

    // 筛选 --- 取消
    const cancelFiltrateMethod = () => {
      state.showFiltrate = false;
      state.values = preValues;
      state.queryList = [];
    };

    // 筛选 --- 关闭
    const closeFiltrateMethod = () => {
      state.showFiltrate = false;
      state.queryList = [];
    };

    // emit 数据
    const emitQuery = () => {
      emit('query', { value: state.values, type: props.type });
    };

    // 筛选--- 隐藏
    const hideFiltrateMethod = () => {
      state.showFiltrate = false;
      state.queryList = [];
      emitQuery();
    };

    // 筛选 --- 搜索
    const filtrateSearchMethod = query => {
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }
      state.timer = setTimeout(async () => {
        clearTimeout(state.timer);
        await onGetList(query);
        viewQueryListMethod();
        // state.queryList = state.queryList.filter(item => {
        //   return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        // });
      }, 300);
    };

    // 筛选--- 重置筛选列表
    // const queryListResetMethod = () => {
    //   state.queryList = state.queryList.map(ele => {
    //     ele.isActive = false;
    //     return ele;
    //   });
    // };

    // 筛选---回显tags列表
    const viewQueryListMethod = () => {
      for (const item of state.queryList) {
        if (state.values.includes(item.label)) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      }
    };

    // 筛选--- tags删除
    const filtrateDelMethod = item => {
      state.values = state.values.filter(ele => ele !== item);
      viewQueryListMethod();
    };

    // 筛选--- 列表 - tag点击
    const checkQueryListItemMethod = item => {
      if (state.values.includes(item.label)) {
        state.values = state.values.filter(ele => ele !== item.label);
        item.isActive = false;
        return;
      }
      if (state.values.length > 9) {
        root.$message.error('最多选择10个关键词');
        return;
      }
      item.isActive = true;
      state.values.push(item.label);
    };

    const showMethod = () => {
      state.isPackUp = true;
    };

    const onEmitValue = () => {
      if (state.values.length > 10) {
        state.values = state.values.splice(0, 10);
        root.$message.error('最多选择10个关键词');
      }
      // setTimeout(() => {
      //   emit('query', { value: state.values, type: props.type });
      // }, 300);
    };

    const onVisibleChange = bool => {
      if (bool) return;
      if (!preValues.length && !state.values.length) {
        return;
      }
      emitQuery();
    };

    // const onRemoveTag = () => {
    //   debounce(emitQuery, 500);
    //   emit('query', { value: state.values, type: props.type });
    // };
    const onRemoveTag = debounce(emitQuery, 1000);

    const changeAllMethod = () => {
      state.values = [];
    };

    const packUpHandleMethod = () => {
      state.isPackUp = !state.isPackUp;
      refTags.value.$el.querySelector('.el-select__input').blur();
    };

    // 返回 --- 相应数据 --------------
    return {
      refTags,
      // refTagsHeight,
      ...toRefs(state),
      // isAllTags,
      showFiltrateMethod,
      hideFiltrateMethod,
      cancelFiltrateMethod,
      filtrateSearchMethod,
      changeAllMethod,
      filtrateDelMethod,
      checkQueryListItemMethod,
      closeFiltrateMethod,
      showMethod,
      remoteMethod,
      onEmitValue,
      onVisibleChange,
      onRemoveTag,
      packUpHandleMethod
    };
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.error-search {
  .left {
    height: 34px;
    .left-title {
      text-align: right;
      width: 58px;
      margin-right: 18px;
    }
  }
  .mini-btn {
    margin-right: 12px;
    padding: 0 6px;
    height: 22px;
  }
  .tags {
    flex: 1;
    &.line {
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 5px;
      margin-bottom: 5px;
    }
  }
  .select-tags {
    flex: 1;
    &.pack-up {
      height: 32px;
      overflow: hidden;
      ::v-deep {
        .el-select__tags {
          top: 3px;
          transform: translateY(0);
          .el-select__input {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
    }
  }
  .input-select-tags {
    flex: 1;
    ::v-deep {
      .el-input__inner {
        border: 0;
      }
      .el-select__tags {
        .el-tag.el-tag--info {
          background-color: var(--primary);
          height: 22px;
          line-height: 20px;
          color: #fff;
          .el-select__tags-text {
            font-size: 14px;
          }
          .el-tag__close {
            font-size: 14px;
            color: #fff;
            background: transparent;
          }
        }
      }
    }
  }
  .select-btn {
    cursor: pointer;
    height: 34px;
    .icon-select {
      margin-right: 5px;
    }
  }
  .filtrate {
    .filtrate-tags {
      padding-top: 10px;
      .list {
        margin-bottom: 19px;
        .title {
          flex: 0 0 70px;
          height: 22px;
          line-height: 22px;
        }
        .con {
          width: 100%;
          flex-wrap: wrap;
          border-bottom: 1px solid #e8e8e8;
          .el-tag {
            font-size: 14px;
            margin: 0 4px 12px;
            height: 22px;
          }
        }
      }
      .filtrate-search {
        padding-top: 5px;
        padding-bottom: 10px;
        .el-input {
          width: 40%;
          @media (max-width: 992px) {
            width: 100%;
          }
          ::v-deep {
            .el-input__inner {
              padding-left: 30px;
            }
          }
        }
      }
      .filtrate-content {
        flex-wrap: wrap;
        padding: 16px 0;
        max-height: 350px;
        overflow-y: auto;
        span {
          cursor: pointer;
          padding: 2px 8px;
          margin: 5px 6px;
          border-radius: 4px;
          &.active {
            color: #fff;
            background: var(--primary);
          }
        }
        .no-data {
          flex: 1;
          text-align: center;
          color: #ccc;
          line-height: 50px;
        }
      }
      .filtrate-pagination {
        text-align: center;
        margin-bottom: 16px;
        @media (max-width: 768px) {
          ::v-deep {
            .el-pagination__total,
            .el-pagination__jump {
              display: none;
            }
          }
        }
      }
      .filtrate-btns {
        margin-bottom: 25px;
        text-align: center;
      }
    }
  }
}
</style>
