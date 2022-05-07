//index.js
const app = getApp()

Page({
  data: {
    list: null,
    keyword: ''
  },

  onLoad: function (options) {
    var that = this;
    console.log(options);
    var keyword = options.keyword;
    that.setData({
      keyword: keyword
    });
    that.search();
  },
  bindSearchInput: function(e){
    var val = e.detail.value.trim();
    this.setData({
      keyword: val
    });
    this.search();
  },
  //查询
  search: function (id) {
    var that = this;
    var keyword = that.data.keyword;
    if (keyword == ''){
      that.setData({
        list: []
      });
      return ;
    }
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getProductByKeyword',
        keyword: keyword
      }
    }).then((res) => {
      var data = res.result.data;
      for (var i = 0; i < data.length; i++){
        that.getCategory(data, i);
      }
    }).catch((e) => {
      console.log(e);
    });
  },
  //分类
  getCategory: function (list, i) {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getCategoryById',
        id: list[i].categoryId
      }
    }).then((res) => {
      list[i].categoryName = res.result.data[0].name;
      that.setData({
        list: list
      });
    }).catch((e) => {
      console.log(e);
    });
  }
})
