// pages/yyIndex/selectAppointmentType.js

const app = getApp()


Page({
  data: {
    typeList: []
  },
  select:function(e){

    var dt = e.currentTarget.dataset
    console.log(JSON.stringify(dt))

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      selectTypeTitle: dt.title,
      selectType:dt.id,
      selectLocation:''
    })

    wx.navigateBack() 


  },
  onShow: function () {
    //设置navbar
    wx.setNavigationBarTitle({
      title: '选择约会类型'
    })
  },
  onLoad: function () {
    // console.log(app.globalData.ukey)
    var that = this
    // return
    app.globalFunction.req(app.globalData.baseUrl + '?service=Tag.Gettaglist', { 
      ukey: wx.getStorageSync('ukey')
    }, function (res) {
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
        setTimeout(function () {
          wx.navigateBack()
        }, 1500)
      }
    })
  }
})

