//index.js
const app = getApp()

Page({
  data: {
    isAnswering: true,//是否正在答题
    currentIndex: -1,//当前答题下标
    questionIndexs: [],//选题下标
    questions: [],//选题
    currentQuestion: null,//当前题
    resetCheckedVal: false,//用于重置radio
    scope: 0//最后得分
  },

  onLoad: function() {
    var that = this;
    that.createSelects();
  },
  radioChange: function(e){
    var that = this;
    var currentQuestion = that.data.currentQuestion;
    currentQuestion.myanswer = e.currentTarget.dataset.value;
    that.setData({
      questions: that.data.questions
    });
    that.nextQuestion();
  },
  //创建选题
  createSelects: function(){
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'countAnswer'
      }
    }).then((res) => {
      var array = that.generateRandom(res.result.data);
      that.setData({
        questionIndexs: array
      });
      that.nextQuestion();
    })
  },
  generateRandom: function(total){
    var number = total < 10 ? total : 10;
    var array = new Array(); 
    while(true){ 
      if(array.length < number){ 
        this.generateRandomItem(array, total); 
      }else{ 
        break; 
      } 
    } 
    return array;
  },
  generateRandomItem: function(array, total){
    var random = Math.floor((Math.random()*total)+1);
    for(var i = 0; i<array.length; i++){
      if(array[i] == random)
         return ;
    }
    array.push(random);
  },
  //下一题
  nextQuestion:function(){
    var that = this;
    var questionIndexs = that.data.questionIndexs;
    var currentIndex = that.data.currentIndex;
    currentIndex++;
    if(currentIndex >= questionIndexs.length){
      that.setData({
        isAnswering: false
      });
      that.totalScope();
      return ;
    }
    that.setData({
      currentIndex: currentIndex
    });
    setTimeout(function () {
      that.setData({
        resetCheckedVal: false
      });
    }, 500) ;
    
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: 'getAnswer',
        index: currentIndex
      }
    }).then((res) => {
      var questions = that.data.questions;
      var question = res.result.data[0];
      questions.push(question);
      that.setData({
        questions: questions
      });
      that.setData({
        currentQuestion: question
      });
    })
  },
  //统计分数
  totalScope: function(){
    var that = this;
    var scope = 0;
    var questions = that.data.questions;
    for(var i = 0; i<questions.length; i++){
      var item = questions[i];
      if(item.myanswer==item.answer){
        scope += 10;
      }
    }
    that.setData({
      scope: scope
    });
  },
  //再考一次
  bindAgain: function(e){
    wx.reLaunch({
      url: '/pages/examination/examination'
    })
  }


})
