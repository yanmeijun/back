/**
 * 栏目类别
 */
import apiRequest from '@/router/apiAxios';

// 获取栏目类别树数据
export const getChannelTypeTree = () => {
  return apiRequest({
    url: '/cloud-website-back/channelTree/tree',
    method: 'get'
  });
};
