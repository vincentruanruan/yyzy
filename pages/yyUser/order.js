var app = getApp()
Page({
  data: {
    /**  
     * 页面配置  
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换    
    currentTab: 0,

    myPost: [], //发布的约会
    myJoin: [] //发布的约会
  },

  /**  
   * 滑动切换tab  
   */
  bindChange: function(e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (e.detail.current == 0) {
      console.log('发布的约会')
      this.myPost()
    } else {
      console.log('参与的约会')
      this.myJoin()
    }
  },
  /**  
   * 点击tab切换  
   */
  swichNav: function(e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

  },
  myPost: function() { //发布的约会
    var that = this
    app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Myeventlist', {
      ukey: wx.getStorageSync('ukey')
    }, function(res) {
      console.log(JSON.stringify(res))
      if (res.data.ret == 200) {
        var dt = res.data.data
        if (Number(dt.total) <= 0) {
          return
        }
        // console.log(JSON.stringify(dt))
        that.setData({
          myPost: dt.list
        })
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }
    })
  },
  myJoin: function() { //参与的约会
    var that = this
    app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Myattendlist', {
      ukey: wx.getStorageSync('ukey')
    }, function(res) {
      console.log(JSON.stringify(res))
      if (res.data.ret == 200) {
        var dt = res.data.data
        if (!dt) {
          that.setData({
            myJoin: []
          })
          return
        }
        that.setData({
          myJoin: dt.list
        })
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }
    })
  },
  cancelJoin: function(e) { //取消参加约会
    var that = this
    // console.log(JSON.stringify(e))
    console.log(e.target.dataset.id)


    wx.showModal({
      title: '提示',
      content: '是否取消约会？',
      confirmText: "是",
      cancelText: "否",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理',
          })
          app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Cancelattend', {
            ukey: wx.getStorageSync('ukey'),
            id: e.target.dataset.id
          }, function(res) {
            console.log(JSON.stringify(res))
            if (res.data.ret == 200) {
              that.myJoin()
              var dt = res.data
              wx.showToast({
                title: dt.msg,
              })

            } else if (res.data.ret == 800) {
              app.globalFunction.loginErr()
            }
          })
        }
      }
    })


  },
  onLoad: function() { //参与的约会
    var that = this;

    /**  
     * 获取系统信息  
     */
    wx.getSystemInfo({

      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '我的约会',
    })
    this.myJoin()
    this.myPost()
  },
  toPay: function(e) { //去支付

    // console.log(JSON.stringify(e))
    // return
    wx.navigateTo({
      url: '../yyIndex/checkstandPost?price=' + e.currentTarget.dataset.orderamount + '&&ordersn=' + e.currentTarget.dataset.ordersn + '&&backPage=1'
    })
  },
  toConfirm: function(e) { //去確認
    // console.log(JSON.stringify(e.currentTarget.dataset.orderid))
    // return
    wx.navigateTo({
      url: '../yyUser/confirm?orderId=' + e.currentTarget.dataset.orderid
    })
  },
  toFinishConfirm: function(e) {

    var that = this
    wx.showModal({
      title: '提示',
      content: '是否完成确认？',
      confirmText: "是",
      cancelText: "否",
      success: function(res) {

        if (res.confirm) {
          app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Confirmfinish', {
            ukey: wx.getStorageSync('ukey'),
            id: e.currentTarget.dataset.orderid
          }, function(res) {
            console.log(JSON.stringify(res))
            if (res.data.ret == 200) {
              wx.showToast({
                title: res.data.msg,
                mask: true
              })
              that.myPost()
            } else if (res.data.ret == 800) {
              app.globalFunction.loginErr()
            }
          })
        } else if (res.cancel) {

        }


      }
    })
  }
})