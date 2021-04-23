// pages/login/login.js

Page({ 
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    loading: false
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

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "中贸智慧水务服务平台"
    })

    this.getOpenid();
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("用户已授权!")
          wx.getUserInfo();
          // var openidHave = wx.getStorageSync('openid')
          that.checkBindAccount("onLoad");
        }
        else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          console.log("用户没有授权!")
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });

      // console.log("openid是：" + wx.getStorageSync('openid'))
      this.checkBindAccount("bindGetUserInfo");
    }
    else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            // console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  getOpenid: function () {
    console.log("getOpenid函数运行！")
    let that = this;  //获取openid不需要授权
    wx.login({
      success: function (res) {    //请求自己后台获取用户openid
        wx.request({
          // url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx9f2aee29d39d0e07&secret=972d6f8b01edddd12b3edfc920424124&js_code=' + res.code + '&grant_type=authorization_code',    //官方http接口，用于获取session_key和openId
          url:'https://ai-sewage-weixin.club:8084/wxLogin/getOpenid',
          // url:'http://localhost:8084/wxLogin/getOpenid',
          method: "POST",
          dataType: 'json',
          data: {
            code: res.code
          },
          header: {
          'content-type': 'application/json'
          },
          success: function (response) {
            console.log(response)
            var openid = response.data.openid;
            console.log('请求获取openid:' + openid);
            wx.setStorageSync('openid', openid);      //可以把openid存到本地，方便以后调用
            that.setData({
              openid: openid
            })
          }
        })
      }
    })
  },

  // // 获取用户openid
  // getOpenid: function () {
  //   console.log("getOpenid函数运行！")
  //   let that = this;  //获取openid不需要授权
  //   wx.login({
  //     success: function (res) {    //请求自己后台获取用户openid
  //       wx.request({
  //         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx9f2aee29d39d0e07&secret=972d6f8b01edddd12b3edfc920424124&js_code=' + res.code + '&grant_type=authorization_code',    //官方http接口，用于获取session_key和openId
  //         success: function (response) {
  //           // console.log(response)
  //           var openid = response.data.openid;
  //           console.log('请求获取openid:' + openid);
  //           wx.setStorageSync('openid', openid);      //可以把openid存到本地，方便以后调用
  //           that.setData({
  //             openid: openid
  //           })
  //         }
  //       })
  //     }
  //   })
  // },


  //检查是否绑定账号
  checkBindAccount: function (fnName) {
    var that = this;
    if (!wx.getStorageSync('userJson'))  //本地无用户信息
      wx.redirectTo({
        url: '../bindAccount/bindAccount'
      })
    else  //本地有用户信息
      wx.request({
        url: 'https://ai-sewage-weixin.club:8084/wxLogin/check',
        method: "POST",
        dataType: 'json',
        data: {
          openid: wx.getStorageSync('openid'),
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (response) {
          if (response.data.res === 'success') {    //已绑定该openid
            console.log("已绑定")
            // console.log(wx.getStorageSync('userJson').shiroToken)
            that.runFBoxAccount();
          }
          else {
            console.log("未绑定")
            if (fnName === "onLoad") {
              that.setData({
                isHide: true
              });
            }
            else {
              wx.redirectTo({
                url: '../bindAccount/bindAccount'
              })
            }
          }
        },
        fail: function (err) {
          console.log("返回失败！")
        }
      })
  },

  //登录FBox账号
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
        // console.log('access_token: ' + app.globalData.jsonobj['access_token'])
        // console.log('refresh_token: ' + app.globalData.jsonobj['refresh_token'])
        that.runEquipment()
      }
    })
  },

  //获取设备对象
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
        console.log(response)
        that.loading = false
        // 解析请求到的设备数据
        app.globalData.equipmentobj = JSON.parse(JSON.stringify(response))['data']
        // wx.setStorageSync('equipmentobjarray', getArray(app.globalData.equipmentobj))
        app.globalData.equipmentobjarray = getArray(app.globalData.equipmentobj)
        // wx.setStorageSync('equipobj', app.globalData.equipmentobjarray)
        // console.log(app.globalData.equipmentobjarray)
        app.globalData.sites = wx.getStorageSync('show_sites')

        wx.switchTab({
          url: '../siteMap/siteMap',
        })
      }
    })
  },
})


//获取站点组
function getArray (arrayObj) {
  let array = []
  for (let i = 0; i < arrayObj.length; i++) {
    array = array.concat(arrayObj[i]['boxRegs'])
  }
  return array
}






