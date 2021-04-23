// pages/siteStatistics/siteStatistics.js

import * as echarts from '../../components/ec-canvas/echarts';
import { monitorOption, barOption } from '../../js/chart'

var myChartLine;  //折线图
const MONITOR_WATCH_CLASS = 'monitorWatch';
const NODE_NUM = 10;   //图表最多显示的节点数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _title: "站点监测",
    editURL:'',
    is_online : true,
    has_equip : true,
    src:'',
    ShowList : false,
    has_video : true,
    need_reload : false,
    monitor_data : [],
    editId : '',
    editName : '',
    temp_name :'',
    temp_url:'',
    ShowEdit : false,
    ShowDelete : false,
    ShowAdd : false,
    swiperIdx: 0,
    imgList: ["http://182.254.148.104:8083/pic/%E5%B7%A5%E8%89%BA.png"],
    // group: [
    //   { src: "/images/PPT-1.jpg" },
    //   { src: "/images/PPT-2.jpg" }
    //   // { src: "/images/testImage.jpg" }
    // ],
    listData: [
      { "col1": "日处理吨位", "col2": "30" },
      { "col1": "上周处理吨位", "col2": "200" },
      { "col1": "月处理吨位", "col2": "900" },
      { "col1": "总处理吨位", "col2": "10900" },
      { "col1": "平均日电耗(kwh)", "col2": "8" },
      { "col1": "上周电耗(kwh)", "col2": "60" },
      { "col1": "上月电耗(kwh)", "col2": "250" },
      { "col1": "总电耗(kwh)", "col2": "2750" }
    ],

    ecLine: {
      // onInit: getEquipData   //给 echarts折线图 绑定初始化函数
      lazyLoad: true
    },

    ecBarPh: {
      onInit: initChartBarPh   //给 ph echarts 绑定初始化函数
    },

    ecBarAn: {
      onInit: initChartBarAn   //给 氨氮 echarts绑定初始化函数
    },

    ecBarAcc: {
      onInit: initChartBarAcc   //给 累计流量 echarts 绑定初始化函数
    },

    realTimeDataThemeArr: { sensor: '传感器', time: '时间', value: '数值' },
    realTimeDataItemArr: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data._title
    })

  },

  onReady: function () {
    // 获取组件
    // this.ecComponent = this.selectComponent('#mychart-line');
    // console.log(this.ecComponent)
    // this.websocket()
  },

  onShow: function (options) {

    const app = getApp()
    
    app.globalData.sitePage[wx.getStorageSync('siteId')][0] += 1
    if(wx.getStorageSync('siteId') == 27){
      this.setData({
        group: [
          { src: "/images/centre.jpg" },
          { src: "/images/centre2.jpg" }
          // { src: "/images/testImage.jpg" }
        ]
      })
    }
    else{
      this.setData({
        group: [
          { src: "/images/PPT-1.jpg" },
          { src: "/images/PPT-2.jpg" }
          // { src: "/images/testImage.jpg" }
        ]
      })
    }
    // console.log(app.globalData.sitePage[wx.getStorageSync('siteId')][1])

    // if(wx.getStorageSync('siteChange')){
    if(app.globalData.sitePage[wx.getStorageSync('siteId')][0] <= 1){
      // console.log("获取对象")
        this.setData({
          is_online : true,
          has_equip : true,
        })

      this.ecComponent = this.selectComponent('#mychart-line');
      // this.init();
      // this.websocket();
    }
    else{
      wx.setStorageSync('siteChange' , false)
    }
    this.init();
    this.websocket();

    console.log(app.globalData.sitePage[wx.getStorageSync('siteId')][0])

    this.getVideo()

    //定时器，用于加载假的实时数据，临时用
    this.loadFakeRealTimeData()
  },

  onHide: function () {
    const app = getApp()
    this.setData({
      // is_online : true,
      // has_equip : true,
      // need_reload : false
      monitor_data : [],
      realTimeDataItemArr: []
    })

    if(app.globalData.sitePage[wx.getStorageSync('siteId')][0] < 1){
      this.setData({
        is_online : true,
        has_equip : true,
      })
    }
  },

  preview(event) {
    console.log(event.currentTarget.dataset.src)
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imgList, // 需要预览的图片http链接列表
      showmenu: true
    })
  },

  getVideo: function(){
    const app = getApp()
    var siteId = wx.getStorageSync('siteId')
    var that = this
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/getSiteDetail',
      method: "POST",
      dataType: 'json',
      data: {
        siteID : siteId
      },
      header: {
        // 'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (res) {
        // res = JSON.parse(JSON.stringify(res))
        console.log("站点信息")
        console.log(res)
        if(! res.data.hasOwnProperty("monitors")){
          res.data.monitors = []
          wx.setStorageSync('monitorRes', res.data)
          that.setData({
            has_video : false
          })
        }
        else{
          if(res.data.monitors.length == 0){
            wx.setStorageSync('monitorRes', res.data)
            that.setData({
              has_video : false
            })
          }
          else{
            console.log(res.data.monitors)
            wx.setStorageSync('monitorRes', res.data)
            // res.data.monitors=JSON.parse(res.data.monitors)
            console.log(res.data.monitors)
            for(var i = 0; i < res.data.monitors.length; i++){
              res.data.monitors[i].id = i
            }
            that.setData({
              has_video : true,
              monitor_data : res.data.monitors
            })
          }
        }
      }
    })
  },

  bindPlay: function(e) {
    this.setData({
      ShowList : false,
      src : this.data.monitor_data[e.currentTarget.id].url
    })
  },

  bindClose: function(){
    this.setData({
      ShowList : true,
      src : ''
    })
  },

  bindEdit: function(e){
    this.setData({
      editId : e.currentTarget.id,
      // ShowList : false,
      src : '',
      ShowEdit : true,
      ShowAdd : false,
      editName : this.data.monitor_data[e.currentTarget.id].name,
      editURL: this.data.monitor_data[e.currentTarget.id].url
    })
  },

  bindDelete: function(e){
    this.setData({
      editId : e.currentTarget.id,
      ShowDelete : true,
      // ShowList : false,
      src : '',
      editName : this.data.monitor_data[e.currentTarget.id].name
    })
  },

  bindAdd: function(){
    console.log( wx.getStorageSync('monitorRes'))
    this.setData({
      editId :  wx.getStorageSync('monitorRes').monitors.length,
      ShowAdd : true,
      // ShowList : false,
      ShowEdit : true,
      src : '',
      has_video : true,
      editName : '',
      editURL : ''
    })
    console.log(this.data.editId)
  },

  setName: function(e){
    if(e.detail.value == null){
      this.setData({
        temp_name : this.data.editName
      })
      
    }
    else{
      this.setData({
        temp_name : e.detail.value
      })
    }
    
  },

  setUrl: function(e){
    if(e.detail.value == null){
      this.setData({
        temp_url : this.data.editURL
      })
      console.log(this.data.temp_url)
    }
    else{
      this.setData({
        temp_url : e.detail.value
      })
    }
  },

  cancelEdit: function(){
    this.setData({
      ShowEdit : false,
      temp_name:'',
      temp_url:''
    })
  },

  confirmEdit: function(){
    var id = this.data.editId
    var _monitor_data = this.data.monitor_data

    if(this.data.temp_name == '' || this.data.temp_url == '') {
      if(_monitor_data[id].name == '' && _monitor_data[id].url == ''){
        wx.showModal({
          title: '修改提示',
          content: '站点名称/URL不能为空',
          success: function(res){
            wx.redirectTo({
              url: '../siteStatics/siteStatics'
            })
          }
        })
        return;
      }
      else{
        if(this.data.temp_name == ''){
          this.data.temp_name = _monitor_data[id].name
        }
        if(this.data.temp_url == ''){
          this.data.temp_url = _monitor_data[id].url
        }
      }
    }

    if(this.data.ShowEdit && !this.data.ShowAdd){
      _monitor_data[id].name = this.data.temp_name
      _monitor_data[id].url = this.data.temp_url
    }
    else{
      var temp = {
        id : id,
        name : this.data.temp_name,
        url : this.data.temp_url
      }
      _monitor_data.push(temp)
    }

    var req = wx.getStorageSync('monitorRes')
    req.monitors = _monitor_data
    var that = this
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/setSiteDetail',
      method: "POST",
      dataType: 'json',
      data: req,
      header: {
        // 'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (res) {
        
        that.setData({
          ShowEdit : false,
          temp_name:'',
          temp_url:''
        })
        that.getVideo()
      }
    })
  },

  cancelDelete: function(){
    this.setData({
      ShowDelete : false,
      ShowEdit : false,
      temp_name:'',
      temp_url:''
    })
  },

  confirmDelete: function(){
    var id = this.data.editId
    var _monitor_data = this.data.monitor_data
    _monitor_data.splice(id,1)

    var req = wx.getStorageSync('monitorRes')
    req.monitors = _monitor_data
    var that = this
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/equip/setSiteDetail',
      method: "POST",
      dataType: 'json',
      data: req,
      header: {
        // 'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (res) {
        console.log(res)
        that.setData({
          ShowDelete : false,
          temp_name:'',
          temp_url:''
        })
        that.getVideo()
      }
    })
  },

  init: function () {
    var index;
    console.log("初始化折线图1")
    // myChartLine = initChartLine(canvas, width, height, dpr);
    this.ecComponent.init((canvas, width, height, dpr)=>{
      console.log("初始化折线图2")
      myChartLine = echarts.init(canvas, null, {    //echarts初始化
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      canvas.setChart(myChartLine);
      var option = {
        grid: {   //图表距离四周的距离，x：左，x2：右，y：上，y2：下
          x: 50,
          x2: 50,
          y: 250,
          y2: 40
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          itemGap: 15,
          data: [],
          selectedMode: 'single'
        },
        xAxis: [{
          type: 'time',
          name: '时间',
          boundaryGap: false,
          splitLine: {
            show: false
          }
        }],
        yAxis: [
          {
            name: '数值',
            type: 'value',
            boundaryGap: ['0', '0.3'],   //图表留白比例：下侧0%，上侧30%
            splitLine: {    //分割线
              lineStyle: {    //类型
                type: 'dashed'  //虚线
              }
            }
          }
        ],
        series: []
      };
      myChartLine.setOption(option);
      console.log("初始化折线图3")
      var lineOption = myChartLine.getOption();
      console.log('初始化数据')
      const app = getApp();
      try {
        index = wx.getStorageSync('siteId')
        console.log(index)
      } catch (e) {
        console("===false")
      }
      // let index = this.$store.state.Treedata.chooseData
      var that = this

      try{
        var authorization = 'Bearer ' + app.globalData.jsonobj['access_token']
        var apiBaseUrl = app.globalData.equipmentobjarray[index]['box']['cs']['apiBaseUrl']
        var boxNo = app.globalData.equipmentobjarray[index]['box']['boxNo']
      }catch(err){
        that.setData({
          need_reload : true
        })
      }

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
          console.log('getEquipData下success：')
          console.log(data)
          try{
            var monitorNames = that.getTypeNames(data, '传感')
            console.log(monitorNames)
            var realTimeDataItemArr = setRealTimeDataSensor(monitorNames)   //获取实时数据的传感器名称
            that.setData({ realTimeDataItemArr: realTimeDataItemArr })
            lineOption = getInitOptions(monitorNames, lineOption)
            wx.setStorageSync('monitorNums', getTypeNums(monitorNames, MONITOR_WATCH_CLASS))
          }catch(err){
            console.log("设备空缺")
          }
          that.getEquipValue(monitorNames, 'monitor', lineOption)
          console.log(that.data.is_online)
        }
      })
      if(!that.data.need_reload){
        wx.showLoading({
          title: '加载中',
          mask: true
        })
      }
      return myChartLine;
    });
  },

  getEquipValue(names, type, lineOption) {
    var index;
    try {
      index = wx.getStorageSync('siteId')
    } catch (e) {
      console("===false")
    }
    const app = getApp();
    // let index = this.$store.state.Treedata.chooseData
    var authorization = 'Bearer ' + app.globalData.jsonobj['access_token']
    var apiBaseUrl = app.globalData.equipmentobjarray[index]['box']['cs']['apiBaseUrl']
    var boxNo = app.globalData.equipmentobjarray[index]['box']['boxNo']
    var that = this
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
        var values = res['data']
        console.log("getEquipValue下values: ")
        console.log(values)
        if(values[0] == null){
          that.setData({
            is_online : false
          })
        }
        if(values.code == "20011"){
          that.setData({
            need_reload : true
          })
        }
        if (type === 'rate') {
          // 取消频率计
          // formatRateOptionArray(values)
          // this.setRateCharts()
        } else if (type === 'monitor') {
          try{
          that.formatMonitorOptionArray(values, lineOption)
          }catch(err){
            console.log("设备离线")
          }
        }
      }, //定位失败回调      
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
  },

  formatMonitorOptionArray(dataSet, lineOption) {
    for (var i = 0; i < dataSet.length; i++) {
      // console.log(dataSet[i])
      var names = dataSet[i]['name'].split('_')
      var time = rTime(dataSet[i]['timestamp']).substring(0,rTime(dataSet[i]['timestamp']).length-3)
      // console.log(time)
      var data = [[time, dataSet[i]['value'].toFixed(2)]]
      lineOption.series[i].data = data;
      myChartLine.setOption(lineOption)
    }
  },

  getTypeNames(dataSet, type) {
    var index = -1
    var names = []
    for (var i = 0; i < dataSet.length; i++) {
      if (dataSet[i]['name'] === type) {
        index = i
      }
    }

    if(index == -1){
      this.setData({
        has_equip : false
      })
    }

    console.log(this.data.has_equip)

    for (var i = 0; i < dataSet[index]['items'].length; i++) {
      names.push(dataSet[index]['items'][i]['name'])
    }
    return names
  },
  
  websocket() {
    var that = this
    wx.connectSocket({
      url: 'wss://ai-sewage-weixin.club:8084/websocket'
    })
    wx.onSocketOpen(function (res) {
      console.log('打开websocket连接')
    })
    wx.onSocketMessage((res) => {
      that.solveSocketData(res)
    })
    wx.onSocketClose((res) => {
      console.log('连接已关闭')
    })
  },

  solveSocketData(data) {
    // 校验是否是当前设备数据
    var index = wx.getStorageSync('siteId')
    console.log("解析"+index+"的数据")
    if(this.data.is_online == false || this.data.has_equip == false){
      wx.closeSocket()
    }
    const app = getApp();
    var boxId = app.globalData.equipmentobjarray[index]['box']['id']
    // console.log('boxId: ' + boxId)
    var narray = data['data'].split('_')
    // console.log('solveSocketData下的narray: ')
    // console.log(narray)
    var type = narray[1]
    var name = narray[2]
    if (narray[0] === boxId) {
      // 根据type类型区别更新设备值
      if (type === '传感') {
        var value1 = narray[narray.length - 2]
        var timestamp = narray[narray.length - 1]
        var realTimeDataItemArr = updateMonitorData(this.data.realTimeDataItemArr, name, value1, timestamp)
        this.setData({ realTimeDataItemArr: realTimeDataItemArr })
      } else if (type === '频率') {
        var value2 = narray[narray.length - 2]
        // this.updateRateData(name, value2)
      }
    } else {
      return false
    }
  },

  // 轮播图效果二
  bindchange(e) {
    this.setData({
      swiperIdx: e.detail.current
    })
  },

  videoErrorCallback: function(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },


  //定时器，加载假的实时数据
  loadFakeRealTimeData: function () {
    console.log("定时器")
    var that = this

    // for (var i = 0; i < that.data.realTimeDataItemArr.length; i++) {
    //   that.data.realTimeDataItemArr[i]["time"] = " "
    //   that.data.realTimeDataItemArr[i]["value"] = " "
    // }
    // that.setData({ realTimeDataItemArr: that.data.realTimeDataItemArr })



    // setTimeout(function () {
    //   //要延时执行的代码
    var timerName = setInterval(function () {
      console.log("定时器内部")

      if (that.data.realTimeDataItemArr.length == 0) {
        console.log("定时器if")
        that.data.realTimeDataItemArr.push({ sensor: "pH值(pH)", time: " ", value: " " })
        that.data.realTimeDataItemArr.push({ sensor: "水温(℃)", time: " ", value: " " })
        that.data.realTimeDataItemArr.push({ sensor: "浊度值(NTU)", time: " ", value: " " })
        that.data.realTimeDataItemArr.push({ sensor: "溶解氧值(mg)", time: " ", value: " " })
        that.data.realTimeDataItemArr.push({ sensor: "水箱水位(m)", time: " ", value: " " })
        that.data.realTimeDataItemArr.push({ sensor: "环境温度(℃)", time: " ", value: " " })
        that.data.realTimeDataItemArr.push({ sensor: "瞬时流量(m³)", time: " ", value: " " })
        console.log(that.data.realTimeDataItemArr)
        that.setData({ realTimeDataItemArr: that.data.realTimeDataItemArr })
      // }
      // if(myChartLine.getOption().series==[]){
        var monitorNames = []
        for (let i = 0; i < that.data.realTimeDataItemArr.length; i++) {
          monitorNames.push(that.data.realTimeDataItemArr[i]["sensor"])
        }
        console.log("monitorNames: ")
        console.log(monitorNames)
        var lineOption = myChartLine.getOption();
        lineOption = getInitOptionsFake(monitorNames, lineOption)
        console.log("lineOption::::::")
        console.log(lineOption)
        myChartLine.setOption(lineOption)
      }

      var curTime = new Date();
      var nowMonth = curTime.getMonth() + 1
      var nowDate = curTime.getDate()
      var nowHours = curTime.getHours()
      var nowMinutes = curTime.getMinutes()
      var nowSeconds = curTime.getSeconds()
      if (nowMonth < 10)
        nowMonth = "0" + nowMonth
      if (nowDate < 10)
        nowDate = "0" + nowDate
      if (nowHours < 10)
        nowHours = "0" + nowHours
      if (nowMinutes < 10)
        nowMinutes = "0" + nowMinutes
      if (nowSeconds < 10)
        nowSeconds = "0" + nowSeconds
      var time = curTime.getFullYear() + "-" + nowMonth + "-" + nowDate + " " + nowHours + ":" + nowMinutes + ":" + nowSeconds
      // console.log("时间打印：")
      // console.log(time)
      // var timestamp = Date.parse(new Date())
      // var time = rTime(timestamp)

      var ph = 8.70 + Math.random()
      var waterTemp = 16.00 + Math.random()
      var dimness = 0.80 + Math.random()
      var o2 = 9.50 + Math.random()
      var waterPos = 0.23 + Math.random()
      var emvironmentTemp = 20.70 + Math.random()
      var curFlow = 1.00 + Math.random()
      var otherData = 1.00 + Math.random()
      console.log("that.data.realTimeDataItemArr.length:")
      console.log(that.data.realTimeDataItemArr.length)



      // if (that.data.realTimeDataItemArr.length != 0) {
      for (var i = 0; i < that.data.realTimeDataItemArr.length; i++) {
        that.data.realTimeDataItemArr[i]["time"] = time
        if (that.data.realTimeDataItemArr[i]["sensor"] == "pH值(pH)")
          that.data.realTimeDataItemArr[i]["value"] = ph
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "水温(℃)")
          that.data.realTimeDataItemArr[i]["value"] = waterTemp
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "浊度值(NTU)")
          that.data.realTimeDataItemArr[i]["value"] = dimness
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "溶解氧值(mg)")
          that.data.realTimeDataItemArr[i]["value"] = o2
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "水箱水位(m)")
          that.data.realTimeDataItemArr[i]["value"] = waterPos
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "环境温度(℃)")
          that.data.realTimeDataItemArr[i]["value"] = emvironmentTemp
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "瞬时流量(m³)")
          that.data.realTimeDataItemArr[i]["value"] = curFlow
        else
          that.data.realTimeDataItemArr[i]["value"] = otherData


        // console.log("折线图更新数据提示：")
        // console.log(rTime(time)+","+parseFloat(that.data.realTimeDataItemArr[i]["value"]).toFixed(2))
        //更新折线图

        var option = myChartLine.getOption();
        // console.log("option.series: ")
        // console.log(option.series)
        for (let j = 0; j < option.series.length; j++) {
          if (!option.series[j].data) {
            option.series[j].data = []
          }
          if (that.data.realTimeDataItemArr[i]["value"] != " " && option.series[j].name.split('(')[0] === that.data.realTimeDataItemArr[i]["sensor"].substr(0, that.data.realTimeDataItemArr[i]["sensor"].indexOf("("))) {
            if (option.series[j].data && option.series[j].data.length >= NODE_NUM) {
              option.series[j].data.shift()
            }
            if (option.series[j].data && option.series[j].data.length === 0) {
              var data = [[rTime(time), parseFloat(that.data.realTimeDataItemArr[i]["value"]).toFixed(2)]]
              option.series[j].data = data;
            }
            else { }
            option.series[j].data.push([rTime(time), parseFloat(that.data.realTimeDataItemArr[i]["value"]).toFixed(2)])
            // 更新相应的折线图表
            myChartLine.setOption(option)
          }
        }


        that.data.realTimeDataItemArr[i]["time"] = time.substr(10, 18)
        if (that.data.realTimeDataItemArr[i]["sensor"] == "ph值(pH)")
          that.data.realTimeDataItemArr[i]["value"] = ph.toFixed(2)
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "水温(℃)")
          that.data.realTimeDataItemArr[i]["value"] = waterTemp.toFixed(2)
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "浊度值(NTU)")
          that.data.realTimeDataItemArr[i]["value"] = dimness.toFixed(2)
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "溶解氧值(mg)")
          that.data.realTimeDataItemArr[i]["value"] = o2.toFixed(2)
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "水箱水位(m)")
          that.data.realTimeDataItemArr[i]["value"] = waterPos.toFixed(2)
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "环境温度(℃)")
          that.data.realTimeDataItemArr[i]["value"] = emvironmentTemp.toFixed(2)
        else if (that.data.realTimeDataItemArr[i]["sensor"] == "瞬时流量(m³)")
          that.data.realTimeDataItemArr[i]["value"] = curFlow.toFixed(2)
        else
          // if (that.data.realTimeDataItemArr[i]["value"] == " ")
          that.data.realTimeDataItemArr[i]["value"] = otherData.toFixed(2)

      }
      that.setData({ realTimeDataItemArr: that.data.realTimeDataItemArr })
      // }

      // else {


      // }




    }, 5000)
    // }, 2000) //延迟时间
  }

})


// websocket推送数据
function updateMonitorData(realTimeDataItemArr, name, value, timestamp) {
  //更新实时表格
  // console.log("更新实时表格: ")
  // console.log(realTimeDataItemArr)
  for (var i = 0; i < realTimeDataItemArr.length; i++) {
    if (realTimeDataItemArr[i]["sensor"].indexOf(name) != -1) {
      realTimeDataItemArr[i]["time"] = rTime(timestamp).substr(10, 18)
      realTimeDataItemArr[i]["value"] = parseFloat(value).toFixed(2)
    }
  }
  console.log(realTimeDataItemArr)

  //更新折线图
  console.log("折线图数值：")
  console.log(timestamp + "," + value)
  var option = myChartLine.getOption();
  for (let i = 0; i < option.series.length; i++) {
    if (option.series[i].name.split('(')[0] === name) {
      if (option.series[i].data.length >= NODE_NUM) {
        option.series[i].data.shift()
      }
      if (option.series[i].data.length === 0) {
        var data = [[rTime(timestamp), parseFloat(value).toFixed(2)]]
        option.series[i].data = data;
      }
      else
        option.series[i].data.push([rTime(timestamp), parseFloat(value).toFixed(2)])
      // 更新相应的折线图表
      myChartLine.setOption(option)
    }
  }
  return realTimeDataItemArr
}







// -------------实时数据相关-----------------

function getTypeNums(dataSet, type) {
  var ans = []
  for (let i = 0; i < dataSet.length; i++) {
    ans.push(type + i)
  }
  return ans
}

function setRealTimeDataSensor(dataSet) {
  var realTimeDataItemArr = []
  for (var i = 0; i < dataSet.length; i++) {
    var realTimeDataItem = {}
    realTimeDataItem['sensor'] = dataSet[i].split('_')[1] + '(' + dataSet[i].split('_')[2] + ')'
    realTimeDataItem['time'] = ' '
    realTimeDataItem['value'] = ' '
    realTimeDataItemArr.push(realTimeDataItem)
  }
  console.log('realTimeDataItemArr: ')
  console.log(realTimeDataItemArr)
  return realTimeDataItemArr
}
/*
 * 组装模板数组数据
 * args: dataSet:设备全称
 */
function getInitOptions(dataSet, option) {
  // console.log('getInitOptions的dataSet和option: ')
  // console.log(dataSet)
  // console.log(option)
  for (var i = 0; i < dataSet.length; i++) {
    // 只取设备名
    // let obj = JSON.parse(JSON.stringify(option))
    // obj['title']['text'] = dataSet[i].split('_')[1]
    option.legend[0].data.push(dataSet[i].split('_')[1] + '(' + dataSet[i].split('_')[2] + ')')   //拼接图例名称与单位
    option.series.push({
      type: 'line',
      showSymbol: true,    //显示数据点
      label: {      //显示数据
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
    })
    option.series[i].name = dataSet[i].split('_')[1] + '(' + dataSet[i].split('_')[2] + ')'   //拼接图例名称与单位
  }
  return option
}

function getInitOptionsFake(dataSet, option) {
  console.log('getInitOptions的dataSet和option: ')
  console.log(dataSet)
  console.log(option)
  for (var i = 0; i < dataSet.length; i++) {
    // 只取设备名
    // let obj = JSON.parse(JSON.stringify(option))
    // obj['title']['text'] = dataSet[i].split('_')[1]
    option.legend[0].data.push(dataSet[i])   //拼接图例名称与单位
    option.series.push({
      type: 'line',
      showSymbol: true,    //显示数据点
      label: {      //显示数据
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
    })
    option.series[i].name = dataSet[i]
  }
  return option
}
// 获取相关主题index


//初始化折线图的option


//格式化时间函数
function rTime(date) {
  // var json_date = new Date(date).toJSON();
  // console.log(new Date(new Date(json_date)+8*3600*1000))
  // return new Date(new Date(json_date)+8*3600*1000)

  var _date = new Date(date)
    //年
  var Y = _date.getFullYear();
    //月  
  var M = (_date.getMonth() + 1 < 10 ? '0' + (_date.getMonth() + 1) : _date.getMonth() + 1);
    //日  
  var D = _date.getDate() < 10 ? '0' + _date.getDate() : _date.getDate();
    //时  
  var h = _date.getHours();
    //分  
  var m = _date.getMinutes();
    //秒  
  var s = _date.getSeconds();

  var time = Y + '/' + M + '/' + D+ ' ' + h + ':' + m + ':' + s
  // var json_date = new Date(date).toJSON();
  // console.log(new Date(json_date))
  // return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  return time

}





//柱状图模板
function initBar(canvas, width, height, dpr) {
  var chart = null;
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  var option = {
    title: {
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
    },
    grid: {
      left: 10,
      right: 40,
      bottom: 15,
      top: 50,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
      }
    ],
    yAxis: [
      {
        type: 'value',
        boundaryGap: ['0', '0.05'],   //图表留白比例：下侧0%，上侧5%
      }
    ],
    series: [
      {
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        },
      },
      {
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        },
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

//初始化ph柱状图
function initChartBarPh(canvas, width, height, dpr) {
  var phChart = initBar(canvas, width, height, dpr);  //初始化ph图
  const option = phChart.getOption();
  option.title.text = 'ph值'    //设定标题
  var data0 = [[2016, 6], [2017, 7], [2018, 2], [2019, 4], [2020, 3]]
  option.series[0].name = '进水ph值';
  option.series[0].data = data0;    //设置一个图例数据
  var data1 = [[2016, 8], [2017, 4], [2018, 3], [2019, 5], [2020, 7]]
  option.series[1].name = '出水ph值';
  option.series[1].data = data1;
  phChart.setOption(option);
  return phChart;
}

//初始化氨氮柱状图
function initChartBarAn(canvas, width, height, dpr) {
  const anChart = initBar(canvas, width, height, dpr);
  const option = anChart.getOption();
  option.title.text = '氨氮值'
  var data0 = [[2016, 2], [2017, 1], [2018, 3], [2019, 4], [2020, 3]]
  option.series[0].name = '进水氨氮值';
  option.series[0].data = data0;
  var data1 = [[2016, 2], [2017, 2], [2018, 4], [2019, 1], [2020, 3]]
  option.series[1].name = '出水氨氮值';
  option.series[1].data = data1;
  anChart.setOption(option);
  return anChart;
}

//初始化累计流量柱状图
function initChartBarAcc(canvas, width, height, dpr) {
  const accChart = initBar(canvas, width, height, dpr);
  const option = accChart.getOption();
  option.title.text = '累计流量'
  var data0 = [[2016, 200], [2017, 300], [2018, 400], [2019, 400], [2020, 300]]
  option.series[0].name = '累计进水量';
  option.series[0].data = data0;
  var data1 = [[2016, 200], [2017, 400], [2018, 300], [2019, 500], [2020, 500]]
  option.series[1].name = '累计出水量';
  option.series[1].data = data1;
  accChart.setOption(option);
  return accChart;
}


