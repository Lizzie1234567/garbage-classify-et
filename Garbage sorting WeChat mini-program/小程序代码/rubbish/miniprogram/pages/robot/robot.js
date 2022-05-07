// miniprogram/pages/robot/robot.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //初始化
     var that = this;
     var obj = {};
     obj.speaker = 'left';
     obj.content = '您好，我是智能垃圾分类机器人。您可以这样问我：';
     obj.content += '\r\n1. 湿纸巾属于什么垃圾';
     obj.content += '\r\n2. 什么是干垃圾';
     obj.content += '\r\n3. 有害垃圾都有什么';
     var list = that.data.list;
     list.push(obj);
     that.setData({
      list: list
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit: function(e){
    var that = this;
    var obj = {};
    obj.speaker = 'right';
    obj.content = that.data.content;
    var list = that.data.list;
    list.push(obj);
    that.setData({
      list: list
    });
    var content = that.data.content;
    that.setData({
      content: ''
    });
    var baiduBccessToken = wx.getStorageSync("baidu_unit_access_token");
    wx.request({
      url: 'https://aip.baidubce.com/rpc/2.0/unit/bot/chat?access_token=' + baiduBccessToken, 
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      data: {
        version: '2.0',
        bot_id: '1021437',
        log_id: 'adfdfdfdf',
        request: {
          'user_id': '88888sdfdfdfdf',
          'query': content,
          'query_info': {
              'type': 'TEXT',
              'source': 'KEYBOARD'
           },
           'bernard_level': 1
        }, 
        bot_session: ''
      },
      success (res) {
        var data = res.data;
        if(data.error_code != 0)
          return ;
        var response = data.result.response.action_list[0].say;
        var obj = {};
        obj.speaker = 'left';
        obj.content = response;
        var list = that.data.list;
        list.push(obj);
        that.setData({
          list: list
        });
      }
    })
  }
})