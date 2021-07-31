<template>
  <div>
    <el-autocomplete
      class="inline-input"
      :disabled="ifDisabled"
      v-model="self_value"
      :fetch-suggestions="querySearch"
      placeholder="请输入网站标识码"
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>
<script>
import { listBySiteCodeApi } from '@/api/website/column-monitor/column-monitor';
export default {
  props: {
    /**
     * 双向绑定值
     * 单选是主键
     * 多选是主键数组
     */
    value: {
      type: [Number, String],
      default: ''
    },
    ifDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      self_value: this.value
    };
  },
  watch: {
    self_value(val) {
      this.$emit('update:value', val);
    },
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.self_value = val;
      }
    }
  },
  methods: {
    // 远程筛选
    getData() {},
    async querySearch(queryString, cb) {
      let results = [];
      if (queryString.length >= 4) {
        let param = {
          siteCode: queryString
        };
        const { data = [] } = await listBySiteCodeApi(param);
        data.forEach(element => {
          element['value'] = element.accountName + '_' + element.siteCode;
        });
        results = data;
      }
      this.$emit('update:value', queryString);
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect(item) {
      console.log(item);
      this.$emit('selectSite', item);
      if (item.value.split('-').length > 0) {
        this.self_value = item.value.split('_')[1];
        this.$emit('update:value', item.value.split('_')[1]);
      } else {
        this.$emit('update:value', item.value);
      }
    }
  }
};
</script>
