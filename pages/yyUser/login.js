//获取应用实例
const app = getApp()

getNowLocation()

Page({
  data: { //数据

    // userPhone: '18912340007',
    // userPassword: '123456'
    userPhone: '',
    userPassword: ''
  },
  loginClick: function() { //登录按钮
    var that = this
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    app.globalFunction.req(app.globalData.baseUrl + '?service=Applet.Login', {
      mobile: this.data.userPhone,
      password: this.data.userPassword
    }, function(res) {
      console.log(JSON.stringify(res))
      var msg = ''
      var icon = 'none'
      if (res.data.ret == '200') {
        msg = '登录成功'
        icon = 'success'
        //设置ukey
        // app.globalData.ukey = res.data.data.ukey


        wx.setStorageSync('ukey', res.data.data.ukey)
        wx.setStorageSync('gender', res.data.data.sex)
        getNowLocation()
        that.go()

      } else {
        msg = res.data.msg || '登录失败'
      }
      wx.showToast({
        title: msg,
        icon: icon
      })
    })
  },
  clearUserPhone: function() { //清除手机号
    this.setData({
      userPhone: ''
    });
  },
  bindUserPhone: function(e) { //监听手机号
    this.setData({
      userPhone: e.detail.value
    });
    // console.log(e.detail.value)
  },
  clearUserPassword: function() { //清楚密码
    this.setData({
      userPassword: ''
    });
  },
  bindUserPassword: function(e) { //监听密码
    this.setData({
      userPassword: e.detail.value
    });
    // console.log(e.detail.value)
  },
  jumpForget: function() { //忘记密码跳转
    wx.navigateTo({
      url: 'forget',
    })
  },
  jumpRegister: function() { //注册跳转
    wx.navigateTo({
      url: 'register',
    })
  },
  onShow: function() {
    //设置navbar
    wx.setNavigationBarTitle({
      title: '影缘之约 登录'
    })
  },
  onLoad: function() {
    if (wx.getStorageSync('ukey')) {
      console.log('login')
      this.go()

    } else {
      console.log('没有登录')
    }
  },
  go: function() {
    var str = 'index'
    if (wx.getStorageSync('gender') == 2) {
      str = 'join'
    }
    wx.reLaunch({
      url: '../yyIndex/' + str
    })
  }
})

function getNowLocation(){

  wx.getLocation({ //获取定位
    type: 'wgs84',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy

      app.globalData.locaton = res
      console.log('用户定位：' + JSON.stringify(app.globalData.locaton))
      var ukey = wx.getStorageSync('ukey')
      if(ukey!=''){
        app.globalFunction.req(app.globalData.baseUrl + '?service=Applet.Orientation', {
          ukey:ukey,
          lng: res.longitude,
          lat:res.latitude
        }, function (resL) {
          console.log(JSON.stringify(resL))
         
          if (resL.data.ret == '200') {
              console.log('用户更新定位到服务器成功')
          } else if (resL.data.ret == 800) {
            app.globalFunction.loginErr()
          } else {
            wx.showToast({
              title: resL.data.msg || '更新定位失败',
              icon: icon
            })
          }
          
        })
      }




    },
    fail: function () {
      wx.showToast({
        title: '获取定位失败',
        icon: 'none'
      })
    }
  })

}