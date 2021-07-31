<template>
  <img class="auth-image" :src="aSrc" />
</template>

<script>
import apiRequest from '@/router/apiAxios';
import { onMounted, toRefs, reactive } from '@vue/composition-api';
export default {
  name: 'auth-image',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { src } = toRefs(props);
    const state = reactive({
      aSrc: ''
    });

    onMounted(() => {
      getSrc();
    });

    const getSrc = async () => {
      const data = await apiRequest({
        url: src.value,
        method: 'get',
        responseType: 'blob'
      });
      console.log(data);
      state.aSrc = URL.createObjectURL(data);
    };

    return {
      ...toRefs(state)
    };
  }
};
</script>

<style scoped lang="scss">
/* ~@/styles/variables.scss; 引入css类 */
.auth-image {
}
</style>
