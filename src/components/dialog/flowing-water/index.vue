<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    title="发送记录"
    :visible.sync="isOpen"
    :before-close="closeDialog"
    width="633px"
  >
    <div class="history-container">
      <div class="history-list" v-for="(item, index) in dataList" :key="index">
        <div
          class="dot"
          :class="item.status == 1 ? 'success-dot' : 'fail-dot'"
        ></div>
        <div class="time fl">
          {{ item.time && item.time.substring(0, 10) }}
          <br />
          {{ item.time && item.time.substring(11) }}
        </div>
        <div class="fl item-box">
          <div
            class="tit"
            :class="item.status == 1 ? 'success-tit' : 'fail-tit'"
          >
            <div class="triangle"></div>
            操作人:{{ item.operator }}
            <span style="float:right;text-align: right;height: 36px;">
              <span class="text-overflow-siteCode">成功</span>
            </span>
          </div>
          <div class="content">
            <p>备注：{{ item.remark }}</p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'flowing-water',
  props: {
    infoId: {
      type: [String, Number]
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否显示弹出层
      // visible: false,
      dataList: [
        {
          time: '2020-10-20 20:00',
          operator: '哈哈哈',
          remark: '呵呵呵呵',
          status: 1
        },
        {
          time: '2020-10-20 20:00',
          operator: '哈哈哈',
          remark: '呵呵呵呵',
          status: 2
        },
        {
          time: '2020-10-20 20:00',
          operator: '哈哈哈',
          remark: '呵呵呵呵',
          status: 1
        },
        {
          time: '2020-10-20 20:00',
          operator: '哈哈哈',
          remark: '呵呵呵呵',
          status: 2
        }
      ]
    };
  },
  methods: {
    init(id) {
      console.log(id);
    },
    closeDialog(val) {
      this.$emit('closeDialog', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.history-container {
  margin: 0 20px 0;
  // height: 300px;
  // overflow-y: auto;
  .history-list {
    position: relative;
    border-left: 1px solid #ddd;
    padding-left: 25px;
    padding-bottom: 20px;
    margin-left: 105px;
    .dot {
      position: absolute;
      left: -5px;
      top: 22px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .success-dot {
      background: radial-gradient(#1890ff, rgba(24, 144, 255, 0.2));
    }
    .fail-dot {
      background: radial-gradient(#fab019, rgba(255, 170, 0, 0.2));
    }
    .time {
      line-height: 22px;
      color: #666;
      font-size: 14px;
      position: absolute;
      left: -98px;
      top: 1px;
      text-align: right;
    }
    .item-box {
      position: relative;
      top: 9px;
      width: 100%;
      background: #f8f8f8;
      border-radius: 4px;
      .tit {
        padding: 0 16px;
        height: 37px;
        line-height: 37px;
        font-size: 14px;
        color: #fff;
        // background: #0081cc;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        position: relative;
        // margin-top: 10px;
        .triangle {
          position: absolute;
          left: -6px;
          top: 11px;
          bottom: -12px;
          width: 0;
          height: 0;
          border: none;
          // border-right: 6px solid #0081cc;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }
        .text-overflow-siteCode {
          width: 163px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .success-tit {
        background: var(--primary);
        .triangle {
          border-right: 6px solid var(--primary);
        }
      }
      .fail-tit {
        background: #fab019;
        .triangle {
          border-right: 6px solid #fab019;
        }
      }
      .content {
        padding: 0 16px 10px;
        p {
          margin-top: 6px;
          font-size: 14px;
          line-height: 22px;
          font-weight: 400;
          color: #606266;
        }
      }
    }
  }
}
</style>
