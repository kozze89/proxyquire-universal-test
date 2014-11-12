var proxyquire = require('proxyquire');
var BaseService = proxyquire('../BaseService', {
  get: function() { return this;}
});

describe('BaseService', function() {

  describe('get', function() {
    it('something', function() {
      new BaseService().get();
    });
  });

});
