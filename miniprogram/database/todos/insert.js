import { msgSecCheck } from '../../utils/security';
// add todo
const app = getApp();
const db = wx.cloud.database({
  env: app.globalData.env,
});
export const insert = data => new Promise((reslove, reject) => {
  db.collection('todos')
    .add({ data: {
      create_at: new Date().getTime(),
      create_time: new Date(),
      ...data,
    } })
    .then((res) => {
      reslove(res);
    })
    .catch((err) => {
      reject(err);
    });
});

// 文字审核
export const addTodo = (data) => {
  const type = 'text';
  return msgSecCheck(type, data, insert);
};
