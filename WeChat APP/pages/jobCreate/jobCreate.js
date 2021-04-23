// pages/jobCreate/jobCreate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    winWidth: 0,
    winHeight: 0,
    currentTab: { index: 0, value: '' },

    sites: [],
    multiArray: [[], [], []],   //“省” “市” “站”
    multiIndex: [0, 0, 0],    //“省” “市” “站” 对应的当前的选择序号
    siteIdsInCurCity: [],     //当前所选城市序号 对应的siteId


    problemTypeFormVisible: false,   //问题分类选择modal


    jobTypeListJson: {},
    sitesMap: {},

    jobAddForm: {
      jobTypeName: '',
      content: '',
      fileList: [],
      expectedTime: 48,
      severity: '一般',
      priority: '一般',
      site: '',
      siteID: '',
      siteAddr: ''
    },



    isShow: true,
    photoList: [], // 拍照图片列表(数据库的图片id)


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: "创建工单"
    })

    var that = this;

    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    this.queryJobTypeList()
    this.querySitesMap2()


    this.prepareSites()
    this.initMultiArray()
  },







  queryJobTypeList() {
    var that = this;
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/type/queryall',
      method: "POST",
      dataType: 'json',
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        let result = response.data
        let json = result.data
        that.setData({ jobTypeListJson: json })
        console.log("jobTypeListJson：")
        console.log(that.data.jobTypeListJson)
      },
      fail: function (error) {
        // this.$alert('服务器异常，请稍后再试！', '提示')
        console.log(error)
        that.setData({ jobTypeListJson: null })
      }
    })
  },

  /** 根据设备控制模块的缓存 */
  querySitesMap2() {
    const sites=getApp().globalData.sites
    for (let i = 0; i < sites.length; i++) {
      let curSite = sites[i]
      let site = {}
      site.name = curSite.title
      site.address = curSite.addr
      this.data.sitesMap[String(curSite.boxUid)] = site
      this.setData({ sitesMap: this.data.sitesMap })
    }
  },

  //点击问题分类按钮
  jobTypeSelectVisible() {
    this.data.currentTab['index'] = 0
    for (var key in this.data.jobTypeListJson) {    //只取初始值，用于对问题分类modal初始化
      this.data.currentTab['value'] = key
      break
    }
    this.setData({
      problemTypeFormVisible: true,
      currentTab: this.data.currentTab
    })
  },


  //准备站点信息，以备选择
  prepareSites() {
    var sites = []    //用于存储准备的站点信息
    // var curSites = wx.getStorageSync('show_sites')    //获取缓存中的站点信息
    var curSites = this.data.sitesMap;
    console.log("站点信息：")
    console.log(curSites)
    for (let key in curSites) {
      var siteId = key
      var addr = String(curSites[key]['address'])
      var province = addr.substring(0, addr.indexOf("省") + 1)   //获取省
      var city = addr.substring(addr.indexOf("省") + 1, addr.indexOf("市") + 1)    //获取市
      var title = curSites[key]['name']  //获取站点名称
      sites.push({ 'siteId': siteId, 'province': province, 'city': city, 'title': title, 'addr': addr })
    }
    // for (var i = 0; i < curSites.length; i++) {
    //   var siteId = curSites[i].id
    //   var addr = curSites[i].addr
    //   var province = addr.substring(0, addr.indexOf("省") + 1)   //获取省
    //   var city = addr.substring(addr.indexOf("省") + 1, addr.indexOf("市") + 1)    //获取市
    //   var title = curSites[i].title   //获取站点名称
    //   sites.push({ 'siteId': siteId, 'province': province, 'city': city, 'title': title, 'addr': addr })
    // }
    this.setData({ sites: sites })
    // console.log(this.data.sites)
  },


  //初始化多列选择器
  initMultiArray() {
    this.setData({  //清空
      multiArray: [[], [], []],
      siteIdsInCurCity: []
    })
    var sites = this.data.sites;
    for (var i = 0; i < sites.length; i++) {    //初始化 “省”
      if (!existInArray(this.data.multiArray[0], sites[i]['province']))   //"省"数组中还不存在该省
        this.data.multiArray[0].push(sites[i]['province'])
    }
    for (var i = 0; i < sites.length; i++) {    //初始化 “市”
      //"市"数组中还不存在该市 && 省为“省”数组中的第一个
      if (!existInArray(this.data.multiArray[1], sites[i]['city']) && sites[i]['province'] == this.data.multiArray[0][0])
        this.data.multiArray[1].push(sites[i]['city'])
    }
    for (var i = 0; i < sites.length; i++) {    //初始化 “站”
      //"站"数组中还不存在该站 && 市为“市”数组中的第一个
      if (!existInArray(this.data.multiArray[2], sites[i]['title']) && sites[i]['city'] == this.data.multiArray[1][0]) {
        this.data.multiArray[2].push(sites[i]['title'])
        this.data.siteIdsInCurCity.push(sites[i]["siteId"])   //存放当前城市对应的所有站点的siteId
      }
    }
    this.setData({
      multiArray: this.data.multiArray,
      siteIdsInCurCity: this.data.siteIdsInCurCity
    })
    // console.log(this.data.multiArray)
  },



  //绑定问题描述的输入
  bindProblemDescription(e) {
    this.data.jobAddForm.content = e.detail.value
    this.setData({ jobAddForm: this.data.jobAddForm })
  },



  //多列选择器点击“确定”
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    let siteID = this.data.siteIdsInCurCity[this.data.multiIndex[2]]    //存放所选站点id
    // console.log(siteID)
    // console.log(this.data.sitesMap)
    let site = this.data.sitesMap[String(siteID)]   //取到站点
    if (siteID === undefined || site === undefined) {
      this.data.jobAddForm.site = null
      this.data.jobAddForm.siteAddr = null
      this.data.jobAddForm.siteID = null
    } else {   //保存站点地址、id、名称
      this.data.jobAddForm.siteAddr = site.address
      this.data.jobAddForm.siteID = siteID
      this.data.jobAddForm.site = this.data.multiArray[2][this.data.multiIndex[2]]
    }
    this.setData({ jobAddForm: this.data.jobAddForm })
    // console.log(this.data.jobAddForm)
  },

  //多列选择器 更改列
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var sites = this.data.sites;
    this.data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:   //滑动 “省”
        this.setData({
          multiArray: [this.data.multiArray[0], [], []],    //保留“省”数组，清空“市”和“站”数组
          siteIdsInCurCity: []
        })
        for (var i = 0; i < sites.length; i++) {    //修改 “市” 数组
          //"市"数组中还不存在该市 && 省为当前选择的省
          if (!existInArray(this.data.multiArray[1], sites[i]['city']) && sites[i]['province'] == this.data.multiArray[0][this.data.multiIndex[0]])
            this.data.multiArray[1].push(sites[i]['city'])
        }
        for (var i = 0; i < sites.length; i++) {    //修改 “站” 数组
          //"站"数组中还不存在该站 && 市为“市”数组中的第一个
          if (!existInArray(this.data.multiArray[2], sites[i]['title']) && sites[i]['city'] == this.data.multiArray[1][0]) {
            this.data.multiArray[2].push(sites[i]['title'])
            this.data.siteIdsInCurCity.push(sites[i]["siteId"])   //存放当前城市对应的所有站点的siteId
          }

        }
        this.data.multiIndex[1] = 0;    //初始化当前“市”
        this.data.multiIndex[2] = 0;    //初始化当前“站”
        break;
      case 1:   //滑动 “市”
        this.setData({
          multiArray: [this.data.multiArray[0], this.data.multiArray[1], []],     //保留“省”和“市”数组，清空“站”数组
          siteIdsInCurCity: []
        })
        for (var i = 0; i < sites.length; i++) {    //修改 “站” 数组
          //"站"数组中还不存在该站 && 市为当前选择的市
          if (!existInArray(this.data.multiArray[2], sites[i]['title']) && sites[i]['city'] == this.data.multiArray[1][this.data.multiIndex[1]]) {
            this.data.multiArray[2].push(sites[i]['title'])
            this.data.siteIdsInCurCity.push(sites[i]["siteId"])   //存放当前城市对应的所有站点的siteId
          }
        }
        this.data.multiIndex[2] = 0;    //初始化当前“站”
        break;
    }
    // console.log(this.data.multiIndex);
    this.setData({
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      siteIdsInCurCity: this.data.siteIdsInCurCity
    });
    console.log("当前城市对应的siteIds：")
    console.log(this.data.siteIdsInCurCity)
  },





  //严重程度单选框改变
  jobSeverityRadioChange(e) {
    // console.log(e)
    this.data.jobAddForm.severity = e.detail.value;
    this.setData({ jobAddForm: this.data.jobAddForm })
  },

  //工单优先级单选框改变
  jobPriorityRadioChange(e) {
    // console.log(e)
    this.data.jobAddForm.priority = e.detail.value;
    this.setData({ jobAddForm: this.data.jobAddForm })
  },






  /**上传图片 */
  chooseImage: function () {
    let that = this;
    let photoList = that.data.photoList;
    wx.chooseImage({
      count: 9,   //最大选择图片数
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],    // 相册 和 照相机
      success: function (res) {
        let imgSrc = res.tempFilePaths[0];    //本地图片地址
        photoList.push(imgSrc);

        that.setData({
          photoList: photoList
        })

        wx.uploadFile({
          url: 'https://ai-sewage-weixin.club:8084/file/singleupload',   //后台服务
          filePath: imgSrc,   //图片原地址
          name: 'file',     //上传类型
          header: {
            'content-type': 'multipart/form-data',      //格式
            'Authorization': wx.getStorageSync('userJson').shiroToken
          },
          success(uploadRes) {
            var resJson = JSON.parse(uploadRes.data)
            let fileId = resJson["data"]    //服务端的照片id
            that.data.jobAddForm.fileList.push(fileId)   //存入文件列表，以备提交
            that.setData({
              jobAddForm: that.data.jobAddForm
            })
          },
          fail(err) {
            console.log("上传图片失败！！")
            console.log(err)
          },
        })


      },
    })

  },


  /**删除图片 */
  deleteImg: function (e) {
    let that = this;
    let deleteImg = e.currentTarget.dataset.img;    //获取要删除的图片
    let photoList = that.data.photoList;
    let newPics = [];
    for (let i = 0; i < photoList.length; i++) {
      //判断字符串是否相等
      if (photoList[i]["0"] !== deleteImg["0"]) {
        newPics.push(photoList[i])
      }
    }
    that.setData({
      photoList: newPics,    //重置照片列表
      isShow: true
    })

  },





  submitForm(event) {
    console.log(this.data.jobAddForm)
    console.log(this.data.sitesMap)
    var that = this;

    let form = JSON.parse(JSON.stringify(this.data.jobAddForm))
    // form.fileList = this.jobAddForm.fileList.concat(this.photoList) // 注意提交的是jobAddForm.fileList (注意concat方法不修改原数组，只返回新数组)
    form.fileList = this.data.jobAddForm.fileList    //需要上传的图片列表
    form.site = this.data.sitesMap[String(this.data.jobAddForm.siteID)]["name"]

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/add',
      method: "POST",
      dataType: 'json',
      data: form,
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        let result = response.data
        wx.showToast({
          title: result.msg,
          icon: 'success',
          duration: 2000,
          mask: true,
          success: function () {
            if (result.code == 1) {
              var pages = getCurrentPages();    //获取当前页面
              var beforePage = pages[pages.length - 2];   //获取上一个页面
              beforePage.showList();  //刷新上一个界面的列表
              wx.navigateBack({   //返回上一个页面
                delta: 1,
              })
            }
          }
        });
      },
      fail: function (error) {
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          duration: 2000,
          mask: true,
        })
        console.log(error)
      }
    })
  },



  //  tab切换逻辑
  swichNav: function (e) {
    var that = this;
    var jobTypeListJson = that.data.jobTypeListJson

    var index = 0   //记录当前类型的序号
    for (let key in jobTypeListJson) {  //找到点击的tab对应的序号，进行重置，实现点击切换swiper
      if (key == e.target.dataset.current) {
        that.data.currentTab["index"] = index;
        that.data.currentTab["value"] = key;
        that.setData({
          currentTab: that.data.currentTab
        })
      }
      index++
    }
  },

  swichLastNav: function (e) {
    var index = 0   //记录当前类型的序号
    for (let key in this.data.jobTypeListJson) {  //统计jobTypeListJson个数
      index++
    }
    this.data.currentTab["index"] = index;
    this.data.currentTab["value"] = '自定义问题类别';
    this.setData({
      currentTab: this.data.currentTab
    })
    console.log(this.data.currentTab)
  },

  //滑动swiper触发函数
  bindChange: function (e) {
    var that = this;
    var jobTypeListJson = that.data.jobTypeListJson

    var index = 0   //记录当前类型的序号
    that.data.currentTab["index"] = e.detail.current;
    for (let key in jobTypeListJson) {    //找到当前tab的值
      if (index == e.detail.current) {
        that.data.currentTab["value"] = key;
      }
      index++
    }
    that.setData({ currentTab: that.data.currentTab });
  },




  problemTypeRadioChange: function (e) {
    // console.log(e)
    this.data.jobAddForm.jobTypeName = e.detail.value
    this.setData({ jobAddForm: this.data.jobAddForm })
  },


  //modal“确定”按钮
  problemTypeFormConfirm: function (e) {
    this.setData({ problemTypeFormVisible: false })
  },

  //modal“取消”按钮
  problemTypeFormCancel: function (e) {
    this.setData({ problemTypeFormVisible: false })
  },

  //swiper中textarea输入改变触发
  bindSelfProblemType: function (e) {
    this.data.jobAddForm.jobTypeName = e.detail.value
    this.setData({ jobAddForm: this.data.jobAddForm })
  },



})


//判断数组中是否存在该字符串
function existInArray(array, str) {
  for (var i = 0; i < array.length; i++) {
    if (str == array[i])
      return true;
  }
  return false;
}