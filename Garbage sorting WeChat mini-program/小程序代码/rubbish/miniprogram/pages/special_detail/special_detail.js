// miniprogram/pages/special_detail/special_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var json = options.json;
    json = JSON.parse(json);
    that.setData({
      obj: json
    });
    wx.setNavigationBarTitle({
      title: json.name+"专题"
    })
  }
})