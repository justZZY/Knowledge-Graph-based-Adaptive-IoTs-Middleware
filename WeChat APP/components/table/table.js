// components/table/table.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tableThemes: {
      type: Object, // 因此处的thead是json  式，故将数据类型设置为object
      // value: '' //默认值
      },
      tableItems: {
      type: Array,
      },
  },

  /**
   * 组件的初始数据
   */
  data: {
    someData: {} // 暂未设置，跟其他页面的data属性和用法类似
  },

  /**
   * 组件的方法列表
   */
  methods: {
    customMethod: function() {
      // 暂为定义
      }
  }
})
