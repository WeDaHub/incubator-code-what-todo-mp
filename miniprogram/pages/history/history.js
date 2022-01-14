// miniprogram/pages/history/history.js
import dayjs from 'dayjs';
import { getTodayTodos, getTodosBetween } from '../../database/todos/query';
import { isLeapYear } from '../../utils/utils';

Page({
  data: {
    type: 'date',
    dateText: '选择日期(天)',
    yearMonthText: '选择日期(月)',
    showDatePopUp: false,
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
    },
    dayList: [],
    monthList: [],
    total: 0,
    doneNums: 0,
    unDoneNums: 0,
    doneRate: 0,
  },
  dateConfirm(event) {
    const dateText = dayjs(event.detail).format('YYYY-MM-DD');
    const yearMonthText = dayjs(event.detail).format('YYYY-MM');
    // 查询格式化后的date,year-month 格式
    const date = dayjs(dateText).unix();

    // 设置文案
    if (this.data.type === 'date') {
      this.setData({ dateText, monthList: [], yearMonthText: '选择日期(月)' });
      this.getListByDay(date);
    } else {
      this.setData({ yearMonthText, dayList: [], dateText: '选择日期(天)' });
      const dateRange = this.getQueryDateArr(event.detail);
      this.getListByNonth(dateRange);
    }

    this.closeDatePopUp();
  },
  // 关闭popup
  closeDatePopUp() {
    this.setData({
      showDatePopUp: false,
    });
  },
  // 打开popup
  openDatePopUp(event) {
    const { type } = event.currentTarget.dataset;
    this.setData({
      currentDate: new Date().getTime(),
      showDatePopUp: true,
      type,
    });
  },
  // 拉取数据
  getListByDay(date) {
    wx.showLoading({ title: 'laoding...' });
    getTodayTodos(date).then((res) => {
      wx.hideLoading();
      this.setData({
        dayList: res.data,
      });
      this.getStatInfo(res.data);
    });
  },
  getListByNonth(dateRange) {
    wx.showLoading({ title: 'laoding...' });
    getTodosBetween(dateRange).then((res) => {
      const monthList = this.getClassifiedDate(res.data);
      this.setData({ monthList });
      this.getStatInfo(res.data);
      wx.hideLoading();
    })
      .catch((err) => {
        console.log(err);
      });
  },
  // 获取统计简单的统计数据
  getStatInfo(list) {
    const total = list.length;
    const doneNums = list.filter(item => item.done).length;
    const unDoneNums = list.filter(item => !item.done).length;
    const doneRate = `${parseInt(doneNums / total * 100, 10)}%`;

    this.setData({
      total,
      doneNums,
      unDoneNums,
      doneRate,
    });
  },
  // 根据传入日期计算当月范围，转换为unix时间
  getQueryDateArr(date) {
    // 31天
    const fullMonthArr = [1, 3, 5, 7, 8, 10, 12];
    const month = dayjs(date).month() + 1;
    const year = dayjs(date).year();

    if (month === 2 && isLeapYear(year)) {
      return [dayjs(`${year}-2`).unix(), dayjs(`${year}-2-29`).unix()];
    } if (month === 2 && !isLeapYear(year)) {
      return [dayjs(`${year}-2`).unix(), dayjs(`${year}-2-28`).unix()];
    }

    // 其他月份
    if (fullMonthArr.includes(month)) {
      return [dayjs(`${year}-${month}-1`).unix(), dayjs(`${year}-${month}-31`).unix()];
    }
    return [dayjs(`${year}-${month}-1`).unix(), dayjs(`${year}-${month}-30`).unix()];
  },
  // 对getTodosBetween查询的结果按时间聚合分类
  getClassifiedDate(dataArr) {
    const dates = Array.from(new Set(dataArr.map(item => item.date)));
    return dates.map((date) => {
      const temp = {
        dateStr: '',
        value: [],
      };
      dataArr.forEach((el) => {
        if (el.date === date) {
          const day = new Date(el.create_at);
          temp.dateStr = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
          temp.value.push(el);
        }
      });

      return temp;
    });
  },
});
