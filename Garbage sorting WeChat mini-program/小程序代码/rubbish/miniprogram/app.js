//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }


    this.globalData = {
      baiduai:{
        apiKey: "0T9A1mFRpjO3GbedBmXg11IR",
        secretKey: "nxixMYKiWC4fWpYUZUrgIZ0FZk5MGcVC",
        url: "https://aip.baidubce.com/oauth/2.0/token"
      },
      baiduyuyin:{
        apiKey: '3HscnXI9gQ4kKw',
        secretKey: 'CtiM7jU3oGB51PbrGkHXDV',
        url: 'https://openapi.baidu.com/oauth/2.0/token'
      },
      baiduunit:{
        apiKey: 'enBkxieT8P4cX7MgzedCU3X0',
        secretKey: 'w7VFj374TsuO5FyhN7SpToysFegcS2ok',
        url: 'https://aip.baidubce.com/oauth/2.0/token'
      },
    }
  },
  onShow (options) {
    var that = this;console.log("进入onshow");
    that.getBaiduAiAccessToken();
    that.getBaiduYuyinAccessToken();
    that.getBaiduUnitAccessToken();
  },
  getBaiduAiAccessToken: function () {
    var that = this;
    var baiduai = that.globalData.baiduai;
    wx.request({
      url: baiduai.url,
      data: {
        grant_type: 'client_credentials',
        client_id: baiduai.apiKey,
        client_secret: baiduai.secretKey
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.setStorageSync("baidu_ai_access_token", res.data.access_token);
        wx.setStorageSync("baidu_ai_time", new Date().getTime());
      }
    })
  },
  getBaiduYuyinAccessToken: function () {//
    var that = this;
    var baiduyuyin = that.globalData.baiduyuyin;
    console.log(baiduyuyin);
    wx.request({
      url: baiduyuyin.url,
      data: {
        grant_type: 'client_credentials',
        client_id: baiduyuyin.apiKey,
        client_secret: baiduyuyin.secretKey
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.setStorageSync("baidu_yuyin_access_token", res.data.access_token);
        wx.setStorageSync("baidu_yuyin_time", new Date().getTime());
      }
    })
  },
  getBaiduUnitAccessToken: function () {
    var that = this;
    var baiduunit = that.globalData.baiduunit;
    wx.request({
      url: baiduunit.url,
      data: {
        grant_type: 'client_credentials',
        client_id: baiduunit.apiKey,
        client_secret: baiduunit.secretKey
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.setStorageSync("baidu_unit_access_token", res.data.access_token);
        wx.setStorageSync("baidu_unit_time", new Date().getTime());
      }
    })
  }
})
