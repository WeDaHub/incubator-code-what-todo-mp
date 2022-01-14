// components/viewBoard/index.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: '备注',
    },
    text: String,
    show: {
      type: Boolean,
      value: false,
    },
  },
  data: {

  },
  methods: {
    close() {
      this.triggerEvent('close');
    },
  },
});
