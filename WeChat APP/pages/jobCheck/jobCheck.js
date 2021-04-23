// pages/jobCheck/jobCheck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _title: "工单巡检",
    windowHeight: wx.getSystemInfoSync().windowHeight,

    addListShow: false,
    suggestion: [],
    suggestedJobs: [],   //供搜索筛查的所有工单
    suggestionTotal: 0,    //搜索建议总数
    curSuggestionPage: 1,   //搜索建议页码
    toSearchView: 'id0',  //搜索建议页当前所在位置

    uploadingPics: [],   //上传的图片
    isShow: true,

    currentUser: {
      username: '',
      delete_status: '', // 禁用状态
      identity: '', // 用户身份
      area: '', // 用户可查看的地区
      phone: '',
      mail: ''
    }, // 当期登录用户

    // 状态编码转换名称
    statusMapper: {
      '1': '待确认/分派',
      '2': '处理中',
      '3': '被转接',
      '4': '审核中',
      '5': '处理成功',
      '6': '处理中断',
      '7': '驳回'
    },

    selectJobType: [{   //选择工单类型
      "text": "我创建的工单",
      "num": 0
    }, {
      "text": "进行中的工单",
      "num": 0
    }, {
      "text": "审核中的工单",
      "num": 0
    }, {
      "text": "历史的工单",
      "num": 0
    }],

    beginTimeIndex: 0,
    beginTimeArray: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    endTimeIndex: 0,
    endTimeArray: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    seriousnessIndex: 0,
    seriousnessArray: ["一般", "严重", "非常严重"],
    priorityIndex: 0,
    priorityArray: ["一般", "紧急", "非常紧急"],

    pickerUsernameIndex: null,    //维护人序号
    selectUsername: [],    //选择维修人

    queryJobType: "processing", // 当前选中的工单类型

    page: 'list', // 当前显示页面(list：显示工单列表，detail：具体某条工单信息)

    // 按条件查询
    formSearch: {
      jobType: ''
    },

    // 工单进程
    processList: [],
    collapseOpened: ['3'], // 展开的面板
    jobDetail: {}, // 当前显示的工单
    createProcess: {}, // 创建进程
    resultProcessed: {}, // 处理结果（进程已完成的数据）
    resultInspected: {}, // 审核结果
    processForm: {}, // 进程确认/完成
    jobTypeList: [],
    jobTypeOptions: [],
    selectJobsIds: [], // 选中的工单

    // 上传图片
    dialogImageUrl: '',
    dialogVisible: false,
    photoList: [], // 拍照图片列表(数据库的图片id)

    // 分页配置&工单列表数据源
    currentPage: 1, // 当前页
    pageSize: 30, // 每页的数据
    totalNum: 0,
    jobList: [],
    tablelodingshadow: false, // 表格数据加载中
    jobTypeLoading: false, // 工单类型数据加载中（下拉框）

    // scrollTop: 0,    //滚动条距离顶部位置
    scrollDir: '',
    toView: 'id0',

    // 派单
    allocateFormVisible: false,
    allocateForm: {
      remark: '',
      username: ''
    },

    userListLoading: false, // 选择用户
    userList: [],


    showAutoJobModal: false,   //显示自动工单的modal

    // 自动派单设置
    drawer: false,
    jobConfigForm: {
      startTime: '',
      endTime: '',
      jobSwitch: true,
      priority: '',
      severity: ''
    }

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data._title
    })

    this.queryLoginUser()
    this.queryUserList()
    this.queryJobTypeList()
    this.showList()
  },

  onShow: function (options) {
    var app = getApp()
    console.log(app.globalData.userChange)
    if (app.globalData.userChange) {
      this.queryLoginUser()
      this.queryUserList()
      this.queryJobTypeList()
      this.showList()
    }
    app.globalData.userChange = false
  },

  onReady: function () {
    // this.sltJobType = this.selectComponent("#sltJobType")
    // this.sltJobType.initNowText('进行中的工单')
  },

  queryLoginUser() {
    var that = this;
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/user/curlogin',
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        // console.log('==============queryLoginUser中success回调：')
        // console.log(response)
        let result = response.data
        // eslint-disable-next-line eqeqeq
        if (result.code == 1) {
          // that.data.currentUser = result.data
          that.setData({ currentUser: result.data })
          // console.log(this.currentUser.identity)
          if (that.data.currentUser.identity === 'admin') {
            var curSelectArray = [{
              "text": "所有工单",
              "num": 0
            }, {
              "text": "未指派工单",
              "num": 0
            }, {
              "text": "未审核工单",
              "num": 0
            }]
            that.setData({ selectJobType: curSelectArray })

            that.sltJobType = that.selectComponent("#sltJobType")
            that.sltJobType.initNowText('所有工单')
            that.setData({
              queryJobType: 'all',    //设置 当前工单类型 为 下拉框的选择项
              currentPage: 1
            })
            that.showList();

            that.queryJobConfig()    //自动派单函数
          }
          else {
            var curSelectArray = [{
              "text": "我创建的工单",
              "num": 0
            }, {
              "text": "进行中的工单",
              "num": 0
            }, {
              "text": "审核中的工单",
              "num": 0
            }, {
              "text": "历史的工单",
              "num": 0
            }]
            that.setData({ selectJobType: curSelectArray })

            that.sltJobType = that.selectComponent("#sltJobType")
            that.sltJobType.initNowText('进行中的工单')
            that.setData({
              queryJobType: 'processing',    //设置 当前工单类型 为 下拉框的选择项
              currentPage: 1
            })
            that.showList();
          }
        } else {
          wx.showToast({
            title: '登录失效，请重新登录！',
            duration: 2000,
            mask: true
          })
          // that.$alert('登录失效，请重新登录', '提示', {
          //   callback: action => {
          //     location.href = '/'
          //   }
          // })
        }
      },
      fail: function (error) {
        // that.$alert('服务器异常，请稍后再试！', '提示')
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          duration: 2000,
          mask: true
        })
        console.log(error)
        that.setData({ currentUser: {} })
      }
    })
  },


  queryUserList() {
    var that = this;
    this.data.userListLoading = true
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/user/list',
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        console.log('==============queryUserList中success回调：')
        console.log(response)
        let result = response.data
        let list = result.data
        if (list == null) return
        that.setData({
          userList: list,
          userListLoading: false,
        })
      },
      fail: function (error) {
        // that.$alert('服务器异常，请稍后再试！', '提示')
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          duration: 2000,
          mask: true
        })
        console.log(error)
        that.setData({
          userList: null,
          userListLoading: false,
        })
      }
    })
  },

  queryJobTypeList() {
    var that = this;
    this.jobTypeLoading = true

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/type/queryall',
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        // console.log('==============queryJobTypeList中success回调：')
        // console.log(response)
        let result = response.data
        let list = result.data
        that.data.jobTypeList = list
        that.formatJobTypeOptions()
        that.data.jobTypeLoading = false
      },
      fail: function (error) {
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          duration: 2000,
          mask: true
        })
        console.log(error)
        that.data.jobTypeList = null
        that.data.jobTypeLoading = false
      }
    })
  },

  showList() {
    this.setData({
      page: 'list',
      jobDetail: {},
      selectJobsIds: []
    })
    this.queryJobsCount()
    // this.queryJobList()
  },


  queryJobList() {
    var that = this;
    if (that.data.queryJobType === null) {
      return
    }
    let keyword_val = null
    if (that.data.queryJobType === 'search') {
      keyword_val = that.data.formSearch.jobType[that.data.formSearch.jobType.length - 1]
      if (keyword_val === null) {
        return
      }
    }

    this.setData({
      tablelodingshadow: true
    })

    // console.log("totalNum：" + that.data.totalNum)
    // console.log('url的值为：' + 'https://ai-sewage-weixin.club:8084/job/query/' + that.data.queryJobType)
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/query/' + that.data.queryJobType,
      method: "POST",
      dataType: 'json',
      data: {
        pageIndex: that.data.currentPage,
        pageSize: that.data.pageSize,
        keyword: keyword_val
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        // console.log('==============queryJobList中success回调：')
        // console.log(response)
        let result = response.data
        let pageInfo = result.data
        for (var i = 0; i < pageInfo.list.length; i++) {
          pageInfo.list[i]['createTime'] = rTime(pageInfo.list[i]['createTime'])
          pageInfo.list[i]['updateTime'] = rTime(pageInfo.list[i]['updateTime'])
        }
        if (that.data.scrollDir === 'upper') {    //检测到 scroll 上划触顶
          that.setData({
            jobList: pageInfo.list,
            totalNum: pageInfo.total,
            tablelodingshadow: false,
            toView: 'id' + (that.data.pageSize - 5),   //定位到 第toView个 工单
            scrollDir: '',    //清空滑动标志
          })
        }
        else if (that.data.scrollDir === 'bottom') {    //检测到 scroll 下划触顶
          that.setData({
            jobList: pageInfo.list,
            totalNum: pageInfo.total,
            tablelodingshadow: false,
            toView: 'id2',
            scrollDir: '',
          })
        }
        else {   //loading初始位置
          that.setData({
            jobList: pageInfo.list,
            totalNum: pageInfo.total,
            tablelodingshadow: false,
            toView: 'id0',    //初始定位在第0个工单
            scrollDir: '',
          })
        }
        // console.log(that.data.jobList)
        // console.log(that.data.toView)
      },
      fail: function (error) {
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          duration: 2000,
          mask: true
        })
        console.log(error)
        that.setData({
          jobList: null,
          totalNum: 0,
          tablelodingshadow: false
        })
      }
    })


  },

  //触底函数，用于滚动分页再加载
  myOnReachBottom: function () {
    if (this.data.totalNum / this.data.pageSize <= this.data.currentPage)   //当前页达到最大页码
      return
    // console.log("myOnReachBottom向下滚动分页加载！！！")
    this.setData({
      currentPage: this.data.currentPage + 1,
      scrollDir: 'bottom',    //标志下划触底
    })
    this.queryJobList();  //重新加载
  },

  //触顶函数，用于滚动分页再加载
  myOnReachUpper: function () {
    if (this.data.currentPage == 1)   //当前页为第一页
      return
    // console.log("myOnReachUpper向上滚动分页加载！！！")
    this.setData({
      currentPage: this.data.currentPage - 1,
      scrollDir: 'upper',    //标志上划触顶
    })
    this.queryJobList();
  },


  queryJobsCount() {
    var that = this
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/query/count',
      method: "POST",
      dataType: 'json',
      data: {
        type: that.data.queryJobType
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        // console.log(response)
        let result = response.data
        if (result.code === 1) {
          that.data.totalNum = result.data
          that.setData({ totalNum: that.data.totalNum })
        } else {
          that.data.totalNum = 0
          that.setData({ totalNum: that.data.totalNum })
        }
        // console.log("totalNum："+that.data.totalNum)
        that.queryJobList()     //查询工单列表：取到当前类别的工单数后再查询，以便显示完全，否则后台默认20条数据
      },
      fail: function (error) {
        // this.$alert('服务器异常，请稍后再试！', '提示')

        console.log(error)
        that.data.totalNum = 0
      }
    })
  },

  //显示工单详情
  showDetail(event) {
    // console.log(event.currentTarget.dataset.job
    console.log("detail")
    // 工单进程初始化
    this.setData({
      processList: [],
      jobDetail: {}, // 当前显示的工单详情
      createProcess: {}, // 创建进程
      resultProcessed: {}, // 处理结果（进程已完成的数据）
      resultInspected: {}, // 审核结果
      processForm: {}, // 进程确认/完成
      photoList: [],
      addListShow: false
    })

    let jobId = event.currentTarget.dataset.job['id']
    this.setData({ collapseOpened: ['3'] }) // 展开的面板默认只打开第三个
    this.queryJobProcessList(jobId) // 查询进程列表
    this.updateJobDetail(jobId) // 更新当前的工单详情
    this.setData({ page: 'detail' }) // 显示详情页
  },


  //查询工单进程列表
  queryJobProcessList(jobId) {
    var that = this;
    this.setData({
      tablelodingshadow: true,
      processList: [],
      createProcess: {}, // 创建进程
      resultProcessed: {}, // 处理结果（进程已完成的数据）
      resultInspected: {}, // 审核结果
    })

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/jobprocess/query/list/' + jobId,
      method: "POST",
      dataType: 'json',
      header: {
        // 'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        let result = response.data
        // console.log("进程：")
        // console.log(result.data)
        that.setData({ processList: result.data })
        // 更新当前具体进程
        for (let i = 0, len = that.data.processList.length; i < len; i++) {
          if (that.data.processList[i].file !== undefined && that.data.processList[i].file !== '') {
            that.data.processList[i].file = JSON.parse(that.data.processList[i].file) // 将文件id列表转化为json，不然就字符串
            that.setData({ processList: that.data.processList })
          }
          if (that.data.processList[i].type == '4') {
            that.setData({ resultProcessed: that.data.processList[i] }) // 完成进程
            console.log("resultProcessed：")
            console.log(that.data.resultProcessed)
          } else if (that.data.processList[i].type == '5' || that.data.processList[i].type == '6') {
            that.setData({ resultInspected: that.data.processList[i] }) // 审核进程
          } else if (that.data.processList[i].type == '1') {
            that.setData({ createProcess: that.data.processList[i] }) // 创建程
          }
        }
        that.setData({ tablelodingshadow: false })
      },
      fail: function (error) {
        // this.$alert('服务器异常，请稍后再试！', '提示')
        console.log(error)
        that.setData({
          processList: null,
          tablelodingshadow: false
        })
      }
    })
  },



  // 查询工单详情
  updateJobDetail(jobId) {
    var that = this;
    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/query/one',
      method: "POST",
      dataType: 'json',
      data: {
        'jobId': jobId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        let result = response.data
        let code = result.code
        let msg = result.msg
        that.setData({
          jobDetail: {}
        })
        if (code <= 0)
          wx.showToast({
            title: msg,
            duration: 2000,
            mask: true
          })
        else {
          that.data.allocateForm.username = that.data.jobDetail.processor
          that.setData({
            jobDetail: result.data,
            allocateForm: that.data.allocateForm
          })
          // console.log("查询工单详情成功：")
          // console.log(result.data)
        }
      },
      fail: function (error) {
        // this.$alert('服务器异常，请稍后再试！', '提示')
        console.log(error)
        that.setData({ jobDetail: {} })
      }
    })
  },


  //派单
  allocateJob() {
    this.data.allocateForm.username = this.data.jobDetail.processor
    this.setData({
      allocateFormVisible: true,
      allocateForm: this.data.allocateForm,
      selectUsername: this.data.userList    //设置维修人
    })
    // console.log("派单，userList和selectUsername：")
    // console.log(this.data.userList)
    // console.log(this.data.selectUsername)
  },

  //派单modal确定
  allocateFormConfirm: function () {
    if (this.data.pickerUsernameIndex == null) {    //没有选择维修人
      wx.showToast({
        title: '请选择维修人！',
        duration: 1000,
        mask: true,
      })
      return
    }

    var that = this;
    let allocateJobsIds = []
    if (this.data.jobDetail.id != null) {
      allocateJobsIds = [this.data.jobDetail.id]
    } else {
      allocateJobsIds = this.data.selectJobsIds
    }

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/allocate',
      method: "POST",
      dataType: 'json',
      data: {
        jobsIds: allocateJobsIds,
        username: that.data.allocateForm.username,
        remark: that.data.allocateForm.remark
      },
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        // console.log("派单modal确定返回response：")
        // console.log(response)
        let result = response.data
        that.setData({
          allocateFormVisible: false,    //隐藏派单modal
          allocateForm: {},
          pickerUsernameIndex: null
        })
        wx.showToast({
          title: result.msg,
          duration: 2000,
          mask: true,
          success: function () {
            that.showList()
          }
        })
      },
      fail: function (error) {
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          duration: 2000,
          mask: true,
        })
        console.log(error)
        that.setData({
          allocateFormVisible: false,
          allocateForm: {}
        })
      }
    })



  },

  //派单modal取消
  allocateFormCancel: function (e) {
    this.setData({ allocateFormVisible: false })
  },



  // 完成工单当前进程
  submitForm(event) {
    var that = this;

    // if(this.data.photoList!==[]){
    //   console.log("submitForm中判断photoList不为空")
    //   this.uploadImg(this.data.photoList)     //上传图片
    // }

    var type = event.currentTarget.dataset.para;

    const processUrlMapping = {
      '2': 'grab', // 不存在了，接单功能去除，换成派单
      '4': 'done',
      '5': 'inspect',
      '6': 'inspect',
      '7': 'reject'
    }
    let form = JSON.parse(JSON.stringify(this.data.processForm))
    form.jobId = this.data.jobDetail.id
    form.type = type
    if (this.data.processForm.fileList === undefined) {
      this.data.processForm.fileList = []
      this.setData({ processForm: this.data.processForm })
    }
    // form.fileList = this.data.processForm.fileList.concat(this.data.photoList) // 注意提交的是processForm.fileList (注意concat方法不修改原数组，只返回新数组)
    form.fileList = this.data.processForm.fileList    //需要上传的图片列表

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/' + processUrlMapping[type],
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
            that.queryJobProcessList(that.data.jobDetail.id) // 更新进程列表
            that.updateJobDetail(that.data.jobDetail.id) // 更新当前的工单详情
            that.setData({
              processForm: {},
              photoList: []
            })
          }
        });
      },
      fail: function (error) {
        // this.$alert('服务器异常，请稍后再试！', '提示')
        console.log("确认完成错误！！")
        console.log(error)
      }
    })
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
            if (that.data.processForm.fileList === undefined || that.data.processForm.fileList === '') {
              that.data.processForm.fileList = []
            }
            that.data.processForm.fileList.push(fileId)   //存入文件列表，以备提交
            that.setData({
              processForm: that.data.processForm
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

  // uploadImg: function (photoList) {
  //   var that = this;
  //   for (var i = 0; i < photoList.length; i++) {
  //     wx.uploadFile({
  //       url: 'http://localhost:8082/file/singleupload',
  //       filePath: photoList[i],
  //       name: 'file',
  //       header: {
  //         'content-type': 'multipart/form-data',
  //         'Authorization': wx.getStorageSync('userJson').shiroToken
  //       },
  //       success(uploadRes) {
  //         // console.log("上传图片成功!!!!")
  //         console.log("上传图片成功，uploadRes：")
  //         console.log(uploadRes.data)
  //         var resJson = JSON.parse(uploadRes.data)
  //         let fileId = resJson["data"]
  //         console.log("fileId：")
  //         console.log(fileId)
  //         if (that.data.processForm.fileList === undefined || that.data.processForm.fileList === '') {
  //           that.data.processForm.fileList = []
  //         }
  //         that.data.processForm.fileList.push(fileId)
  //         that.setData({
  //           processForm: that.data.processForm
  //         })
  //         console.log("上传图片成功的processForm: ")
  //         console.log(that.data.processForm)
  //       },
  //       fail(err) {
  //         console.log("上传图片失败！！")
  //         console.log(err)
  //       },
  //     })
  //   }
  // },

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



  //跳转到“创建工单”
  bindCreateJob() {
    wx.navigateTo({
      url: '/pages/jobCreate/jobCreate',
    })
  },


  //点击自动工单图标
  clickAutoJobIcon() {
    this.setData({ showAutoJobModal: true })
    this.queryJobConfig()
  },

  //点击自动派单设置中的清除按钮
  clickClear() {
    this.data.jobConfigForm.endTime='';
    this.data.jobConfigForm.startTime=''
    this.setData({jobConfigForm:this.data.jobConfigForm})
  },

  //自动工单modal取消
  autoJobModalCancel() {
    this.setData({ showAutoJobModal: false })
  },

  //点击开始时间输入框
  bindBeginTimePickerChange: function (e) {
    this.data.jobConfigForm.startTime = this.data.beginTimeArray[e.detail.value]
    this.setData({
      jobConfigForm: this.data.jobConfigForm
    })
  },

  //点击结束时间输入框
  bindEndTimePickerChange: function (e) {
    this.data.jobConfigForm.endTime = this.data.endTimeArray[e.detail.value]
    this.setData({
      jobConfigForm: this.data.jobConfigForm
    })
  },

  //默认严重程度picker改变
  bindSeriousnessPickerChange: function (e) {
    this.setData({
      seriousnessIndex: e.detail.value
    })
  },

  //默认优先级picker改变
  bindPriorityPickerChange: function (e) {
    this.setData({
      priorityIndex: e.detail.value
    })
  },






  // 通用请求方法
  httpRequest: function (url, params, form, callback, showloading = false) {
    const loading = showloading ? wx.showLoading({
      title: '加载中',
      mask: true
    }) : null

    wx.request({
      url: url,
      method: "POST",
      dataType: 'json',
      params: params,
      data: form,
      header: {
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        console.log(url + "返回的数据：")
        console.log(response)
        let result = response.data
        let code = result.code
        let msg = result.msg
        let data = result.data
        if (code <= -1) {
          wx.showLoading({
            title: msg,
            mask: true
          })
          // this.$alert(msg, '提示')
        } else {
          callback(code, msg, data)
        }
        if (showloading) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          wx.hideLoading();
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '服务器异常！',
          duration: 2000,
          mask: true,
        })
        console.log(error)
        if (showloading) {
          wx.hideLoading();
        }
      }
    })
  },
  // 查询已设置的自动派单开关时间
  queryJobConfig() {
    console.log("queryJobConfig!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    var that = this;
    let url = 'https://ai-sewage-weixin.club:8084/job/conf/query'
    let form = ['ontime', 'offtime', 'jobSwitch', 'priority', 'severity']
    let callback = function (code, msg, data) {
      if (code > 0) {
        that.data.jobConfigForm.startTime = data.ontime
        that.data.jobConfigForm.endTime = data.offtime
        that.data.jobConfigForm.priority = data.priority
        that.data.jobConfigForm.severity = data.severity
        that.data.jobConfigForm.jobSwitch = (data.jobSwitch === 'true')
      } else if (code === 0) {
        that.data.jobConfigForm.startTime = ''
        that.data.jobConfigForm.endTime = ''
        that.data.jobConfigForm.priority = null
        that.data.jobConfigForm.severity = null
        that.data.jobConfigForm.jobSwitch = false
      } else {
        wx.showToast({
          title: '警告！',
          duration: 2000,
          mask: true,
        })
      }
      that.setData({ jobConfigForm: that.data.jobConfigForm })
    }.bind(this)
    this.httpRequest(url, null, form, callback)
  },
  // 修改自动派单配置
  setJobSchedule() {
    var that = this
    let url = 'https://ai-sewage-weixin.club:8084/job/conf/update'
    let form = {
      ontime: this.data.jobConfigForm.startTime,
      offtime: this.data.jobConfigForm.endTime,
      priority: this.data.jobConfigForm.priority,
      severity: this.data.jobConfigForm.severity
    }
    let callback = function (code, msg, data) {
      if (code > 0) {
        that.data.drawer = false
      }
      // that.data.jobConfigForm.jobSwitch = !that.data.jobConfigForm.jobSwitch
      // that.setData({ jobConfigForm: that.data.jobConfigForm })
      wx.showToast({
        title: msg,
        duration: 2000,
        mask: true,
      })
    }.bind(this)
    this.httpRequest(url, null, form, callback)

  },
  // 开启/关闭自动派单开关
  setJobJobSwitch() {
    console.log("this.data.jobConfigForm.jobSwitch:")
    console.log(this.data.jobConfigForm.jobSwitch)
    var that = this;
    wx.showModal({
      title: '警告',
      content: '确认' + (that.data.jobConfigForm.jobSwitch ? '关闭' : '开启') + '自动派单？（如需人工控制，请清除自动派单时间段）',
      showCancel: true,//是否显示取消按钮
      cancelColor: 'skyblue',//取消文字的颜色
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          let url = 'https://ai-sewage-weixin.club:8084/job/conf/update'
          let form = {
            jobSwitch: (!that.data.jobConfigForm.jobSwitch).toString()
          }
          let callback = function (code, msg, data) {
            if (code > 0) {
              that.data.jobConfigForm.jobSwitch = !that.data.jobConfigForm.jobSwitch
              // that.data.jobConfigForm.jobSwitch = (form.jobSwitch === 'true') // 因为返回的是字符串
            } else {
              // that.data.jobConfigForm.jobSwitch = !that.data.jobConfigForm.jobSwitch
            }
            that.setData({ jobConfigForm: that.data.jobConfigForm })
            wx.showToast({
              title: msg,
              duration: 2000,
              mask: true,
            })
          }.bind(that)
          console.log("form:")
          console.log(form)
          that.httpRequest(url, null, form, callback)
        }
        else {
          wx.showToast({
            title: '已取消！',
            duration: 2000,
            mask: true,
          })
        }
      },
      fail: function (res) {  //接口调用失败的回调函数
        // console.log('modal中的fail函数！！')
        wx.showToast({
          title: '已取消修改！',
          duration: 2000,
          mask: true,
        })
      },
    })


    // this.$confirm('确认' + (!this.jobConfigForm.jobSwitch ? '关闭' : '开启') + '自动派单？（如需人工控制，请清除自动派单时间段）', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // }).then(() => {
    //   let url = 'http://43.228.77.195:8082/job/conf/update'
    //   let form = {
    //     jobSwitch: this.jobConfigForm.jobSwitch.toString()
    //   }
    //   let callback = function (code, msg, data) {
    //     if (code > 0) {
    //       this.jobConfigForm.jobSwitch = (form.jobSwitch === 'true') // 因为返回的是字符串
    //     } else {
    //       this.jobConfigForm.jobSwitch = !this.jobConfigForm.jobSwitch
    //     }
    //     this.$message({
    //       type: 'success',
    //       message: msg
    //     })
    //   }.bind(this)
    //   this.httpRequest(url, null, form, callback)
    // }).catch(() => {
    //   this.jobConfigForm.jobSwitch = !this.jobConfigForm.jobSwitch
    //   this.$message({
    //     type: 'info',
    //     message: '已取消'
    //   })
    // })
  },















  //绑定“结果说明”的textarea输入
  bindResult(e) {
    // console.log("bindResult中的e：")
    // console.log(e)
    this.data.processForm.content = e.detail.value
    this.setData({ processForm: this.data.processForm })
    // console.log(this.data.processForm)
  },


  //工单详情页点击“返回”按钮
  tapBack() {
    console.log("back")
    this.setData({
      page: 'list',
      addListShow: false
    })
    this.sltJobType = this.selectComponent("#sltJobType")
    if (this.data.queryJobType == "all") {
      this.sltJobType.initNowText('所有工单')
    }
    else if (this.data.queryJobType == "waiting") {
      this.sltJobType.initNowText('未指派工单')
    }
    else if (this.data.queryJobType == "waitingspect") {
      this.sltJobType.initNowText('未审核工单')
    }
    else if (this.data.queryJobType == "create") {
      this.sltJobType.initNowText('我创建的工单')
    }
    else if (this.data.queryJobType == "processing") {
      this.sltJobType.initNowText('进行中的工单')
    }
    else if (this.data.queryJobType == "processed") {
      this.sltJobType.initNowText('审核中的工单')
    }
    else if (this.data.queryJobType == "finished") {
      this.sltJobType.initNowText('历史的工单')
    }
  },







  formatJobTypeOptions() {
    var that = this;
    for (var key in that.jobTypeList) {
      var json = {}
      json.value = key
      json.label = key
      // eslint-disable-next-line no-array-constructor
      var childArray = new Array()
      for (var j = 0, len = that.jobTypeList[key].length; j < len; j++) {
        var secJson = that.jobTypeList[key][j]
        var json = {}
        json.value = secJson.jobTypeName
        json.label = secJson.jobTypeName
        childArray.push(json)
      }
      json.children = childArray
      that.data.jobTypeOptions.push(json)
    }
  },





  //工单类型下拉框选择触发
  selectTap(event) {
    var jobType = null;
    if (event.detail['text'] === '我创建的工单')
      jobType = 'create'
    else if (event.detail['text'] === '进行中的工单')
      jobType = 'processing'
    else if (event.detail['text'] === '审核中的工单')
      jobType = 'processed'
    else if (event.detail['text'] === '历史的工单')
      jobType = 'finished'
    else if (event.detail['text'] === '所有工单')
      jobType = 'all'
    else if (event.detail['text'] === '未指派工单')
      jobType = 'waiting'
    else if (event.detail['text'] === '未审核工单')
      jobType = 'waitingspect'

    this.setData({
      queryJobType: jobType,    //设置 当前工单类型 为 下拉框的选择项
      currentPage: 1
    })
    this.showList()
  },



  //选择维护人下拉框选择触发
  selectUsername(event) {
    this.data.allocateForm.username = event.detail['text']
    this.setData({
      allocateForm: this.data.allocateForm
    })
  },

  //绑定 派单-备注 的输入
  bindAllocateRemark(e) {
    this.data.allocateForm.remark = e.detail.value
    this.setData({ allocateForm: this.data.allocateForm })
  },

  //picker维护人改变
  bindPickerUsernameChange(e) {
    this.data.allocateForm.username = this.data.selectUsername[e.detail.value]    //重置维护人名字
    this.setData({
      pickerUsernameIndex: e.detail.value,    //重置维护人序号，作显示用
      allocateForm: this.data.allocateForm
    });
  },

  showAddList: function () {
    this.setData({
      addListShow: true,
      suggestion: [],
      suggestedJobs: [],
      suggestionTotal: 0,
      curSuggestionPage: 1,
      toSearchView: 'id0',
    })
    // console.log(this.data.suggestion)
  },


  //获取搜索建议
  getsuggest: function (e) {
    var that = this;
    var keyword = e.detail.value;

    wx.request({
      url: 'https://ai-sewage-weixin.club:8084/job/query/search',
      method: "POST",
      dataType: 'json',
      data: {
        pageIndex: 1,
        pageSize: that.data.totalNum,   //先查出所有的工单，以供前端 筛查符合搜索条件的工单
        keyword: keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('userJson').shiroToken
      },
      success: function (response) {
        console.log('==============queryJobList中success回调：')
        console.log(response)
        let result = response.data
        let pageInfo = result.data
        for (var i = 0; i < pageInfo.list.length; i++) {
          pageInfo.list[i]['createTime'] = rTime(pageInfo.list[i]['createTime'])
          pageInfo.list[i]['updateTime'] = rTime(pageInfo.list[i]['updateTime'])
        }
        that.setData({
          suggestedJobs: pageInfo.list,
          suggestionTotal: pageInfo.total,
        })
        var _suggestion = that.data.suggestedJobs;
        _suggestion.sort(function (a, b) {   //为搜索结果排序
          if (a.jobTypeName.indexOf(keyword) > b.jobTypeName.indexOf(keyword))
            return -1
          if (a.jobTypeName.indexOf(keyword) < b.jobTypeName.indexOf(keyword))
            return 1
          return 0
        })
        that.setData({
          addListShow: true,
          suggestion: _suggestion.slice(0, that.data.pageSize)
        })
      },
      fail: function (error) {
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          duration: 2000,
          mask: true
        })
        console.log(error)
        that.setData({
          suggestedJobs: [],
        })
      }
    })

  },

  //触底函数，用于滚动分页再加载
  mySearchOnReachBottom: function () {
    if (this.data.suggestionTotal / this.data.pageSize <= this.data.curSuggestionPage + 1)
      return
    var curSuggestionPage = this.data.curSuggestionPage   //当前建议页
    var pageSize = this.data.pageSize   //页尺寸
    this.setData({
      suggestion: this.data.suggestedJobs.slice(curSuggestionPage * pageSize, (curSuggestionPage + 1) * pageSize),
      curSuggestionPage: this.data.curSuggestionPage + 1,
      toSearchView: 'id2'
    })
  },

  //触顶函数，用于滚动分页再加载
  mySearchOnReachUpper: function () {
    if (this.data.curSuggestionPage == 1)
      return
    var curSuggestionPage = this.data.curSuggestionPage   //当前建议页
    var pageSize = this.data.pageSize   //页尺寸
    this.setData({
      suggestion: this.data.suggestedJobs.slice((curSuggestionPage - 2) * pageSize, (curSuggestionPage - 1) * pageSize),
      curSuggestionPage: this.data.curSuggestionPage - 1,
      toSearchView: 'id' + (this.data.pageSize - 7)
    })
  },




})



//格式化时间函数

function rTime(date) {
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

  var time = Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s

  // console.log(time)
  // var json_date = new Date(date).toJSON();
  // console.log(new Date(json_date))
  // return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  return time
}

