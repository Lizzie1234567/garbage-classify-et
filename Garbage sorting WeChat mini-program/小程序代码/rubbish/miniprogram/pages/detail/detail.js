//index.js
const app = getApp()

Page({
  data: {
    product: null,
    category: null
  },

  onLoad: function (options) {
    var that = this;
    var pid = options.pid;
    var cid = options.cid;
    if (typeof pid != "undefined") {
      that.getProduct(pid);
    }
    if (typeof cid != "undefined") {
      that.getCategory(cid);
    }
    
  },
  //物品
  getProduct: function (id) {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getProductById',
        id: id
      }
    }).then((res) => {
      var that = this;
      var data = res.result.data[0];
      that.setData({
        product: data
      });
      that.getCategory(data.categoryId);
    }).catch((e) => {
      console.log(e);
    });
  },
  //分类
  getCategory: function (id) {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getCategoryById',
        id: id
      }
    }).then((res) => {
      var that = this;
      var data = res.result.data[0];
      data.guide = data.guide.replace(/\\n/g, "\n");
      that.setData({
        category: data
      });
    }).catch((e) => {
      console.log(e);
    });
  }


})
