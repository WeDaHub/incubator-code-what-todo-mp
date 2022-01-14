// components/createBoard/index.js

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    type: {
      type: String,
      value: 'create',
    },
    todoId: String,
    index: Number,
    desc: String,
    remark: String,
    done: Boolean,
    level: {
      type: Number,
      value: 0,
    },
  },
  data: {
    btnText: '',
    title: '创建任务',
    levelList: [
      {
        level: 0,
        text: '无',
      },
      {
        level: 1,
        text: '低',
      },
      {
        level: 2,
        text: '中',
      },
      {
        level: 3,
        text: '高',
      },
    ],
  },
  observers: {
    type(type) {
      if (type && type === 'create') {
        this.setData({
          btnText: '添加',
          title: '创建任务',
        });
      } else if (type && type === 'edit') {
        this.setData({
          btnText: '确定',
          title: '编辑任务',
        });
      } else {
        this.setData({
          btnText: '关闭',
          title: '查看任务',
        });
      }
    },
  },
  methods: {
    close() {
      this.triggerEvent('close');
      this.setData({
        desc: '',
        remark: '',
      });
    },
    // input && textarea change
    onChange(event) {
      const maxLengthMap = {
        desc: 20,
        remark: 200,
      };
      const { type } = event.currentTarget.dataset;
      const valueLength = event.detail.value.length;
      const targetMax = maxLengthMap[type];
      if (targetMax && valueLength >= targetMax) {
        wx.showToast({
          title: type === 'desc' ? `请用${targetMax}个以内的字描述任务` : `备注最多${targetMax}个字`,
          icon: 'none',
        });
      }
      this.setData({
        [type]: event.detail.value,
      });
    },
    // 保存todo
    save() {
      if (!this.data.desc) {
        wx.showToast({
          title: '先想好任务再添加哦~',
          icon: 'none',
        });
        return;
      }
      if (this.data.type !== 'view') {
        const todo = {
          desc: this.data.desc,
          remark: this.data.remark,
          done: this.data.done,
          type: this.data.type,
          todoId: this.data.todoId,
          index: this.data.index,
          level: this.data.level,
        };
        this.triggerEvent('saveTodo', todo);
      }

      this.close();
    },
    levelChange(event) {
      if (this.data.type === 'view') {
        return;
      }
      const { level } = event.currentTarget.dataset;
      this.setData({ level });
    },
  },
});
