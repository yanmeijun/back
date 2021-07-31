<template>
  <div class="flex avue-top">
    <div class="top-bar__left">
      <div
        class="avue-breadcrumb"
        :class="[{ 'avue-breadcrumb--active': isCollapse }]"
        v-if="showCollapse"
      >
        <i class="iconfont icontubiaozhizuomoban2" @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <!-- 顶部标签卡 -->
      <tags />
      <div class="top-bar__item top-bar__item--show" v-if="showMenu">
        <top-menu></top-menu>
      </div>
    </div>
    <div class="top-bar__right flex algin-center">
      <!-- <theme /> -->
      <!-- <el-tooltip class="item" effect="dark" content="主题色" placement="bottom">
        <span class="top-item">
          <top-theme></top-theme>
        </span>
      </el-tooltip> -->
      <!-- <el-tooltip effect="dark" placement="bottom" content="锁屏">
        <div class="top-bar__item">
          <i class="icon-zuixiaohua"></i>
        </div>
      </el-tooltip> -->
      <el-tooltip
        v-if="showLock"
        effect="dark"
        content="锁屏"
        placement="bottom"
      >
      </el-tooltip>
      <el-tooltip
        v-if="false"
        effect="dark"
        :content="isFullScreen ? '退出全屏' : '全屏'"
        placement="bottom"
      >
        <div class="top-bar__item">
          <i
            :class="isFullScreen ? 'icon-zuixiaohua' : 'icon-quanpingzuidahua'"
            @click="handleScreen"
          ></i>
        </div>
      </el-tooltip>
      <el-dropdown>
        <span class="flex align-center el-dropdown-link">
          <i
            class="iconfont icontubiaozhizuomoban11 user-icon"
            v-if="!userInfo.avatar"
          ></i>
          <i
            class="user-icon"
            v-else
            :style="`backgroundImage: url('${userInfo.avatar}')`"
          ></i>
          {{ userInfo.username }}
        </span>
        <el-dropdown-menu slot="dropdown" class="zv-el-dropdown-menu">
          <!-- <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item> -->
          <el-dropdown-item>
            <router-link to="/info/index" style="display: block;">
              <i
                class="iconfont icontubiaozhizuomoban33 el-icon-circle-plus"
              ></i
              >个人中心</router-link
            >
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>
            <i class="iconfont icontubiaozhizuomoban48 el-icon-circle-plus"></i>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { fullscreenToggel, listenfullscreen } from '@/util/util';
import { clearStore } from '@/util/store';
import tags from '../tags';
import topMenu from './top-menu';
import topTheme from './top-theme';
import theme from '@/components/base/theme';

export default {
  components: {
    topMenu,
    topTheme,
    tags,
    theme
  },
  name: 'top',
  data() {
    return {};
  },
  filters: {},
  created() {},
  mounted() {
    listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showMenu: state => state.common.showMenu
    }),
    ...mapGetters([
      'userInfo',
      'isFullScreen',
      'tagWel',
      'tagList',
      'isCollapse',
      'tag',
      'logsLen',
      'logsFlag'
    ])
  },
  methods: {
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit('SET_COLLAPSE');
    },
    setScreen() {
      this.$store.commit('SET_FULLSCREN');
    },
    logout() {
      this.$confirm('是否退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          clearStore();
          this.$router.push({ path: '/login' });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown {
  .user-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    font-size: 15px;
    color: #fff;
    border-radius: 50%;
    background: rgba(161, 194, 249, 1);
    background-size: 100% 100%;
  }
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
}
</style>
