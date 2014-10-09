var Ice3x = require('./ice3x.js');

var key = 'YOUR API KEY';
var privatekey = 'YOUR PRIVATE KEY';
var ice3x = new Ice3x(key, privatekey);

// sample api calls

//ice3x.create_order('ZAR', 'BTC', 13000000000, 1000000, 'Bid', 'Limit', '1', handleResponse);
//var orderIds=[243463];
//ice3x.cancel_order(orderIds, handleResponse);

//var orderIds=[17463];
//ice3x.order_detail(orderIds, handleResponse);

//ice3x.open_orders('ZAR', 'BTC', 10, 78343, handleResponse);

//ice3x.order_history('ZAR', 'BTC', 10, 7834, handleResponse);

//ice3x.trade_history('ZAR', 'BTC', 10, 119834, handleResponse);

function handleResponse(error, data) {
   if (error) {
      console.log(error);
      return;
   }
   console.log('got response');
   console.log(data);
}