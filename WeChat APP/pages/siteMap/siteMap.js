
Page({
    data: {
      _title: "站点地图",
      latitude:'24.829251',
      longitude :'102.853094',
      speed :'',
      accuracy :'',
      scale:12,
      hasMarkers : false,
      markers:[],
      suggestion:[],
      addListShow: false,
      siteId: '',

      user:{},
      modalVisible:false
    },
  //   onReady() {
  //     this.mapCtx = wx.createMapContext('map')
  //  },

  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '中贸智慧水务云服务平台'
        })
      }, 2000)
    })
    return {
      title: '中贸智慧水务云服务平台',
      path: '/pages/bindAccount/bindAccount',
      promise 
    }
  },

    onLoad: function (options) {
      const app = getApp()  
      // app.globalData.siteChange = false
      this.setData({
        siteId: wx.getStorageSync('show_sites')[wx.getStorageSync('show_sites').length - 1].id
      })
      try {
        wx.setStorageSync('siteChange',false)
      } catch (e) { }
      wx.setNavigationBarTitle({
        title: "中贸环境"
      })
      try {
        wx.setStorageSync('siteId',this.data.siteId)
      } catch (e) { }
      wx.getLocation({
          type: 'gcj02',
          altitude: true,
          //定位成功，更新定位结果      
          success: (res) =>{
            
            const app = getApp()
            // console.log(app.globalData.sites)
              this.setData({//赋值
              longitude: res.longitude,
              // longitude: this.data.longitude,
              latitude: res.latitude,
              // latitude:this.data.latitude,
              speed: res.speed,
              scale : this.data.scale ,
              accuracy: res.accuracy,
              markers:app.globalData.sites,
              addListShow: false
            })
          },     
          fail: function() {
            wx.hideLoading();
          },
          complete: function() {      
            wx.hideLoading()
          }
        })
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        // 请求所有点
      wx.setStorageSync('siteId',-1)

      const arrPage = [0 , 0];
      app.globalData.sitePage = []
      for(let n= 0 ; n < wx.getStorageSync('equipobj').length ; n++){
        app.globalData.sitePage[n] = arrPage
      }
      
      // console.log(app.globalData.sitePage)


    },

    onShow:function(option){
      const app = getApp()
  
      try{
        wx.request({
          url: 'https://ai-sewage-weixin.club:8084/equip/equipLogin',
          method: "POST",
          dataType: 'json',
          header: {
            'Authorization': wx.getStorageSync('userJson').shiroToken
          },
          success: function (response) {
            if(response.data.code == 20011){
              wx.showModal({
                title: '登录提示',
                content: '用户信息已过期，请重新登录',
                success: function(res){
                        if(res.confirm){
                          wx.redirectTo({
                            url: '../bindAccount/bindAccount'
                          })
                        }
                      }
              })
            }
          }
        })
      }catch(err){
        console.log(err)
      }
    },

    onHide:function(options){
      var old_siteId = wx.getStorageSync('siteId')
      var new_siteId = this.data.siteId
      const app = getApp() 
      var first_site_index = wx.getStorageSync('show_sites').length - 1
      if(old_siteId == -1){
        wx.setStorageSync('siteId' , wx.getStorageSync('show_sites')[first_site_index].id)
      }
      if(old_siteId == new_siteId){
        // 保持socket连接
        // app.globalData.siteChange = false
        try {
          wx.setStorageSync('siteChange',false)
        } catch (e) { }
      }
      else{
        // siteId缓存刷新，关闭原socket连接，开启新站点连接
        app.globalData.sitePage = new Array()
        for(let n= 0 ; n < wx.getStorageSync('equipobj').length ; n++){
          app.globalData.sitePage[n] = [0,0]
        }
        console.log(app.globalData.sitePage)
        wx.setStorageSync('siteId',new_siteId)
        // app.globalData.siteChange = true
        try {
          wx.setStorageSync('siteChange',true)
        } catch (e) { }
      }
    },

    gotoThis: function(e){
      const app = getApp()
      console.log(e.detail.markerId)
      this.setData({
        longitude :  wx.getStorageSync('equipobj')[e.detail.markerId].longitude,
        latitude :  wx.getStorageSync('equipobj')[e.detail.markerId].latitude,
        scale : 14,
        siteId : e.detail.markerId
      })
      // try {
      //   wx.setStorageSync('siteId', e.detail.markerId)
      // } catch (e) { }
    },
    showAddList: function () {
      const app = getApp()
      this.setData({
        addListShow : true,
        suggestion : app.globalData.sites
      })
      
      // console.log(this.data.suggestion)
    },
    back1: function () {
      const app = getApp()
      if (this.data.addListShow) {
        this.setData({
          addListShow: false,
          // suggestion : app.globalData.sites
        })
      }else {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    getsuggest: function (e) {
      var _this = this;
      const app = getApp()
      var keyword = e.detail.value;
      const _suggestion = JSON.parse(JSON.stringify(app.globalData.sites));
      _suggestion.sort(function(a, b) {
        if(a.title.indexOf(keyword) > b.title.indexOf(keyword) || a.address.indexOf(keyword) > b.address.indexOf(keyword))
          return -1
        if(a.title.indexOf(keyword) < b.title.indexOf(keyword) || a.address.indexOf(keyword) < b.address.indexOf(keyword))
          return 1
        return 0
      })
      _this.setData({
        addListShow: true,
        suggestion:_suggestion
      })
        
    },
    backmap: function (e) {
      var id = e.currentTarget.id;
      console.log(id)
      // console.log(wx.getStorageSync('equipobj'))
      let name = e.currentTarget.dataset.name;
      const app = getApp()
      this.setData({
        addListShow: false,
        longitude : wx.getStorageSync('equipobj')[id].longitude,
        latitude : wx.getStorageSync('equipobj')[id].latitude,
        scale : 14,
        siteId : id
      })

      // try {
      //   wx.setStorageSync('siteId', id)
      //   console.log("应跳至"+ id)
      // } catch (e) { }
    },


    //点击用户icon触发
    clickUserIcon(e){
      console.log("点击用户icon触发")
      console.log(wx.getStorageSync("userJson"))
      var userJson=wx.getStorageSync("userJson")
      this.data.user.name=userJson.username
      this.data.user.phone=userJson.phone
      this.data.user.mail=userJson.mail
      this.setData({
        modalVisible:true,   //显示modal
        user:this.data.user,
      })
    },

    //modal退出
    modalConfirm(){
      console.log("点击退出！！")
      this.setData({
        modalVisible:false   //隐藏modal
      })
      wx.removeStorageSync('userJson')
      wx.redirectTo({
        url: '/pages/login/login'
      })
    },

    //modal点击空白处
    modalCancel(){
      this.setData({
        modalVisible:false   //隐藏modal
      })
    }

})
