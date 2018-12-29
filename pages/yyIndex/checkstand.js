const app = getApp()

Page({
  data: {
    wxIcon: '/images/wx.png',
    price: '0.00'
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '收银台',
    })
  },
  onLoad: function(obj) {
    console.log(obj.price)
    this.setData({
      price: obj.price
    })
  },
  wxPay: function(e) {

    var type = e.currentTarget.dataset.paytype
    // console.log(JSON.stringify(type))
    // return
    wx.showLoading({
      title: '正在处理',
      mask: true
    })
    var that = this
    console.log({
      ukey: wx.getStorageSync('ukey'),
      pay_type: type,
      pay_amount: this.data.price
    })
    app.globalFunction.req(app.globalData.baseUrl + '?service=User.Recharge', {
      ukey: wx.getStorageSync('ukey'),
      pay_type: type,
      pay_amount: this.data.price
    }, function(res) {
      // console.log(JSON.stringify(res))
      var dt = res.data.data
      if (res.data.ret == 200) {
        console.log(JSON.stringify(dt))
        var timestamp = parseInt(new Date().getTime() / 1000).toString();
        wx.requestPayment({
          'timeStamp': timestamp,
          'nonceStr': dt.nonce_str,
          'package': 'prepay_id=' + dt.prepay_id,
          'signType': 'MD5',
          'paySign': dt.sign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
              mask: true
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 2
              })
            }, 1500)
          },
          'fail': function(res) {
            console.log(JSON.stringify(res))
            wx.showToast({
              title: '取消支付',
              icon: 'none'
            })
          }
        })
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      } else {
        wx.showToast({
          title: '充值失败',
          icon: 'none'
        })
      }
    })
  }
})