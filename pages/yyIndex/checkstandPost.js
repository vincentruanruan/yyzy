const app = getApp()

Page({
  data: {
    price: 0,
    ordersn: '',
    backPage:0
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '收银台',
    })

  },
  onLoad: function(obj) {
    this.setData({
      price: obj.price,
      ordersn: obj.ordersn,
      backPage: obj.backPage
    })
  },
  wxPay: function(e) { //微信支付
    var that = this
    wx.showLoading({
      title: '正在处理',
      mask: true
    })
    app.globalFunction.req(app.globalData.baseUrl + '?service=Pay.Wxpay', {
      ukey: wx.getStorageSync('ukey'),
      ordersn: that.data.ordersn
    }, function(res) {
      console.log(JSON.stringify(res))
      var dt = res.data.data
      if (res.data.ret == 200) {
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
              that.back()
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
          title: '支付失败',
          icon: 'none'
        })
      }
    })

  },
  yuePay: function() { //余额支付
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否余额支付？',
      cancelText: '否',
      confirmText: '是',
      success: function(res) {
        wx.showLoading({
          title: '正在支付',
        })
        app.globalFunction.req(app.globalData.baseUrl + '?service=Applet.Balance', {
          ukey: wx.getStorageSync('ukey'),
          ordersn: that.data.ordersn
        }, function(res) {
          console.log(JSON.stringify(res))
          var dt = res.data.data
          if (res.data.ret == 200 && res.data.msg!='nomoney') {
            wx.showToast({
              title: '支付成功',
              mask: true
            })
            setTimeout(function() {
              that.back()
            }, 1500)
          } else if (res.data.msg == 'nomoney'){
            wx.showToast({
              title: '账户没有足够金额',
              icon: 'none'
            })
          } else if (res.data.ret == 400) {
            app.globalFunction.loginErr()
          } else {
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
      }
    })


  },
  back: function() {
    if (this.data.backPage){
      wx.navigateBack({
        delta: this.data.backPage
      })
      return
    }
    var str = 'index'
    if (wx.getStorage('gender') == 2) {
      str = 'join'
    }
    wx.reLaunch({
      url: '../yyIndex/' + str
    })
  }
})