export const msgSecCheck = (type, data, cb) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'security',
    data: {
      type,
      data: JSON.stringify(data),
    },
  }).then((res) => {
    if (res.result && res.result.errCode === 0) {
      resolve(cb(data));
    } else {
      wx.showToast({
        title: '内容违规',
        icon: 'error',
      });
      reject({
        result: res.result,
        data,
        type,
      });
    }
  })
    .catch((err) => {
      console.log(err);
    });
});
