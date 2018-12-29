var app = getApp()
Page({
  data: {

    cindex: 1,
    msg: '',
    rkey: '',
    id: ''


  },




  onLoad: function(obj) {

    console.log(JSON.stringify(obj))

    this.setData({
      id: obj.id,
      rkey: obj.rkey
    })


  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '评价',
    })
  },
  select: function(e) {
    var id = e.currentTarget.dataset.id
    // console.log(JSON.stringify(e))
    this.setData({
      cindex: id
    })
  },
  post: function() {
    var that = this
    wx.showLoading({
      title: '正在处理',
      mask:true
    })
    app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Eventcomment', {
      ukey: wx.getStorageSync('ukey'),
      id:this.data.id,
      rkey: this.data.rkey,
      score:this.data.cindex,
      remark:this.data.msg
    }, function(res) {

      console.log(JSON.stringify(res))
      // if (res.data.ret == 200) {
      //   var dt = res.data.data
        
      // } else if (res.data.ret == 800) {
      //   app.globalFunction.loginErr()
      // }
      wx.showLoading({
        title: '评价完成',
        mask: true
      })
      wx.navigateBack({
        delta: 1
      })
    })
  },
  msgChange: function(e) {

    this.setData({
      msg: e.detail.value
    })
    // console.log(JSON.stringify(e))
  },
})