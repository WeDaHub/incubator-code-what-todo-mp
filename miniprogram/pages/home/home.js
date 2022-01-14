// miniprogram/pages/home/home.js
import create from '../../libs/omix/create';
import store from '../../store/index';
import Dialog from '../../@vant/weapp/dialog/dialog';
import { addTodo } from '../../database/todos/insert';
import { getTodayTodos } from '../../database/todos/query';
import { updateTodoItem } from '../../database/todos/update';
import { deleteTodoItem } from '../../database/todos/remove';
import { getToday, objFilter } from '../../utils/utils';
import dayjs from 'dayjs';

create.Page(store, {
  use: ['todoList'],
  data: {
    today: '',
    itemBoardType: null,
    showBoard: false,
    actionShow: false,
    todoItem: {},
    actions: [
      {
        name: '编辑',
        type: 'edit',
      },
      {
        name: '查看',
        type: 'view',
      },
      {
        name: '删除',
        type: 'delete',
        color: '#FF5C5C',
      },
    ],
    showPopUp: true,
    showViewBoard: false,
    viewBoardTitle: '备注',
    viewText: '',
  },
  onLoad() {
    this.getCurrentTime();
    // 拉取todos
    this.getTodoList();
  },
  // 获取数据
  getTodoList(refresh = false) {
    wx.showLoading({ title: 'loading...' });
    getTodayTodos(dayjs(getToday()).unix())
      .then((res) => {
        wx.hideLoading();
        if (refresh) {
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '刷新成功！',
            icon: 'scuucess',
            duration: 1500,
          });
        }
        this.store.data.todoList = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // 创建todo
  openBoard() {
    this.setData({
      showBoard: true,
      itemBoardType: 'create',
    });
  },
  // 关闭todoboard
  closeBoard() {
    this.setData({
      showBoard: false,
      itemBoardType: null,
    });
  },
  // 保存todo
  saveTodo(event) {
    const { type, todoId, index } = event.detail;
    const updateDate = objFilter(event.detail, ['index', 'type', 'todoId']);
    wx.showLoading({ title: 'loading...' });
    if (type === 'edit') {
      // 编辑
      updateTodoItem({ id: todoId, data: updateDate })
        .then(() => {
          wx.hideLoading();
          this.store.data.todoList[index] = updateDate;
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type === 'create') {
      // 创建
      addTodo({
        date: dayjs(getToday()).unix(),
        ...updateDate,
      })
        .then((res) => {
          wx.hideLoading();
          this.store.data.todoList.push({
            _id: res._id,
            ...event.detail,
          });
        })
        .catch((err) => {
          // wx.hideLoading();
          console.log(err);
        });
    }
  },
  // 切换todo状态
  itemToggle(event) {
    const { index, done, todoId } = event.detail;
    updateTodoItem({ id: todoId, data: { done } }, false)
      .then(() => {
        this.store.data.todoList[index].done = done;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // todo 长按 唤起action
  todoLongPress(event) {
    this.setData({
      actionShow: true,
      todoItem: event.detail,
    });
  },
  // action列表点击事件
  actionSelect(event) {
    const { type } = event.detail;
    if (type === 'edit' || type === 'view') {
      this.setData({
        itemBoardType: type,
        showBoard: true,
        actionShow: false,
      });
    } else if (type === 'delete') {
      this.setData({
        actionShow: false,
      });
      this.confirmToRemove();
    }
  },
  // 确认删除dialog
  confirmToRemove() {
    Dialog.confirm({
      title: '提示',
      message: '确认删除这条任务吗？',
    })
      .then(() => {
        const { index, todoId } = this.data.todoItem;
        this.removeTodoItem(index, todoId);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // 删除todo
  removeTodoItem(index, id) {
    deleteTodoItem(id)
      .then(() => {
        wx.showToast({
          title: '删除成功！',
          icon: 'success',
        });
        this.store.data.todoList.splice(index, 1);
        this.setData({
          todoItem: {},
        });
      })
      .catch((err) => {
        wx.showToast({
          title: '删除失败！',
          icon: 'error',
        });
        console.log(err);
      });
  },
  // 关闭actionsheet
  closeActions() {
    this.setData({
      actionShow: false,
      todoItem: {},
    });
  },
  getCurrentTime() {
    const today = getToday();
    this.setData({
      today,
    });
  },
  openViewsBoard(event) {
    this.setData({
      showViewBoard: true,
      viewText: event.detail,
    });
  },
  closeViewsBoard() {
    this.setData({
      showViewBoard: false,
      viewText: '',
    });
  },
  onPullDownRefresh() {
    this.data.showBoard ? wx.stopPullDownRefresh() : this.getTodoList(true);
  },
});
