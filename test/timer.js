var Timer = require('../lib/timer');
var expect = require('expect.js');

suite('timer.js', function(){
  var timer;

  suite('#constructor', function(){
    test('proper initialization', function(){
      expect(function(){
        timer = new Timer();
      }).not.to.throwException();

      setup(function(){
        timer = new Timer();
      });
    });

    test('expected attributes', function(){
      expect(timer.currentDuration).to.be(0);
      expect(timer.initialDuration).to.be(0);
    });
  });

  suite('#on', function(){
    test('basics', function(){
      expect(timer.events).to.be.an('object');
      expect(timer.events).to.be.empty();
    });

    test('assigning functions', function(){
      expect(function(){
        timer.on('stuff', function doStuff(){
          return 'stuffDone';
        });
      }).not.to.throwException(TypeError);

      timer.on('stuff', function doStuff2(){});
      timer.on('interval', function doInterval(){});

      expect(timer.events.stuff.length).to.be(2);
      expect(timer.events.stuff[0]()).to.be('stuffDone');
      expect(timer.events.interval.length).to.be(1);
    });
  });

  suite('#emits', function(){
    test('existing event', function(done){
      timer.on('interval', function(){
        expect(timer.events.interval.length).to.be(1);
        done();
      });

      timer.emit('interval');
    });

    test('unexisting event', function(){
      expect(function(){
        timer.emit('foobar');
      }).not.to.throwException();
    });
  });

  suite('#start', function(){
    test('without argument', function(done){
      timer.setDuration(5);

      timer.on('start', function(){
        expect(this.initialDuration).to.be(5);
        expect(this.currentDuration).to.be(5);

        this.stop();

        done();
      });

      timer.start();
    });

    test('with argument', function(done){
      timer.on('start', function(){
        expect(this.initialDuration).to.be(10);
        expect(this.currentDuration).to.be(10);

        this.stop();

        done();
      });

      timer.start(10);
    });
  });

  suite('#pause', function(){
    test('initialization', function(done){
      timer.on('pause', function(){
        expect(this.id).to.be(null);
        expect(this.currentDuration).to.be(5);

        done();
      });

      timer.start(5);
      timer.pause();
    });

    test('after a delay', function(done){
      timer.on('pause', function(){
        expect(this.id).to.be(null);
        expect(this.currentDuration).to.be(4);

        done();
      });

      timer.on('interval', function(){
        this.pause();
      });

      timer.start(5);
    });
  });

  suite('#reset', function(done){
    test('initial time is set on reset', function(){
      timer.setDuration(5);

      timer.on('reset', function(){
        expect(this.id).to.be.ok();
        expect(this.currentDuration).to.be(5);
        expect(this.initialDuration).to.be(5);

        timer.stop();

        done();
      });

      timer.on('interval', function(){
        expect(this.currentDuration).to.be(4);
        expect(this.initialDuration).to.be(5);

        timer.reset();
      });

      timer.start();
    });
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