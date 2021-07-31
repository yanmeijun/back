import { ref, onBeforeMount } from '@vue/composition-api';
import { getDictDetailMap } from '@/api/common';
import { setStore, getStore } from '@/util/store';
/**
 *
 * @param {Array} typeNames 字典数组
 * @param {Boolean} isCache 是否缓存 default: true 缓存
 */
export default function(typeNames = [], isCache = true) {
  const dicList = ref({});
  const getDicList = async () => {
    // 返回对象
    const { dicTypes, dicMap } = getStoreTypes(typeNames);
    if (dicTypes.length === 0) {
      // 返回缓存
      dicList.value = dicMap;
      return;
    } else {
      // 继续部分请求
      typeNames = dicTypes;
    }

    // 没有， 发请求
    const { data } = await getDictDetailMap({
      typeNames
    });
    for (let dic of Object.keys(data)) {
      let list = data[dic].list || [];
      // 针对个别type特殊处理
      if (dic === 'prod_id') {
        list = list.filter(ele => ele.value !== '1');
        dicMap[dic] = list;
      }

      // 重置list
      dicMap[dic] = list;
      isCache && setStore({ name: dic, content: list, type: 'session' });
    }

    // 赋值
    dicList.value = dicMap;
  };

  const getStoreTypes = typeNames => {
    const dicMap = {};
    let dicTypes = [...typeNames];
    // 取缓存
    typeNames.forEach((ele, i) => {
      const list = getStore({
        name: ele,
        type: 'session'
      });
      if (list && list.length > 0) {
        dicMap[ele] = list;
        dicTypes = dicTypes.filter(type => type !== ele);
      }
    });
    return { dicTypes, dicMap };
  };

  onBeforeMount(() => {
    getDicList();
  });
  return {
    dicList
  };
}
