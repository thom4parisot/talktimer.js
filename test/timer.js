var Timer = require('../lib/timer');
var expect = require('expect.js');

suite('timer.js', function(){
  var timer;

  suite('#constructor', function(){
    test('proper initialization', function(){
      expect(function(){
        timer = new Timer();
      }).not.to.throwException();
    });

    test('expected attributes', function(){
      expect(timer.currentDuration).to.be(0);
      expect(timer.initialDuration).to.be(0);
    });
  });

  suite('#emits', function(){

  });

  suite('#on', function(){

  });

  suite('#on', function(){

  });

  suite('#start', function(){

  });

  suite('#pause', function(){

  });

  suite('#reset', function(){

  });

  suite('#stop', function(){

  });

  suite('#toggle', function(){

  });

  suite('#setDuration', function(){

  });

  suite('#onInterval', function(){

  });

  suite('#sanitizeDuration', function(){

  });
});