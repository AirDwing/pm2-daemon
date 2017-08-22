const cluster = require('cluster');

/* eslint global-require:0 */
let run;
if (cluster.isMaster) {
  run = require('./cluster/master');
} else {
  run = require('./cluster/worker');
}
run().catch(console.trace);
