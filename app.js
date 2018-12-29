//设置navbar
wx.setNavigationBarTitle({
  title: '影缘之约'
})
//app.js
App({
  onLaunch: function() {
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
  },
  globalData: { //全局变量
    userInfo: null, //微信用户信息
    gender: 0,
    baseUrl: "http://app.yun-nao.com/api/", //接口域名
    locaton: { //用户经纬
    }
  },
  globalFunction: { //全局函数
    req: function(url, data, success, fail, complete) { //网络接口封装
      wx.request({
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        url: url,
        data: data,
        success: success,
        fail: fail,
        complete: complete
      })
    },
    logout: function(url) { //注销
      try {
        wx.clearStorageSync()
      } catch (e) {
        // Do something when catch error
      }
      wx.reLaunch({
        url: '../yyUser/login'
      })
    },
    loginErr: function() {//ukey错误
      wx.showToast({
        title: '您的账号已在其他客户端登录',
        icon: 'none',
        mask: true
      })

      setTimeout(function() {
        try {
          wx.clearStorageSync()
        } catch (e) {
          // Do something when catch error
        }
        wx.reLaunch({
          url: '../yyUser/login'
        })
      }, 1500)

    }
  }
})