import { Timer } from './timer.js'
import { beforeEach, afterEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'

let timer


describe('#constructor', function(){
  beforeEach(() => timer = new Timer())

  it('proper initialization', function(){
    assert.doesNotThrow(() => new Timer());
  });

  it('expected attributes', function(){
    console.log(timer)
    assert.equal(timer.currentDuration, 0);
    assert.equal(timer.initialDuration, 0);
  });
});

describe('#on', function(){
  beforeEach(() => timer = new Timer())

  it('basics', function(){
    assert.deepEqual(timer.events, {});
  });

  it('assigning functions', function(){
    assert.doesNotThrow(function(){
      timer.on('stuff', () => 'stuffDone')
    })

    timer.on('stuff', function doStuff2(){});
    timer.on('interval', function doInterval(){});

    assert.equal(timer.events.stuff.length, 2);
    assert.equal(timer.events.stuff[0](), 'stuffDone');
    assert.equal(timer.events.interval.length, 1);
  });
});

describe('#emits', function(){
  beforeEach(() => timer = new Timer())

  it('existing event', function(done){
    timer.on('interval', function(){
      assert.equal(timer.events.interval.length, 1);
      done();
    });

    timer.emit('interval');
  });

  it('unexisting event', function(){
    assert.doesNotThrow(function(){
      timer.emit('foobar');
    })
  });
});

describe('#start', function(){
  beforeEach(() => timer = new Timer())
  afterEach(() => timer.stop())

  it('without argument', function(done){
    timer.setDuration(5);

    timer.on('start', function(){
      assert.equal(this.initialDuration, 5);

      this.stop();
      assert.equal(this.currentDuration, 0);

      done();
    });

    timer.start();
  });

  it('with argument', function(done){
    timer.on('start', function(){
      assert.equal(this.initialDuration, 10);

      this.stop();
      assert.equal(this.currentDuration, 0);

      done();
    });

    timer.start(10);
  });
});

describe('#pause', function(){
  beforeEach(() => timer = new Timer())
  // afterEach(() => timer.stop())

  it('initialization', function(done){
    timer.on('pause', function(){
      assert.deepEqual(this.id, null);
      assert.deepEqual(this.currentDuration, 5);

      done();
    });

    timer.start(5);
    timer.pause();
  });

  it('after a delay', function(done){
    timer.on('pause', function(){
      assert.equal(this.id, null);
      assert.equal(this.currentDuration, 4);

      done();
    });

    timer.on('interval', timer.pause.bind(timer));

    timer.start(5);
  });
});

describe('#reset', function(){
  beforeEach(() => timer = new Timer())

  it('initial time is set on reset', function(done){
    timer.setDuration(5);

    timer.on('reset', function(){
      assert.ok(this.id);
      assert.equal(this.currentDuration, 5);
      assert.equal(this.initialDuration, 5);

      timer.stop();

      done();
    });

    timer.on('interval', timer.reset.bind(timer));

    timer.start();
  });
});

describe('#stop', function(){
  beforeEach(() => timer = new Timer())

  it('with a duration', function(done){
    timer.setDuration(5);

    timer.on('stop', function(){
      assert.equal(this.currentDuration, 0);

      done();
    });

    assert.equal(timer.currentDuration, 5);
    timer.stop();
  });

  it('without duration', function(){
    timer.stop();

    assert.equal(timer.currentDuration, 0);
  });
});

describe('#toggle', function(){
  beforeEach(() => timer = new Timer())
  afterEach(() => timer.stop())

  it('from pause to start', function(done){
    timer.on('toggle', function(){
      assert.ok(timer.id);

      done();
    });

    assert.equal(timer.id, null);
    timer.toggle();
  });

  it('from start to pause', function(done){
    timer.on('toggle', function(){
      assert.equal(timer.id, null);

      done();
    });

    timer.start(5);
    timer.on('interval', timer.toggle.bind(timer));
  });
});

describe('#setDuration', function(){
  beforeEach(() => timer = new Timer())
  afterEach(() => timer.stop())

  it('expected values', function(){
    assert.equal(timer.initialDuration, 0);

    timer.setDuration(5);

    assert.equal(timer.initialDuration, 5);
  });
});

describe('#onInterval', function(){
  beforeEach(() => timer = new Timer())
  afterEach(() => timer.stop())

  it('event called', function(done){
    timer.on('interval', function(){
      assert.equal(this.currentDuration, 4);
      assert.equal(this.initialDuration, 5);

      done();
    });

    timer.start(5);
  });
});

describe('#sanitizeDuration', function(){
  beforeEach(() => timer = new Timer())

  it('expected data', function(){
    assert.equal(Timer.sanitizeDuration(10), 10);
    assert.equal(Timer.sanitizeDuration(0), 0);
  });

  it('expected exception', function(){
    assert.throws(function(){
      Timer.sanitizeDuration(-1);
      Timer.sanitizeDuration('-1');
      Timer.sanitizeDuration('1');
      Timer.sanitizeDuration(null);
      Timer.sanitizeDuration({});
      Timer.sanitizeDuration(function(){});
      Timer.sanitizeDuration([]);
    }, { name: 'TypeError' })
  });
});
