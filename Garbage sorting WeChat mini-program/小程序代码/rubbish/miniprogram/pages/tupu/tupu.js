// pages/tupu/tupu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  saveImage: function(e){
    var that = this;
    var imgPath = e.currentTarget.dataset.img;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImageToPhotosAlbum(imgPath);
            }
          })
        }else{
          that.saveImageToPhotosAlbum(imgPath);
        }
      }
    })
  },
  saveImageToPhotosAlbum: function (imgPath){
    wx.saveImageToPhotosAlbum({
      filePath: '/images/' + imgPath,
      success: function (res) {
        wx.showToast({
          title: '保存成功',
        });
        that.setData({
          excode: false
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '保存失败',
        });
      }
    });
  }
})