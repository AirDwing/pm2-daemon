const cluster = require('cluster');
const hostname = require('os').hostname();
const numCPUs = require('os').cpus().length;
const redis = require('../lib/redis');

// 不要在应用程序内直接使用 setTimeout, 尤其是内部是 async/await 的方法
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const sendAndCheck = async () => {
  // 从redis中读取已启动的partition和各自的offset

  // 向各个partition发送测试消息

  // 比较 offset 是否有变化
  // 如果没有(失去响应), 删除对应的 redis key, 该 Daemon 将会转变成 主服务并启动
  await redis.del('hostname');
};

const receiveAndCheck = async () => {
  const onlineHost = await redis.get('hostname');
  if (onlineHost !== hostname) {
    // 重启服务
    // pm2 restart xxx
  }
  await wait(60000); // 每1分钟执行一次
  await receiveAndCheck();
};

const wait2Start = async () => {
  const onlineHost = await redis.get('hostname');
  if (onlineHost === null) {
    // 作为主服务启动
    await redis.set('hostname', hostname);

    for (let i = 1; i <= numCPUs; i += 1) {
      cluster.fork();
    }
    // 侦听是否需要重启服务
    await receiveAndCheck();
  } else {
    // 如果已经有主服务存在, 作为 daemon 侦听
    await wait(600000); // 每10分钟执行一次
    // 发送消息到对应 hostname 检查是否能够被接收
    await sendAndCheck();
    await wait2Start();
  }
};

module.exports = wait2Start;
