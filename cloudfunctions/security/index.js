// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口函数,安全能力
/**
 *
 * @param {*} event 包含传入的参数
 * event.type: 校验的安全类型
 *   type=image: 图片
 *   type=text: 文字
 * event.data: 具体的数据
 */
exports.main = async (event) => {
  const { type, data } = event;
  return securityMap[type] && await securityMap[type](data);
};

const msgSecCheck = async (content) => {
  try {
    return await cloud.openapi.security.msgSecCheck({ content });
  } catch (err) {
    return err;
  }
};

const securityMap = {
  text: msgSecCheck,
};


