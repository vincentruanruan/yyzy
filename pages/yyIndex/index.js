//index.js
//获取应用实例
var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp()



Page({
  data: {
    pickerDateTimeArray: null, //时间选择数组
    pickerDateTime: null, //时间选择数据
    durationArray: ['1小时', '2小时', '3小时', '4小时', '5小时', '6小时'], //时长选择
    durationIndex: 0, //时长下标

    askRange: [
      ['不限', '男生', '女生'],
      ['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人']
    ],
    rewardRange: ['300元', '400元', '500元', '600元', '800元', '1000元', '1200元', '1500元', '2000元'], //打赏值
    rewardValue: [300, 400, 500, 600, 800, 1000, 1200, 1500, 2000], //打赏选择
    selectType: '', //约会类型
    selectTime: '', //时间
    selectRequire: '', //要求

    selectTypeTitle: '', //约会类型名字
    selectTimeParse: '', //开始时间戳
    selectLong: '', //时长
    selectLocation: '', //地点

    selectRequireGender: 0, //要求性别
    selectRequireNumber: 0, //要求人数

    selectlng: '',
    selectrng: '',

    selectReward: '', //打赏下标

    ordersn: ''
  },
  onShow: function() {
    //设置navbar
    wx.setNavigationBarTitle({
      title: '影缘之约'
    })
  },
  onLoad: function(e) {

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(2000, 2050);
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();
    this.setData({
      pickerDateTime: obj.dateTime,
      pickerDateTimeArray: obj.dateTimeArray,
      selectTypeTitle: e.selectTypeTitle
    });

    if (e =={} ) {
      this.setData({
        selectTypeTitle: e.selectTypeTitle
      });
    }
  },
  changeType: function() { //约会类型
    wx.navigateTo({
      url: 'selectAppointmentType',
    })
  },
  changeDate(e) { //时间改变
    this.setData({
      pickerDateTime: e.detail.value
    });
    var dtr = this.data.pickerDateTimeArray
    var dt = this.data.pickerDateTime
    var dtStr = dtr[0][dt[0]] + '-' + dtr[1][dt[1]] + '-' + dtr[2][dt[2]] + ' ' + dtr[3][dt[3]] + ':' + dtr[4][dt[4]]
    var selectDt = parseInt(new Date(dtStr).getTime() / 1000).toString()
    console.log(dtStr)
    console.log(Date.parse(selectDt))
    this.setData({
      selectTime: dtStr,
      selectTimeParse: selectDt
    });
  },
  changeDuration(e) { //时长改变
    this.setData({
      selectLong: Number(e.detail.value) + 1
    })
  },
  changeAsk: function(e) { //要求改变
    console.log(JSON.stringify(e))
    var gender = e.detail.value[0]
    var number = e.detail.value[1] + 1
    var str = this.data.askRange[0][gender] + '  ' + number + '人'
    this.setData({
      selectRequireGender: gender,
      selectRequireNumber: number,
      selectRequire: str
    })
  },
  changeLocation: function() { //地点改变
    if (this.data.selectTypeTitle == '') {
      wx.showToast({
        title: '请先选择约会类型',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: 'selectLocation?locStr=' + this.data.selectTypeTitle
    })
  },
  changeReward: function(e) { //打赏改变

    this.setData({
      selectReward: e.detail.value
    })
  },
  userBtnClick: function() { //用户中心
    wx.navigateTo({
      url: '../yyUser/user'
    })
  },
  acceptBtnClick: function() { //接单
    wx.redirectTo({
      url: 'join'
    })
  },
  postBtnClick: function() { //发单
    var that = this
    var dt = {
      ukey: wx.getStorageSync('ukey'),
      amount: this.data.rewardValue[this.data.selectReward],
      sex: this.data.selectRequireGender,
      s_time: this.data.selectTimeParse,
      limit_count: this.data.selectRequireNumber,
      tagstr: this.data.selectTypeTitle,
      timelong: this.data.selectLong,
      lng: this.data.selectlng,
      lat: this.data.selectrng,
      address: this.data.selectLocation
    }
    console.log(JSON.stringify(dt))

    // return
    if (dt.ukey.length > 0 && dt.tagstr && dt.s_time && dt.timelong && dt.lng && dt.lat && dt.limit_count > 0 && dt.sex >= 0 && dt.amount) {
      wx.showModal({
        title: '提示',
        content: '是否确定发单？',
        cancelText: '否',
        confirmText: '是',
        success: function(res) {
          if (res.confirm) {
            app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Publishevent', dt, function(res) {
              console.log(JSON.stringify(res))
              if (res.data.ret == '200') {
                console.log('发单单号： ' + JSON.stringify(res.data.data.ordersn))
                that.setData({
                  ordersn: res.data.data.ordersn
                })
                if (that.data.ordersn) {
                  wx.navigateTo({
                    url: 'checkstandPost?price=' + dt.amount * dt.limit_count + '&&ordersn=' + that.data.ordersn,
                  })
                }
              } else if (res.data.ret == 800) {
                app.globalFunction.loginErr()
              } else {
                wx.showToast({
                  title: res.data.msg || '发单失败',
                  icon: 'none'
                })
              }

            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请填写全部发单信息',
        icon: 'none'
      })
    }

  }

})