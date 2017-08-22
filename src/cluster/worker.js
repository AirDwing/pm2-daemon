const cluster = require('cluster');
// 禁止直接启动
if (cluster.isMaster) {
  process.exit(0);
}

module.exports = async () => {
  // 保持应用在线
  setInterval(() => {
    console.log(process.pid);
  }, 1000);
};
