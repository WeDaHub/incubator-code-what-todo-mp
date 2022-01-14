const app = getApp();
const db = wx.cloud.database({
  env: app.globalData.env,
});

// 删除一条todo
export const deleteTodoItem = id => new Promise((resolve, reject) => {
  db.collection('todos').doc(id)
    .remove()
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
});
