//index.js
const app = getApp()

Page({
  data: {
    list:[]
  },

  onLoad: function() {
    var that = this;
    that.initData();
  },
  //初始化数据
  initData: function(){
    var that = this;
    var list = new Array(); 
     var obj = {
       name: "小龙虾",
       next: [
         {key:'整只小龙虾', val:'餐厨垃圾'},
         {key:'去黄龙虾头', val:'餐厨垃圾'},
         {key:'龙虾壳', val:'餐厨垃圾'},
         {key:'龙虾肉', val:'餐厨垃圾'},
         {key:'龙虾黄', val:'餐厨垃圾'}
       ]
     };
     list.push(obj);

     obj = {
      name: "粽子",
      next: [
        {key:'整只粽子', val: '餐厨垃圾'},
        {key:'粽叶', val: '其他垃圾'},
        {key:'粽子馅', val: '餐厨垃圾'},
        {key:'粽子绳', val: '其他垃圾'}
      ]
    };
    list.push(obj);

    obj = {
      name: "奶茶",
      next: [
        {key:'没喝完的奶茶', val: '倒掉'},
        {key:'奶茶杯', val: '其他垃圾'},
        {key:'奶茶杯盖', val: '其他垃圾'},
        {key:'奶茶杯身', val: '其他垃圾'},
        {key:'珍珠', val: '餐厨垃圾'}
      ]
    };
    list.push(obj);

    obj = {
      name: "电池",
      next: [
        {key:'干电池', val: '其他垃圾'},
        {key:'充电宝', val: '可回收物'},
        {key:'手机电池', val: '有害垃圾'},
        {key:'蓄电池', val: '有害垃圾'}
      ]
    };
    list.push(obj);

    that.setData({
      list: list
    });
  },
  toDetailPage: function(e){
    var that = this;
    var name = e.currentTarget.dataset.name;
    var list = that.data.list;
    var obj = null;
    for(var i = 0; i<list.length; i++){
      var item = list[i];
      if(item.name == name){
        obj = item;
        break;
      }
    }
    var json = JSON.stringify(obj);
    wx.navigateTo({
      url: '/pages/special_detail/special_detail?json=' + json
    })
  }
})
