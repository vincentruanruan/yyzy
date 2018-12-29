var app = getApp()
Page({
  data: {

    orderId: '',

    nowNum: 0,
    totalNum: 0,
    icon:'',
    user: '',
    type: '',
    loc: '',
    price: '0.00',
    time: '',
    status: '',

    list: []

  },




  onLoad: function(obj) {
    
    var that = this;
    
    this.setData({
      orderId: obj.orderId
    })
    this.getList()
  },
  onShow: function() {
    this.getList()
    wx.setNavigationBarTitle({
      title: '约会详情',
    })
  },
  getList: function() {//获取数据
    var that = this
    app.globalFunction.req(app.globalData.baseUrl + '?service=Applet.Getattendmember', {
      ukey: wx.getStorageSync('ukey'),
      eventid: this.data.orderId
    }, function(res) {

      console.log(JSON.stringify(res))
      if (res.data.ret == 200 && res.data.data!=null) {
        var dt = res.data.data
        that.setData({
          nowNum: dt.list.length,
          totalNum: dt.total,

          user: dt.eventlist.nickname,
          type: dt.eventlist.tagstr,
          loc: dt.eventlist.address,
          price: dt.eventlist.orderAmount,
          time: getLocalTime(dt.eventlist.sTime),
          status: dt.eventlist.status,
          icon: dt.eventlist.headimg,
          list: dt.list
        })

      } else if (res.data.data == null){

      }else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }
    })

  },
  addperson:function(e){//添加
    var that = this
    var rkey = e.currentTarget.dataset.rkey
    console.log(JSON.stringify(rkey))
    app.globalFunction.req(app.globalData.baseUrl + '?service=Event.Confirmattend', {
      ukey: wx.getStorageSync('ukey'),
      id: this.data.orderId,
      rkey: rkey
    }, function (res) {

      console.log(JSON.stringify(res))
      if (res.data.ret == 200 ) {
       wx.showToast({
         title: '添加成功',
       })
        that.getList()
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }else{
        wx.showToast({
          title: '添加失败',
          icon:'none'
        })
      }
    })
  },
  comment:function(e){//评论
    var rkey = e.currentTarget.dataset.rkey
    wx.navigateTo({
      url: 'comment?rkey=' + rkey + '&&id=' + this.data.orderId
    })
    // this.data.orderId
    // console.log(JSON.stringify(rkey))
  }
})

function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleDateString();
}