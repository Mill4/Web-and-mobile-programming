const log4js = require('log4js');

const logger = log4js.getLogger('investor');
// vaihda log level debugista jos haluat nähdä enemmän/vähemmän logitusta
logger.level = 'debug';

exports.logger = logger;
