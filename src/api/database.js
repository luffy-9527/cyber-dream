import { dreamDict } from '@/store/dictData';

// 模拟云端数据库查询接口
export function searchDreamsFromDatabase(keyword) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!keyword) {
        resolve(dreamDict);
        return;
      }
      const kw = keyword.toLowerCase();
      const res = dreamDict.filter(item => 
        item.title.includes(kw) || 
        item.keywords.some(k => k.includes(kw))
      );
      resolve(res);
    }, 400); // 模拟数据库查询延迟
  });
}

// 模拟云端数据库获取详情接口
export function getDreamDetailFromDatabase(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = dreamDict.find(d => d.id === id);
      resolve(res);
    }, 300); // 模拟数据库查询延迟
  });
}