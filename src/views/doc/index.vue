<template>
  <div class="basic-container pg-doc">
    <div class="main">
      <div class="section">
        <div class="section-head">增移按钮--尺寸</div>
        <div class="section-body">
          <button class="kp-add-remove kp-add-remove--xlarge">
            <i class="el-icon-close"></i>
          </button>
          <button class="kp-add-remove kp-add-remove--large">
            <i class="el-icon-close"></i>
          </button>
          <button class="kp-add-remove">
            <i class="el-icon-close"></i>
          </button>
          <button class="kp-add-remove kp-add-remove--small">
            <i class="el-icon-close"></i>
          </button>
          <button class="kp-add-remove kp-add-remove--mini">
            <i class="el-icon-close"></i>
          </button>

          <div class="section-head">增移按钮--主题</div>
          <button class="kp-add-remove">
            <i class="el-icon-plus"></i>
          </button>
          <button class="kp-add-remove kp-add-remove--danger">
            <i class="el-icon-minus"></i>
          </button>

          <div class="section-head">增移按钮--圆形</div>
          <button class="kp-add-remove kp-add-remove--circle">
            <i class="el-icon-plus"></i>
          </button>
          <button
            class="kp-add-remove kp-add-remove--danger kp-add-remove--circle"
          >
            <i class="el-icon-minus"></i>
          </button>

          <div class="section-head">增移按钮--朴素</div>
          <button class="kp-add-remove kp-add-remove--plain">
            <i class="el-icon-plus"></i>
          </button>
          <button
            class="kp-add-remove kp-add-remove--plain kp-add-remove--danger"
          >
            <i class="el-icon-minus"></i>
          </button>
          <button
            class="kp-add-remove kp-add-remove--plain kp-add-remove--circle"
          >
            <i class="el-icon-plus"></i>
          </button>
          <button
            class="kp-add-remove kp-add-remove--plain kp-add-remove--danger kp-add-remove--circle"
          >
            <i class="el-icon-minus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.pg-doc {
  height: 100%;
  .main {
    height: 100%;
    background-color: #fff;
    .section {
      padding: 16px;
      &-head {
        line-height: 30px;
      }
    }
  }
}
</style>
