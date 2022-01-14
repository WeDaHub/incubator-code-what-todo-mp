import { msgSecCheck } from '../../utils/security';

const app = getApp();
const db = wx.cloud.database({
  env: app.globalData.env,
});


export const update = ({ id, data }) => new Promise((resolve, reject) => {
  db.collection('todos').doc(id)
    .update({ data })
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
});

export const updateTodoItem = (data, check = true) => {
  const type = 'text';
  return check ? msgSecCheck(type, data, update) : update(data);
};
