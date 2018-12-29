var app = getApp()
Page({
  data: {
    myJoin: [] //发布的约会
  },
  onLoad: function() {
    this.getLoc()
    this.getOrder()
  },
  joinClick: function(e) {
    var that = this
    var id = e.target.dataset.id
    var icon = 'success'
    var msg = ''
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '是否抢单？',
      confirmText: "是",
      cancelText: "否",
      success: function(res) {
        // console.log(res);
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理'
          })
          app.globalFunction.req(app.globalData.baseUrl + '?service=Applet.Attendevent', {
            ukey: wx.getStorageSync('ukey'),
            eventid: id
          }, function(res) {
            console.log(JSON.stringify(res))
            if (res.data.ret == 200) {
              msg: res.data.msg

            }
            else if (res.data.ret == 800) {
              
              if (res.data.msg =='repeat'){
                wx.showToast({
                  title: '你已经报过名了!请不要重复报名',
                  icon:'none'
                })
                return
              }
              
              app.globalFunction.loginErr()
            } else {
              msg: res.data.msg
              icon = 'none';
            }
            wx.showToast({
              title: res.data.msg,
              icon: icon
            })
          })
        }
      }
    });

    return


  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '影缘之约 接单',
    })
  },
  getLoc: function() {
    // console.log(app.globalData.ukey)
    wx.showLoading({
      title: '正在更新',
    })
    var that = this
    // return
    app.globalFunction.req(app.globalData.baseUrl + '?service=Tag.Gettaglist', {
      ukey: wx.getStorageSync('ukey')
    }, function(res) {
      // console.log(JSON.stringify(res))
      if (res.data.ret == '200') {
        console.log(JSON.stringify(res.data.data.list))
        that.setData({
          typeList: res.data.data.list

        });
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      } else {
        wx.showToast({
          title: '获取约会类型失败',
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateBack()
        }, 1500)
      }
      wx.hideLoading()
    })
  },
  getOrder: function() {
    var that = this
    app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Geteventlist', {
      ukey: wx.getStorageSync('ukey'),
    }, function(res) {
      console.log(JSON.stringify(res))
      if (res.data.ret == 200) {
        if (Number(res.data.data.total) <= 0) {
          return
        }
        that.setData({
          myJoin: res.data.data.list
        })


      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }
    })
  },
  userBtnClick: function() { //用户中心
    wx.navigateTo({
      url: '../yyUser/user'
    })
  },
  acceptBtnClick: function() {
    this.getLoc()
    // wx.showToast({
    //   title: '这是接单页面哦 ~',
    //   icon: 'none'
    // })
  },
  postBtnClick: function() { //发单
    wx.redirectTo({
      url: 'index'
    })
  },
  select: function(e) {
    console.log(JSON.stringify(e.currentTarget.dataset.title))
    wx.redirectTo({
      url: 'index?selectTypeTitle=' + e.currentTarget.dataset.title
    })
  }
})