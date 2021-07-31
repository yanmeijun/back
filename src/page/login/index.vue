<template>
  <div class="login-container">
    <div class="login-weaper  animated bounceInDown">
      <div class="login-left">
        <!-- <img class="img" src="/img/logo.png" alt="" /> -->
        <span class="iconfont icongongsilogo icon-logo"></span>
        <p class="title">{{ website.infoTitle }}</p>
        <p>©2021 v4.2.0</p>
      </div>
      <div class="login-border">
        <div class="login-main">
          <userLogin v-if="activeName === 'user'"></userLogin>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '@/styles/login.scss';
import userLogin from './userlogin';
import { mapGetters } from 'vuex';
// import { getStore } from '@/util/store';
// import { dateFormat } from '@/util/date';
// import { validatenull } from '@/util/validate';

export default {
  name: 'login',
  components: {
    userLogin
  },
  data() {
    return {
      activeName: 'user'
    };
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['website'])
  },
  props: [],
  methods: {}
};
</script>
<style lang="scss" scoped>
.icon-logo {
  font-size: 140px;
}
</style>
