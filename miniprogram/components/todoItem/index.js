// components/todoItem/index.js
const computedBehavior = require('miniprogram-computed').behavior;
Component({
  behaviors: [computedBehavior],
  properties: {
    todoId: String,
    index: Number,
    desc: String,
    done: Boolean,
    remark: String,
    level: Number,
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  data: {},
  computed: {
    checkedColor(data) {
      return data.done ? '#c8c9cc' : '';
    },
    getIconColor(data) {
      return data.disabled ? '#c8c9cc' : '#5A95FF';
    },
  },
  methods: {
    toggle() {
      if (this.data.disabled) {
        return;
      }
      const detail = {
        todoId: this.data.todoId,
        index: this.data.index,
        done: !this.data.done,
      };
      this.triggerEvent('itemToggle', detail);
    },
    longPress() {
      if (this.data.disabled) {
        return;
      }
      this.triggerEvent('todoLongPress', this.data);
    },
    remarkTap() {
      this.triggerEvent('remarkTap', this.data.remark);
    },
  },
});
