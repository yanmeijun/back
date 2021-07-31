export default function({ name = 'option', list = [], diff = 0 }) {
  return {
    data() {
      return {
        // visibleTable: 0,
        visibled: false,
        timer: null
      };
    },
    beforeDestroy() {
      let t = this;
      window.removeEventListener('resize', t.delay);
    },
    mounted() {
      this.resetTableHeightHandler();
    },
    methods: {
      resetTableHeightHandler() {
        let t = this;
        window.addEventListener('resize', t.delay);
        t.resetTableHeight();
      },
      delay() {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.resetTableHeight();
        }, 500);
      },
      resetTableHeight() {
        let windowHeight = document.body.clientHeight;
        let header = document.querySelector('.avue-header');
        let search = document.querySelector('.avue-crud-search');
        let headerclient = header ? header.clientHeight : 0;
        let searchclient = search ? search.clientHeight : 0;
        let num = 0;
        for (let i = 0; i < list.length; i++) {
          let elClintNum =
            document.querySelector(list[i]) &&
            document.querySelector(list[i]).clientHeight;
          num += elClintNum || 0;
        }

        let option = null;
        if (name.includes('.')) {
          let keys = name.split('.');
          keys.forEach((key, index) => {
            option = index === 0 ? this[key] : option[key];
          });
        } else {
          option = this[name];
        }
        if (!option) {
          return;
        }
        let height =
          windowHeight - headerclient - searchclient - num - 110 - diff;
        this.$set(option, 'height', height);
        // this.visibleTable++;
        this.visibled = false;
        this.$nextTick().then(() => {
          this.visibled = true;
        });
      }
    }
  };
}
