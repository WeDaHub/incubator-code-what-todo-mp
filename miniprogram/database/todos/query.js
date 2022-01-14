// 查询是否已创建todo
const app = getApp();
const db = wx.cloud.database({
  env: app.globalData.env,
});

// 拉取当天的todo
export const getTodayTodos = date => new Promise((resolve, reject) => {
  db.collection('todos')
    .where({
      _openid: app.globalData.openid,
      date,
    })
    .get()
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
});

// 按时间段查询
export const getTodosBetween = (dateArr) => {
  const cmd = db.command;
  return new Promise((resolve, reject) => {
    db.collection('todos').where({
      date: cmd.gt(dateArr[0]).and(cmd.lt(dateArr[1])),
    })
      .get()
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
