const app = getApp()

Page({
  data: {
    userIcon: '/images/user.png',
    userIconUrl: '',
    userName: '',
    exist_parent:'0',
    invitation_code:''
  },

  onShow: function() {
    wx.setNavigationBarTitle({
      title: '用户中心',
    })
  },
  onLoad: function() {
    var that = this
    app.globalFunction.req(app.globalData.baseUrl + '?service=User.Getmy', {
      ukey: wx.getStorageSync('ukey')
    }, function(res) {
      console.log(JSON.stringify(res))
      if (res.data.ret == 200) {
        that.setData({
          userName: res.data.data.info.nickname,
          userIconUrl: res.data.data.info.headimg,
          exist_parent: res.data.data.info.exist_parent,
          invitation_code: res.data.data.info.invitation_code
        })
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }

    })

  },
  openOrder: function() {
    wx.navigateTo({
      url: 'order',
    })
  },
  openWallet: function() {
    wx.navigateTo({
      url: 'wallet',
    })
  },
  openShare: function() {
    wx.navigateTo({
      url: 'share?code=' + this.data.invitation_code,
    })
  },
  openAbout: function() {
    wx.navigateTo({
      url: 'about',
    })
  },
  logout: function() {

    wx.showModal({
      title: '提示',
      content: '是否退出登录？',
      confirmText: "是",
      cancelText: "否",
      success: function(res) {
        console.log(JSON.stringify(res))
        if (res.confirm) {
          app.globalFunction.logout()
        }
      }
    })
  }
})