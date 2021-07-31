<template>
  <div class="avue-logo">
    <transition name="fade">
      <span v-if="keyCollapse" class="avue-logo_subtitle" key="0">
        <i class="iconfont icongongsilogo logo-icon"></i>
        <!-- {{website.logo}} -->
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="!keyCollapse">
        <span class="flex center avue-logo_title" key="1"
          ><i class="iconfont icongongsilogo logo-icon"></i>
          <span class="logo-text">{{ website.indexTitle }}</span>
        </span>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'logo',
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters(['website', 'keyCollapse'])
  },
  methods: {}
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 64px;
  line-height: 64px;
  background-color: rgba(var(--primary-dark), 1);
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 1);
  z-index: 1024;
  &_title {
    font-weight: 500;
    font-size: 18px;
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
  .logo-icon {
    font-weight: normal;
    font-size: 34px;
  }
  .logo-text {
    margin-left: 10px;
  }
}
</style>
