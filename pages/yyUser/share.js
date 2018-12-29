const app = getApp()

Page({
  data: {
    myCode:''
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '邀请好友',
    })
  },
  onLoad: function (option) {
    console.log(option)
    this.setData({
      myCode:option.code
    })
  },
  copyCode:function(){//复制按钮
    wx.setClipboardData({
      data: this.data.myCode,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
})
  