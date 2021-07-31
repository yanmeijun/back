<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height: 100%">
      <div
        v-if="validatenull(menu) && (!currentDisplay || !currentDisplay.value)"
        class="avue-sidebar--tip"
      >
        没有发现菜单
      </div>
      <div
        class="title"
        v-show="!isCollapse"
        v-if="currentDisplay && currentDisplay.value"
      >
        {{ currentDisplay.label }}
      </div>
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
    <span class="drawer-btn" @click="drawer = true"></span>
    <el-drawer
      class="display-drawer"
      title="平台分类"
      :visible.sync="drawer"
      :direction="`ltr`"
      :append-to-body="true"
      size="220px"
    >
      <ul class="menu-list">
        <li
          v-for="ele in displayList"
          :class="{ 'is-active': currentDisplay.id === ele.id }"
          :key="ele.lable"
          @click="changeDisplay(ele)"
        >
          {{ ele.label }}
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import logo from '../logo';
import sidebarItem from './sidebarItem';

export default {
  name: 'sidebar',
  components: { sidebarItem, logo },
  data() {
    return {
      drawer: false
    };
  },
  async created() {
    await this.$store.dispatch('GetDispalyList');
    if (!this.currentDisplay || !this.currentDisplay.value) return;
    this.$store
      .dispatch('GetMenu', {
        type: true,
        parentId: -1,
        prodId: this.currentDisplay.value
      })
      .then(data => {
        if (data.length === 0) return;
        this.$router.$avueRouter.formatRoutes(data, true);
      });
  },
  computed: {
    ...mapGetters([
      'tagWel',
      'website',
      'menu',
      'tag',
      'keyCollapse',
      'screen',
      'displayList',
      'currentDisplay',
      'isCollapse'
    ]),
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {},
  methods: {
    changeDisplay(current) {
      if (current && current.value) {
        this.$store.commit('SET_CURRENT_DISPLAY', current);
        this.$store.commit('DEL_ALL_TAG');
        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            src: this.tagWel.value
          }),
          query: this.tagWel.query
        });
        this.$store
          .dispatch('GetMenu', { prodId: current.value })
          .then(data => {
            if (data.length === 0) {
              // this.$router.$avueRouter.formatRoutes([], true);
              return;
            }
            this.$router.$avueRouter.formatRoutes(data, true);
          });
        this.drawer = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.avue-sidebar--tip {
  color: #666;
  background-color: rgba(64, 158, 255, 0.2);
}
.title {
  padding: 8px 0 10px 20px;
  font-size: 16px;
}
.drawer-btn {
  cursor: pointer;
  position: absolute;
  right: -15px;
  top: 76px;
  z-index: 9999;
  width: 30px;
  height: 30px;
  background: url(~@/assets/img/group.png);
  background-size: 100% 100%;
}
.display-drawer {
  ::v-deep {
    .el-drawer__header {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .menu-list {
    li {
      cursor: pointer;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
      &.is-active {
        color: var(--primary);
        background: $mainBgHover;
      }
      &:hover {
        color: var(--primary);
      }
    }
  }
}
</style>
