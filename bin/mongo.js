var mongo	=	require('monk')('127.0.0.1:27017/schedular');

module.exports = mongo;