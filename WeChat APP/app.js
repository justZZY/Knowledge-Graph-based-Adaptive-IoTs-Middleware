//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.autoUpdate()

  },
  globalData: {
    userInfo: null,
    jsonobj: null,
    equipmentobj: null,
    equipmentobjarray: null,    //设备对象组，即站点组
  },

  autoUpdate: function(){
    let _this = this
    // 获取小程序更新机制的兼容，由于更新的功能基础库要1.9.90以上版本才支持，所以此处要做低版本的兼容处理
    if(wx.canIUse('getUpdateManager')){
      // wx.getUpdateManager接口，可以获知是否有新版本的小程序、新版本是否下载好以及应用新版本的能力，会返回一个UpdateManager实例
      const updateManager = wx.getUpdateManager()
      // 检查小程序是否有新版本发布，onCheckForUpdate：当小程序向后台请求完新版本信息，会通知这个版本告知检查结果
      updateManager.onCheckForUpdate(function(res){
        // 请求完新版本信息的回调
        if(res.hasUpdate){
          // 检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序',
            success: function(res){
              if(res.confirm){
                // 用户确定更新小程序，小程序下载和更新静默进行
                _this.downLoadAndUpdate(updateManager)
              }else if(res.cancel){
                // 若用户点击了取消按钮，二次弹窗，强制更新，如果用户选择取消后不需要进行任何操作，则以下内容可忽略
                wx.showModal({
                  title: '提示',
                  content: '本次版本更新涉及到新功能的添加，旧版本将无法正常使用',
                  showCancel: false, // 隐藏取消按钮
                  confirmText: '确认更新', // 只保留更新按钮
                  success: function(res){
                    if(res.confirm){
                      // 下载新版本，重启应用
                      _this.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        } 
      })
    } else {
      // 在最新版本客户端上体验小程序
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
      })
    }
  },
  // 下载小程序最新版本并重启
  downLoadAndUpdate: function(updateManager){
    wx.showLoading()
    // 静默下载更新小程序新版本，onUpdateReady：当新版本下载完成回调
    updateManager.onUpdateReady(function(){
      wx.hideLoading()
      // applyUpdate：强制当前小程序应用上新版本并重启
      updateManager.applyUpdate()
    })
    // onUpdateFailed：当新版本下载失败回调
    updateManager.onUpdateFailed(function(){
      // 下载新版本失败
      wx.showModal({
        title: '已有新版本',
        content: '新版本已经上线了，请删除当前小程序，重新搜索打开',
      })
    })
  }
})