const app = getApp()


Page({
  data: {
    loctype: '',
    list: [],
    search:''
  },
  onShow: function() {
    //设置navbar
    wx.setNavigationBarTitle({
      title: '选择地点'
    })

  },
  onLoad: function(obj) {
    console.log(obj)
    this.setData({
      loctype: obj.locStr
    })
    this.getloc()
  },
  selectLoc: function(e) {// 选择 返回
    // console.log(JSON.stringify(e))
    console.log(e.currentTarget.dataset)

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      selectLocation: e.currentTarget.dataset.str,
      selectlng: e.currentTarget.dataset.lng,
      selectrng: e.currentTarget.dataset.rng

    })

    wx.navigateBack()
  },
  getloc: function() {
    var that = this

    app.globalFunction.req(app.globalData.baseUrl + '?service=Applet.Getlist', {
      ukey: wx.getStorageSync('ukey'),
      lng: app.globalData.locaton.latitude,
      rng: app.globalData.locaton.longitude,
      type: this.data.loctype
    }, function(res) {
      console.log(JSON.stringify(res))
      if (res.data.ret == 200) {
        that.setData({
          list: res.data.data
        })
      } else if (res.data.ret == 800) {
        app.globalFunction.loginErr()
      }
    })
  },
  searchChange:function(e){
    // console.log(JSON.stringify(e.detail.value))
    this.setData({
      search: e.detail.value
    })
  },
  searchClick:function(){
    this.setData({
      loctype:this.data.search
    })
    this.getloc()
  } 
})