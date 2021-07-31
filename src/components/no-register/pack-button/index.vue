<template>
  <el-button type="text" @click="packUpHandle"
    >{{ packUp ? '收起' : '展开'
    }}<i
      class="el-icon-arrow-up el-icon--right"
      :class="[packUp ? '' : 'el-icon-arrow-down']"
    ></i
  ></el-button>
</template>
<script>
export default {
  name: 'pack-button',
  props: {
    packUp: Boolean
  },
  methods: {
    packUpHandle() {
      this.$emit('packClick');
    }
  }
};
</script>
