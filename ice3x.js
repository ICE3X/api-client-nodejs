var querystring = require("querystring");
var https = require('https');
var crypto = require('crypto');

var Ice3x = function(key, secret) {
  this.key = key;
  this.secret = secret;
}

Ice3x.prototype._request = function(method, path, data, callback, args) {
  
  var options = {
    host: 'api.ice3x.com',
    path: path,
    method: method,
    headers: {
      'User-Agent': 'Mozilla/4.0 (compatible; Ice3x node.js client)'
    }
  };

  if(method === 'post') {
    options.headers['Content-Length'] = data.length;
    options.headers['content-type'] = 'application/json';
    options.headers['accept'] = 'application/json';
    options.headers['accept-charset'] = 'utf-8';

    options.headers['signature'] = args.signature;
    options.headers['apikey'] = args.key;
    options.headers['timestamp'] = args.timestamp;
  }

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var buffer = '';
    res.on('data', function(data) {
      buffer += data;
    });
    res.on('end', function() {
      try {
        var json = JSON.parse(buffer);
      } catch (err) {
        return callback(err);
      }
      callback(null, json);
    });
  });

  req.on('error', function(err) {
    callback(err);
  });

  req.on('socket', function (socket) {
    socket.setTimeout(5000);
    socket.on('timeout', function() {
      req.abort();
    });
    socket.on('error', function(err) {
      callback(err);
    });
  });
  
  req.end(data);

}

Ice3x.prototype._post = function(action, callback, args) {
  if(!this.key || !this.secret)
    return callback('api key and private key are mandatory.');

  var path = action;
  var timestamp = new Date().getTime();
  timestamp = timestamp.toString(); 
  var postData = JSON.stringify(args);
  var message =  path + '\n' + timestamp + '\n' + postData;

  var hmac = crypto.createHmac('sha512',new Buffer(this.secret, 'base64'));
  hmac.update(message);
  var signature = hmac.digest('base64');
  
  args.key = this.key;
  args.signature = signature;
  args.timestamp = timestamp;

  this._request('post', path, postData, callback, args);
}

Ice3x.prototype.create_order = function(currency, instrument, price, volume, side, type, clientRequestId, callback) {
  this._post('/order/create', callback, {currency:currency, instrument:instrument, price:price, volume:volume, orderSide:side, ordertype:type, clientRequestId:clientRequestId});
}

Ice3x.prototype.cancel_order = function(orderIds, callback) {
  this._post('/order/cancel', callback, {orderIds:orderIds});
}

Ice3x.prototype.order_detail = function(orderIds, callback) {
  this._post('/order/detail', callback, {orderIds:orderIds});
}

Ice3x.prototype.open_orders = function(currency, instrument, limit, since, callback) {
  this._post('/order/open', callback, {currency:currency, instrument:instrument, limit:limit, since:since});
}


Ice3x.prototype.order_history = function(currency, instrument, limit, since, callback) {
  this._post('/order/history', callback, {currency:currency, instrument:instrument, limit:limit, since:since});
}

Ice3x.prototype.trade_history = function(currency, instrument, limit, since, callback) {
  this._post('/order/trade/history', callback, {currency:currency, instrument:instrument, limit:limit, since:since});
}

module.exports = Ice3x;
