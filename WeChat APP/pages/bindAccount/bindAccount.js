// pages/bindAccount/bindAccount.js
Page({
  data: {
    username: '',
    password: '',
    own_sites:[]
  },

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
    // 页面初始化 options为页面跳转所带来的参数
  },


  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  usernameInput: function (event) {
    this.setData({ username: event.detail.value })
  },

  passwordInput: function (event) {
    this.setData({ password: event.detail.value })
  },


  bindAccount: function () {
    // console.log("开始绑定账号！");
    this.wxLogin(wx.getStorageSync('openid'), this.data.username, this.data.password)
  },




  //微信账号登录
  wxLogin: function (openid, username, password) {
    var app = getApp()
    var that=this;
    console.log("微信账号登录");
    console.log("账号密码：" + username + "," + password);
    if(wx.getStorageSync('username') == '' || wx.getStorageSync('username') != username){
      app.globalData.userChange = true
    }
    else
      app.globalData.userChange = false
    wx.login({
      success: function (res) {    //请求自己后台获取用户openid
        wx.request({
          url: 'https://ai-sewage-weixin.club:8084/wxLogin/auth',
          method: "POST",
          dataType: 'json',
          data: {
            openid: openid,
            username: username,
            password: password
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (response) {
            
            // response.data.area.replace("测试平台","联合实验室")
            console.log(response)
            let own = (response.data.area).split(";")
            own.push("联合实验室")
            console.log(own)
            that.setData({
              own_sites:own
            })
            wx.setStorageSync('own_sites', own)
            // console.log(wx.getStorageSync('own_sites'))

            if (response.data.res === 'success' && response.data.status==='success') {

              wx.setStorageSync('userJson', response.data)    //保存用户信息到本地
              that.runFBoxAccount();

            }
            else{
              wx.showModal({
                title: '警告',
                content: '绑定失败，请检查您的账号密码!',
                showCancel: false,
                confirmText: '知道了',
                success: function (res) {
                  // 用户没有授权成功，不需要改变 isHide 的值
                  if (res.confirm) {
                    // that.setData({
                    //   username:'',
                    //   password:''
                    // })
                  }
                }
              });
            }

          },
          fail: function (err) {
            console.log("返回失败！")
          }
        })
      }
    })
  },




  runFBoxAccount: function () {
    var that=this;
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/equipLogin',
      method: "POST",
      dataType: 'json',
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        const app = getApp();
        app.globalData.jsonobj = JSON.parse(JSON.stringify(response))['data']
        that.runEquipment()
      }
    })
  },


  runEquipment: function () {
    var that=this;
    const app = getApp();
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/getEquipments',
      method: "GET",
      dataType: 'json',
      data: {
        Authorization: 'Bearer ' + app.globalData.jsonobj['access_token'],
        XFBoxClientId: 'zzy_test'
      },
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        that.loading = false
        // 解析请求到的设备数据
        app.globalData.equipmentobj = JSON.parse(JSON.stringify(response))['data']
        app.globalData.equipmentobjarray = getArray(app.globalData.equipmentobj)
        wx.setStorageSync('equipobj', app.globalData.equipmentobjarray)
        
        that.getSiteAddress()
      }
    })
  },
  
  getSiteAddress: function() {
    let boxIdList = []
    var that=this;
    const app = getApp();
    for (let i = 0; i <  app.globalData.equipmentobjarray.length; i++) {
      boxIdList.push(app.globalData.equipmentobjarray[i].box.id)
    }
    
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/getSiteAddress',
      method: "POST",
      dataType: 'json',
      data: {
        Authorization: 'Bearer ' + app.globalData.jsonobj['access_token'],
        ClientId: 'zzy_test',
        ids:boxIdList
      },
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success:function(response){
        app.globalData.sites = []
        var location = app.globalData.equipmentobjarray;
        console.log(location)
        response = response.data
        console.log(response)
        for(var i = 0 ;i < response.length; i++){
          for (var j = 0; j < location.length; j++){
            // if(wx.getStorageSync('own_sites').indexOf(location[j].alias) != -1 || wx.getStorageSync('own_sites')[0] == 'all'){
            if(response[i].boxId == location[j].box.id){
              console.log("重写")
              if(response[i].longitude == 0.0){
                location[j].longitude = response[i].useLongitude
              }
              else{
                location[j].longitude = response[i].longitude
              }

              if(response[i].latitude == 0.0){
                location[j].latitude = response[i].uselatitude
              }
              else{
                location[j].latitude = response[i].latitude
              }
              location[j].address = response[i].address
            }
          }
        }
        app.globalData.equipmentobjarray = location
        wx.setStorageSync('equipobj', location)

        for(var i = 0; i < location.length; i++){
          if((wx.getStorageSync('own_sites').indexOf(location[i].alias) != -1 || wx.getStorageSync('own_sites')[0] == 'all') && location[i].alias.indexOf('接入测试') == -1){
            const temp = {
              id: i,
              latitude: location[i].latitude,
              longitude: location[i].longitude,
              iconPath: '../../images/单位工程质量检验记录.png', //图标路径
              width: 30,
              height: 30,
              title:location[i].alias,
              address:location[i].address,
              boxUid:location[i].boxUid,
              scale:14,
              callout: {
                content: location[i].alias,
                color: '#000000',
                fontSize: 14,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#000000',
                bgColor: '#f4d160',
                padding: 5,
                display: 'ALWAYS',
                textAlign: 'center'
              }
            }
            app.globalData.sites.push(temp);
          }
        }        
        wx.setStorageSync('show_sites', app.globalData.sites)
        
        console.log("该用户站点：")
        console.log(app.globalData.sites)
        wx.switchTab({
          url: '../siteMap/siteMap',
        })
      },
    })
  }



})



function getArray (arrayObj) {
  let array = []
  for (let i = 0; i < arrayObj.length; i++) {
    array = array.concat(arrayObj[i]['boxRegs'])
  }
  return array
}