const app = getApp()

Page({
  data: {
    wxImg: '/images/wx.png',
    yesterday: '0.00',//昨天收益（元）
    week: '0.00',//本周收益（元）
    total: '0.00',//总余额（元）
    withdraw: '0.00',//可提现余额（元）
  },

  onShow: function() {
    wx.setNavigationBarTitle({
      title: '我的钱包',
    })
    this.onLoad()
  },
  onLoad: function() {
    var that = this
    app.globalFunction.req(app.globalData.baseUrl + '?service=User.Mywallet', {
      ukey: wx.getStorageSync('ukey')
    }, function(res) {
      console.log(JSON.stringify(res))
      var dt = res.data.data
      if (res.data.ret == 200) {
        that.setData({
          yesterday: dt.yesterday,
          week: dt.week,
          total: dt.total,
          withdraw: dt.withdraw,
        })
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }
    })
  },
  tixian:function(){
    wx.showModal({
      title: '提示',
      content: '请前往 影缘之约 APP进行体现',
      showCancel: false
    });
  },
  chongzhi:function(){
    wx.navigateTo({
      url: '../yyIndex/pay?total=' + this.data.total
    })
  }
})