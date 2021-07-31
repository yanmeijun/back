<template>
  <el-dialog
    class="moitor-clip-dialog"
    title="照片"
    :visible.sync="isOpen"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="clip-imgs">
      <ul class="flex list">
        <li class="item" v-for="(ele, i) in srcList" :key="i + Date.now()">
          <el-image
            class="clip-imgs-el-image"
            :src="ele"
            :preview-src-list="srcList"
            fit="cover"
          >
          </el-image>
        </li>
      </ul>
    </div>
    <!-- <div slot="footer">
      <div class="footer-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </div>
    </div> -->
  </el-dialog>
</template>
<script>
export default {
  name: 'moitor-clip-imgs-dialog',
  data() {
    return {
      // srcList: [
      //   'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      //   'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      // ]
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    srcList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style lang="scss" scoped>
.moitor-clip-dialog {
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      width: 540px;
    }
  }
  .list {
    flex-wrap: wrap;
    padding: 0 20px;
    height: 280px;
    margin-bottom: 12px;
    .item {
      padding: 0 10px;
      .clip-imgs-el-image {
        width: 120px;
        height: 120px;
        border-radius: 5px;
      }
    }
  }
}
@media (max-width: 768.98px) {
  .moitor-clip-dialog {
    .list {
      height: auto;
      .item {
        padding: 10px;
        width: 50%;
        .clip-imgs-el-image {
          height: 120px;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
