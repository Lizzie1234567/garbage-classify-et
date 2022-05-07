// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  //获取分类
  app.router('getCategorys', async (ctx) => {
    var dbResult = await db.collection('rubbish-category').orderBy('order', 'asc').get();
    ctx.body = { code: 'success', data: dbResult.data };
  });
  //获取分类(根据id))
  app.router('getCategoryById', async (ctx) => {
    var dbResult = await db.collection('rubbish-category').where({
      id: event.id
    }).get();
    ctx.body = { code: 'success', data: dbResult.data };
  });
  //获取物品(根据id))
  app.router('getProductById', async (ctx) => {
    var dbResult = await db.collection('rubbish-product').where({
      _id: event.id
    }).get();
    ctx.body = { code: 'success', data: dbResult.data };
  });
  //获取物品(根据hot))
  app.router('getProductByHot', async (ctx) => {
    var dbResult = await db.collection('rubbish-product').where({
      hot: true
    }).get();
    ctx.body = { code: 'success', data: dbResult.data };
  });
  //获取物品(根据name))
  app.router('getProductByName', async (ctx) => {
    var dbResult = await db.collection('rubbish-product').where({
      name: event.name
    }).get();
    ctx.body = { code: 'success', data: dbResult.data };
  });
  //获取物品(根据keyword))
  app.router('getProductByKeyword', async (ctx) => {
    var dbResult = await db.collection('rubbish-product').where({
      name: {
        $regex: '.*' + event.keyword,
        $options: 'i'
      }
    }).get();
    ctx.body = { code: 'success', data: dbResult.data };
  });
  //统计题库总数
  app.router('countAnswer', async (ctx) => {
    var dbResult = await db.collection('rubbish-answer').count().then(res => {
      ctx.body = { code: 'success', data: res.total};
    })
  });
  //获取题(根据位置index))
  app.router('getAnswer', async (ctx) => {
    var index = event.index;
    var dbResult = await db.collection('rubbish-answer').skip(index).limit(1).get();
    ctx.body = { code: 'success', data: dbResult.data };
  });

  return app.serve();


}