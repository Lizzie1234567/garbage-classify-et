// pages/camera_result/camera_result.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '图片识别中...',
    })
    //获取传参
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.readImage(data.data[0]);
    })
  },
  //加载
  loadProduct: function (list, i) {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getProductByName',
        name: list[i].keyword
      }
    }).then((res) => {
      if (res.result.data.length > 0){
        list[i]._id = res.result.data[0]._id;
        list[i].categoryId = res.result.data[0].categoryId;
        that.loadCategory(list, i);
      }else{
        list[i]._id = '';
        list[i].categoryId = '';
        list[i].categoryName = '-';
        that.setData({
          list: list
        });
      }
    }).catch((e) => {
      console.log(e);
    });
  },
  //加载
  loadCategory: function (list, i) {
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
  },
  
  //读取图片
  readImage: function (tempImagePath){
    var that = this;
    wx.getFileSystemManager().readFile({
      filePath: tempImagePath,
      encoding: "base64",
      success: res => {
        that.reqBaiduAi(res.data);
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '拍照失败,未获取相机权限或其他原因',
          icon: "none"
        })
      }
    })
  },
  reqBaiduAi: function (image) {
    var that = this;
    var baiduBccessToken = wx.getStorageSync("baidu_ai_access_token");
    var url = "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=" + baiduBccessToken;
    wx.request({
      url: url,
      data: {
        image: image
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading();
        var list = res.data.result;
        that.setData({
          list: list
        });
        for (var i = 0; i < list.length; i++) {
          that.loadProduct(list, i);
        }
      }
    })
  },
  //转到详情页面
  toDetailPage: function (e) {
    var id = e.currentTarget.dataset.id;
    if(id == ''){
      wx.showToast({
        title: '未识别到垃圾类型',
        icon: 'none',
        duration: 3000
      })
      return ;
    }
    wx.navigateTo({
      url: '/pages/detail/detail?pid=' + id
    })
  },
  //转到拍照页面
  toCameraPage: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
})