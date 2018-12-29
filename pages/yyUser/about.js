const app = getApp()

Page({
  data: {
    text:''
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '关于我们',
    })
  },
  onLoad: function () {
    var that = this
    app.globalFunction.req(app.globalData.baseUrl + '?service=Applet.Getabout', {
      ukey: wx.getStorageSync('ukey')
    }, function (res) {
      console.log(JSON.stringify(res))
      if (res.data.ret == '200') {
        that.setData({
          text: res.data.data[0].content
        })
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }
    })
  }

})