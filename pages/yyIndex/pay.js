var app = getApp()
Page({
  data: {
    balance:'0.00',
    arrayIndex:0,
    array:[10,30,50,100,200,500,1000,2000,5000,10000,20000,50000]
  },


 
  onLoad: function (obj) { //参与的约会
    console.log(obj)
    this.setData({
      balance: obj.total
    })
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '充值',
    })
  },
  select:function(e){//金额选择点击
    console.log(e.currentTarget.dataset.selectid)
    this.setData({
      arrayIndex: e.currentTarget.dataset.selectid
    })
  },
  payClick:function(){//充值点击
    wx.navigateTo({
      url: 'checkstand?price=' + this.data.array[this.data.arrayIndex]
    })
  }
})