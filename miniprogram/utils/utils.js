// 获取当天，yyyy-mm-dd
export const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

// 挑选对象中的指定字段
export const pick = (obj, arr) => arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});

// 过滤对象中的指定字段
export const objFilter = (obj, arr) => {
  const keys = Object.keys(obj).filter(k => !arr.includes(k));
  return pick(obj, keys);
};

// 闰年
export const isLeapYear = year => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
