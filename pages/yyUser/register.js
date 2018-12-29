//获取应用实例
const app = getApp()

Page({
  data: {

    userPhone: '',
    userPassword: '',
    userRepassword: '',
    isEqualPwd: 'true',
    userVerify: '',
    getVerifyCode: '获取验证码',
    isVerify: true,
    gender:1
  },
  login: function() { //登录按钮

  },
  clearUserPhone: function() { //清除手机号
    this.setData({
      userPhone: ''
    });
  },
  bindUserPhone: function (e) {//监听手机号
    this.setData({
      userPhone: e.detail.value
    });
  },
  bindUserVerify: function(e) { //监听验证码改变
    this.setData({
      userVerify: e.detail.value
    });
  },
  getCode: function() { //获取验证码
    this.setData({
      userVerify: ''
    });
    var time = 60
    var that = this
    var el = setInterval(function() {
      that.setData({
        getVerifyCode: '' + time,
        isVerify: false
      });
      time--
      if (time < 0) {
        that.setData({
          getVerifyCode: '获取验证码',
          isVerify: true
        });
        clearInterval(el)
      }
    }, 1000)

    app.globalFunction.req(app.globalData.baseUrl + '?service=User.Verifysms', {
      mobile: this.data.userPhone,
      type: 'verify'
    }, function(res) {
      console.log(JSON.stringify(res))
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    })

  },
  registerClick: function() {
    console.log('register')
    wx.showLoading({
      title: '正在注册',
      mask: true
    })

    app.globalFunction.req(app.globalData.baseUrl + '?service=User.Register', {
      mobile: this.data.userPhone,
      password: this.data.userPassword,
      code: this.data.userVerify,
      sex:this.data.gender
    }, function(res) {
      console.log(res)
      var msg = ''
      var icon = 'none'
      if(res.data.ret == '200'){
        msg = '注册成功'
        icon = 'success'
        setTimeout(function(){
          wx.navigateBack() 
        },1500)
      } else{
          msg = res.data.msg || '注册失败'
      }

      wx.showToast({
        title: msg,
        icon: icon
      })

    }, function() {

    })

  },
  bindGetVerifyCode: function(e) { //监听验证码按钮
    this.setData({
      getVerifyCode: e.detail.value,
    });
    // console.log(e.detail.value)
  },
  clearUserPassword: function() { //清除密码
    this.setData({
      userPassword: ''
    });
  },
  bindUserPassword: function(e) { //监听密码改变
    this.setData({
      userPassword: e.detail.value
    });
    this.checkPwd()
    // console.log(e.detail.value)
  },
  clearRepassword: function() { //清除二次密码
    this.setData({
      userRepassword: ''
    });
  },
  bindRepassword: function(e) { //监听二次密码改变
    this.setData({
      userRepassword: e.detail.value
    });
    this.checkPwd()
  },
  checkPwd: function() { //密码比较
    var el = this.data.userPassword == this.data.userRepassword
    this.setData({
      isEqualPwd: el
    });
  },

  onShow: function() {
    //设置navbar
    wx.setNavigationBarTitle({
      title: '影缘之约 注册'
    })
  },
  changeGender:function(e){
    console.log(JSON.stringify(e.currentTarget.dataset.value))
    this.setData({
      gender: e.currentTarget.dataset.value
    })
  }
})