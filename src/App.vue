<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { setStore, getStore, clearStore } from '@/util/store';
export default {
  name: 'app',
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      timer: null,
      isRouterAlive: true //控制视图是否显示的变量
    };
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') return;
    this.getVersion(true);
    this.timer = setInterval(() => {
      this.getVersion();
    }, 5 * 60 * 1000);
  },
  methods: {
    reload() {
      console.log(8);
      this.isRouterAlive = false; //先关闭，
      setTimeout(() => {
        this.isRouterAlive = true; //再打开
      }, 50);
    },
    async getVersion(bool) {
      await new Promise((resolve, reject) => {
        const $version = document.querySelector('#version');
        if ($version) {
          $version.remove();
        }
        var versionScript = document.createElement('script');
        versionScript.id = 'version';
        versionScript.src = '/cdn/version.js?v=' + new Date().getTime();
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(versionScript, s);
        setTimeout(() => {
          resolve();
        }, 200);
      });
      console.log(window.KP);
      console.log(getStore({ name: 'KP' }));
      if (!window.KP) {
        this.getVersion(true);
        clearInterval(this.timer);
        this.timer = null;
      }
      if (bool) {
        setStore({
          type: 'session',
          content: window.KP || '',
          name: 'KP'
        });
      } else {
        if (getStore({ name: 'KP' }) !== window.KP) {
          clearInterval(this.timer);
          this.timer = null;
          this.$notify({
            type: 'warning',
            title: '有新版本啦',
            message: '关闭将自动更新页面',
            position: 'bottom-right',
            duration: 0,
            close: () => {
              console.log(close);
              clearStore({ type: 'session' });
              window.location.reload();
            }
          });
        }
      }
    }
  }
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
