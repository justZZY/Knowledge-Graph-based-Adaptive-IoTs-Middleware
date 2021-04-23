// pages/equipmentControl/equipmentControl.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _title: "设备控制",

    devicedata: [],
    
    index:'',

    has_equip : true,

    need_reload : false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data._title
    })
    // this.getEquipMonitor()
  },

  onShow: function (options) {

    const app = getApp()
    
    app.globalData.sitePage[wx.getStorageSync('siteId')][1] += 1

    if(app.globalData.sitePage[wx.getStorageSync('siteId')][1] <= 1){
      this.setData({
        has_equip:true
      })
      this.getEquipMonitor()
    }
  },

  onHide: function(options){
    const app = getApp()

    if(app.globalData.sitePage[wx.getStorageSync('siteId')][1] < 1){
      this.setData({
        has_equip : true,
        devicedata: []
      })
    }

  },




  // 获取监控的数据 会通过计算进行变动
  // args: apiBaseUrl boxNo
  getEquipMonitor() {
    // console.log("time")
    try {
      const _index = wx.getStorageSync('siteId')
      this.setData({
        index: _index,
      })
    } catch (e) {
      console("===false")
    }
    // console.log('开始getEquipMonitor！！！')
    var that = this;
    // let index = this.$store.state.Treedata.chooseData
    var index = that.data.index;       //临时参数，实际需要从站点地图传递
    const app = getApp();
    // console.log(index)
    try{
      var authorization = 'Bearer ' + app.globalData.jsonobj['access_token']
      var apiBaseUrl = app.globalData.equipmentobjarray[index]['box']['cs']['apiBaseUrl']
      var boxNo = app.globalData.equipmentobjarray[index]['box']['boxNo']
    }catch(err){
      that.setData({
        need_reload : true
      })
    }
    // var authorization = 'Bearer ' + app.globalData.jsonobj['access_token']
    // var apiBaseUrl = app.globalData.equipmentobjarray[index]['box']['cs']['apiBaseUrl']
    // var boxNo = app.globalData.equipmentobjarray[index]['box']['boxNo']

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/getEquipMonitor',
      method: "POST",
      dataType: 'json',
      data: {
        authorization: authorization,
        apiBaseUrl: apiBaseUrl,
        boxNo: boxNo
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (res) {
        var data = res['data']
        // console.log(data)
        // 请求设备控制数据
        var equipDataArray = findEquipName(data)
        // console.log('====equipDataArray')
        // console.log(equipDataArray)
        that.getEquipValue(equipDataArray, 'device')
        // 请求频率设备控制数据 (中贸设备不存在频率计)
        // let rateControlNameArray = findRateName(data)
        // console.log(rateControlNameArray)
        // this.getEquipValue(rateControlNameArray, 'rate')
      }
    })
    if(!that.data.need_reload){
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
  },


  // 获取监控寄存器的值
  getEquipValue(dataArray, type) {
    var that = this;
    // var index = this.$store.state.Treedata.chooseData
    var index = that.data.index;
    const app = getApp();
    var authorization = 'Bearer ' + app.globalData.jsonobj['access_token']
    var apiBaseUrl = app.globalData.equipmentobjarray[index]['box']['cs']['apiBaseUrl']
    var boxNo = app.globalData.equipmentobjarray[index]['box']['boxNo']
    var names = getMonitorNames(dataArray)
    // console.log(names)

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/getEquipValue',
      method: "POST",
      dataType: 'json',
      data: {
        authorization: authorization,
        apiBaseUrl: apiBaseUrl,
        boxNo: boxNo,
        names: names
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (res) {
        // console.log(res)
        // console.log("time2")
        var values = res['data']
        if (type === 'device') {
          var index = that.data.index;
          var stationName = app.globalData.equipmentobjarray[index]['alias']
          try{
            that.data.devicedata = that.formatDeviceData(values, dataArray, stationName)
          }catch(err){
            console.log(err)
            that.setData({
              has_equip : false
            })
          }

          that.setData({
            devicedata: that.data.devicedata
          })
        } else if (type === 'rate') {
          // this.sliderData = formatSliderData(values)
        }
      }, //定位失败回调      
      fail: function() {
        wx.hideLoading();
      },
      complete: function() {      
        wx.hideLoading()
      }
    })
  },
  formatDeviceData(datas, labelArray, name) {
    // console.log(datas)
    let firstMergeArray = []
    for (let i = 0; i < datas.length; i++) {
      let originName = datas[i]['name']
      // 分割字符串名
      let names = originName.split('_')
      let deviceName = names[1]
      let labelName = names[2]
      let label = getDeviceLabel(labelArray, datas, i, labelName)
      // 组装数据
      let index = getDeviceIndex(firstMergeArray, deviceName)
      if (index === -1) {
        firstMergeArray.push({ 'name': deviceName, [labelName]: label })
      } else {
        firstMergeArray[index][labelName] = label
      }
    }
    if(firstMergeArray.length == 0){
      console.log("需要重新登陆")
      this.setData({
        need_reload : true
      })
    }
    console.log(firstMergeArray)
    // 1.14 新增时间数据
    // 格式化deviceArray以满足需求
    if (name !== '云南大学测试平台') {
      let secondMergeArray = []
      for (let i = 0; i < firstMergeArray.length; i++) {
        // 通过命名规则保证存在以下命名数据
        let openHour = firstMergeArray[i]['开机小时']
        let openMin = firstMergeArray[i]['开机分钟']
        let closeHour = firstMergeArray[i]['关机小时']
        let closeMin = firstMergeArray[i]['关机分钟']
        let obj = {
          name: firstMergeArray[i]['name'],
          openTime: mergeTime(openHour, openMin),
          closeTime: mergeTime(closeHour, closeMin),
          runTime: firstMergeArray[i]['运行时间'],
          stopTime: firstMergeArray[i]['停止时间'],
          rsSwitch: firstMergeArray[i]['启停开关'],
          maSwitch: firstMergeArray[i]['手自动开关'],
          errorFeedback: firstMergeArray[i]['故障反馈'],
          runFeedback: firstMergeArray[i]['运行反馈']
        }
        secondMergeArray.push(obj)
      }
      // 1.14 新增设备筛选逻辑
      let thirdArray = []
      for (let i = 0; i < secondMergeArray.length; i++) {
        if (secondMergeArray[i].name !== '急停' && secondMergeArray[i].name !== '液位' &&
          secondMergeArray[i].name !== '机柜') {
          thirdArray.push(secondMergeArray[i])
        }
      }
      console.log(thirdArray)
      return thirdArray
    } else {
      let ynuArray = []
      for (let i = 0; i < firstMergeArray.length; i++) {
        let rsFlag = firstMergeArray[i]['启动开关'] === true
        let obj = {
          name: firstMergeArray[i]['name'],
          rsSwitch: rsFlag,
          maSwitch: firstMergeArray[i]['手自动开关'],
          errorFeedback: firstMergeArray[i]['故障反馈'],
          runFeedback: firstMergeArray[i]['运行反馈']
        }
        ynuArray.push(obj)
      }
      console.log(ynuArray)
      return ynuArray
    }
  },

  onChange(event) {
    console.log(event)
    var that = this;

    var equipIndex = event.target.dataset.idx;    //获取设备序号
    var equipName = event.target.dataset.equip.name     //获取设备名称
    var readyToChange = ''    //switch准备要切换成的状态
    if (event.target.dataset.name === '自/手动')   //根据切换项设置状态
      readyToChange = event.detail.value ? '自动' : '手动'
    else
      readyToChange = event.detail.value ? '打开' : '关闭'

    wx.showModal({
      title: equipName + "切换",
      content: '确定要将“' + equipName + '”切换成“' + readyToChange + '”吗？',
      showCancel: true,//是否显示取消按钮
      cancelColor: 'skyblue',//取消文字的颜色
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          if (event.target.dataset.name === '自/手动')
            that.data.devicedata[equipIndex].maSwitch = event.detail.value;  //重设devicedata数据
          else
            that.data.devicedata[equipIndex].runFeedback = event.detail.value ? '运行' : '停止';  //重设devicedata数据
          that.setData({    //更新devicedata
            devicedata: that.data.devicedata
          })
        }
      },
      fail: function (res) { 
        that.data.devicedata[equipIndex].errFeedback = '故障'
      },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })

  },

  autoChange(event) {
    var that = this;
    var scope = event.target.dataset.equip
    console.log(scope)
    var equipIndex = event.target.dataset.idx;    //获取设备序号
    let key = '手自动开关'
    let name = scope['name']
    let value = 1
    if (scope['maSwitch'] === true) {
      value = 0
    }
    wx.showModal({
      title: '提示',
      content: '此操作将修改设备' + name + '的值, 是否继续?',
      showCancel: true,//是否显示取消按钮
      cancelColor: 'skyblue',//取消文字的颜色
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        console.log('modal中的success函数！！')
        if (res.confirm) {
          that.setEquipValue(formatName(key, name), 0, value)
          that.data.devicedata[equipIndex].maSwitch = event.detail.value;  //重设devicedata数据
          that.setData({    //更新devicedata
            devicedata: that.data.devicedata
          })
        }
      },
      fail: function (res) {  //接口调用失败的回调函数
        console.log('modal中的fail函数！！')
        // scope['手自动开关'] = !scope['手自动开关']
        // this.$message({
        //   type: 'info',
        //   message: '已取消修改'
        // })
      },
    })
  },

  startOrStopEquip(event) {
    var that = this;
    var scope = event.target.dataset.equip
    console.log(scope)
    var equipIndex = event.target.dataset.idx;    //获取设备序号
    // let index = this.$store.state.Treedata.chooseData
    let index=that.data.index
    const app=getApp()
    let stationName = app.globalData.equipmentobjarray[index]['alias']
    let key=''
    let value=0

    // 在fbox设备中,只有学院实训台启停开关是分开的
    if(event.detail.value){
      key = (stationName === '联合实验室' ? '启动开关' : '启停开关')
      value = 1
    }
    else{
      key = (stationName === '联合实验室' ? '停止开关' : '启停开关')
      // 在fbox设备中,只有学院实训台启停开关是分开的,其他设备的停止是置0
      value = (stationName === '联合实验室' ? 1 : 0)
    }
      

    let name = scope['name']
    let keyName = formatName(key, name)
    let type = 0

    wx.showModal({
      title: '提示',
      content: '此操作将修改设备' + name + '的值, 是否继续?',
      showCancel: true,//是否显示取消按钮
      cancelColor: 'black',//取消文字的颜色
      confirmColor: 'black',//确定文字的颜色
      success: function (res) {
        console.log(res)
        console.log('modal中的success函数！！')
        if (res.confirm) {
          that.setEquipValue(keyName, type, value)
          that.data.devicedata[equipIndex].runFeedback = event.detail.value ? '运行' : '停止';  //重设devicedata数据
          that.setData({    //更新devicedata
            devicedata: that.data.devicedata
          })
        }
      }
    })

  },

  /*
    * 通用接口
    * 向服务器传值,修改相关的寄存器值
    */
  setEquipValue(name, type, value) {
    var that = this
    // let index = this.$store.state.Treedata.chooseData
    let index = wx.getStorageSync('siteId')
    const app = getApp()
    let authorization = 'Bearer ' + app.globalData.jsonobj['access_token']
    let apiBaseUrl = app.globalData.equipmentobjarray[index]['box']['cs']['apiBaseUrl']
    let boxNo = app.globalData.equipmentobjarray[index]['box']['boxNo']

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/setEquipValue',
      method: "POST",
      dataType: 'json',
      data: {
        authorization: authorization,
        apiUrl: apiBaseUrl,
        boxNo: boxNo,
        name: name,
        type: type,
        value: value
      },
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (res) {
        console.log(res)
        if(res.data.msg == "success"){
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
        }
        else{
          wx.showToast({
            title: '操作失败',
            duration: 1000,
            mask: true
          })
        }
        
      }
    })

  },

  addVideo: function() {
    
  },

})

function findEquipName(data) {
  let indexState = -1
  let indexRemote = -1
  let indexTime = -1
  for (let i = 0; i < data.length; i++) {
    if (data[i]['name'] === '状态') {
      indexState = i
    } else if (data[i]['name'] === '远程') {
      indexRemote = i
    } else if (data[i]['name'] === '定时') {
      indexTime = i
    }
  }
  let newData = []
  if (indexState !== -1 && indexRemote !== -1 && indexTime !== -1) {
    // 组合数组
    newData = data[indexState]['items'].concat(data[indexRemote]['items']).concat(data[indexTime]['items'])
  } else if (indexState !== -1 && indexRemote !== -1 && indexTime === -1) {
    newData = data[indexState]['items'].concat(data[indexRemote]['items'])
  }
  return newData
}


/*
   * 获取寄存器设备名称作为json参数传出
   * return: names
   */
function getMonitorNames(dataArray) {
  let names = []
  for (let i = 0; i < dataArray.length; i++) {
    names.push(dataArray[i]['name'])
  }
  return names
}





/*
   * 根据正则组合设备控制数据
   * arg: data:原始json拼凑的设备数据
   * return: 设备控制表数据
   */





/*
   * 获取相同设备名的index
   */
function getDeviceIndex(deviceArray, name) {
  for (let index = 0; index < deviceArray.length; index++) {
    const element = deviceArray[index]
    if (element['name'] === name) {
      return index
    }
  }
  return -1
}

/*
 * 获取设备label名
 * 判定太多单独提出来作为一个函数
 */
function getDeviceLabel(labelArray, datas, i, labelName) {
  let dataType = datas[i]['dataType']
  let value = datas[i]['value']
  // 位类型获取标记label
  let label = ''
  // 匹配正则 判定是否返回bool型数据
  let feedbackReg = /.*反馈/
  let switchReg = /.*开关/
  let feedbackFlag = feedbackReg.test(labelName)
  let switchFlag = switchReg.test(labelName)
  if (dataType === 0 && feedbackFlag) {
    if (value === 0) {
      label = labelArray[i]['label']['ftext']
    } else {
      label = labelArray[i]['label']['ttext']
    }
  } else if (dataType === 0 && switchFlag) {
    if (value === 0) {
      label = false
    } else {
      label = true
    }
  } else {
    // 暂时保留
    // 1.14 增加传值
    label = value
  }
  return label
}



/*
   * 合并时间小时:分钟
   */
function mergeTime(hour, min) {
  if (hour < 10) {
    hour = '0' + hour
  }
  if (min < 10) {
    min = '0' + min
  }
  return hour + ':' + min
}


/*
  * 组装寄存器name
  * 规则: 反馈=>状态 开关=>远程 **=>传感
  */
function formatName(key, name) {
  let ans = ''
  let reg = /.*开关/
  if (reg.test(key)) {
    ans = '远程'
  }
  return ans + '_' + name + '_' + key
}