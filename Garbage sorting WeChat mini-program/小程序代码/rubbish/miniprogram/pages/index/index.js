//index.js
const app = getApp()
const recorderManager = wx.getRecorderManager()
Page({
  data: {
    categorys: [],
    hotProducts: []
  },

  onLoad: function() {
    var that = this;
    that.getCategorys();
    that.getHotProduct();
    //对停止录音进行监控
    that.bindRecorderEvent();
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.article.title,
      path: '/pages/index/index'
    }
  },
  //渲染分类
  getCategorys: function (e) {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getCategorys'
      }
    }).then((res) => {
      var that = this;
      that.setData({
        categorys: res.result.data
      });
    }).catch((e) => {
      console.log(e);
    });
  },
  //渲染热门
  getHotProduct: function (e) {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getProductByHot'
      }
    }).then((res) => {
      var that = this;
      that.setData({
        hotProducts: res.result.data
      });
    }).catch((e) => {
      console.log(e);
    });
  },
  //转到搜索页面
  toSearchPage: function(e){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  //转到图谱页面
  toTupuPage: function (e) {
    wx.navigateTo({
      url: '/pages/tupu/tupu'
    })
  },
  //转到拍照页面
  toCameraPage: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.navigateTo({
          url: '/pages/camera_result/camera_result',
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', { data: tempFilePaths })
          }
        })
      }
    })
  },
  //语音识别
  handleTouchStart: function(e){
    //录音参数
    const options = {
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'PCM'
    }
    //开启录音
    recorderManager.start(options);
    wx.showLoading({
      title: '正在录音中...',
    })
  },
  handleTouchEnd: function(e){
    wx.hideLoading();
    recorderManager.stop();
  },
  bindRecorderEvent: function(){
    var that = this;
    recorderManager.onError(function (res) {
      wx.hideLoading();
      that.showToast(res.errMsg);
    });

    recorderManager.onStop((res) => {
      wx.showLoading({
        title: '正在识别中...',
      })
      var baiduBccessToken = wx.getStorageSync("baidu_yuyin_access_token");
      var tempFilePath = res.tempFilePath;
      // var fileSize = res.fileSize;
      const fs = wx.getFileSystemManager();
      fs.readFile({
        filePath: tempFilePath,
        success(res) {
          const base64 = wx.arrayBufferToBase64(res.data);
          var fileSize = res.data.byteLength;
          wx.request({
            url: 'https://vop.baidu.com/server_api',
            data: {
              format: 'pcm',
              rate: 16000,
              channel: 1,
              cuid: 'sdfdfdfsfs',
              token: baiduBccessToken,
              speech: base64,
              len: fileSize
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            complete(res){
              wx.hideLoading();
            },
            success(res) {
              console.log(res.data);
              if(res.data.err_no != 0){
                that.showToast("识别错误!");
                return ;
              }
              var result = res.data.result;
              if (result.length == 0){
                wx.showToast({
                  title: "未识别到语音信息!",
                  icon: 'none',
                  duration: 3000
                })
                return ;
              }
              
              var keyword = result[0];
              keyword = keyword.replace("。", "");
              wx.navigateTo({
                url: '/pages/search/search?keyword=' + keyword
              })
            }
          })
        }
      })

      
    })
  },
  showToast: function(msg){
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 3000
    })
  }
  

})
