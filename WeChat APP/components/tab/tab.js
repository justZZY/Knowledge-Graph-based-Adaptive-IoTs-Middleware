// components/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTab: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    swichNav: function (e) {    //导航条tab点击事件
      // console.log("swichNav函数！")
      var that = this;
      if (e.target.dataset.current === "0") {   //点击“站点地图”，跳转
        console.log("点击了站点地图！")
        // wx.redirectTo({
        //   url: '/pages/siteMap/siteMap'   //跳转地址
        // })
      }
      else if (e.target.dataset.current === "1") {   //点击“站点统计”，跳转
        console.log("点击了站点统计！")
        // wx.redirectTo({
        //   url: '/pages/'
        // })
      }
      else if (e.target.dataset.current === "2") {   //点击“设备控制”，跳转
        console.log("点击了设备控制！")
        // wx.redirectTo({
        //   url: '/pages/equipmentControl/equipmentControl'
        // });
      }
      else if (e.target.dataset.current === "3") {   //点击“工单巡检”，跳转
        console.log("点击了工单巡检！")
        // wx.redirectTo({
        //   url: '/pages/'
        // })
      }


    },
  },



})
