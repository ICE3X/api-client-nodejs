ICE3x node.js client
=================

A client implementation of [Ice3x trading API] (https://github.com/ICE3X/api-doc) in node.js.


Example Usage

-----

    var Ice3x = require('./ice3x.js');
    var ice3x = var ice3x = new Ice3x("api key", "private key");

    ice3x.order_history('GBP', 'BTC', 10, 7834, function(err, orders) {
      console.log(orders);  
    });

Please refer to example.js for a list of apis and their parameters. 