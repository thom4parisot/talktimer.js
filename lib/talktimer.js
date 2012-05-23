NodeList.prototype.forEach = Array.prototype.forEach;

function Talktimer(target){
  this.target = document.querySelector(target);
  this.timer = new Timer();
  this.weakpoints = [];

  //maybe we have something more clever to do here
  if (this.target === null){
    return;
  }

  this.controls = document.getElementById(this.target.getAttribute('data-timer-controls'));
  this.durations = document.getElementById(this.target.getAttribute('data-timer-durations'));

  this.bindTimerEvents();
  this.controls && this.bindControlEvents();
  this.durations && this.bindDurationEvents();
}

Talktimer.prototype.start = function(duration){
  this.timer.start(duration);
};

Talktimer.prototype.pause = function(){
  this.timer.pause();
};

Talktimer.prototype.reset = function(){
  this.timer.reset();
  this.repaint();
};

Talktimer.prototype.stop = function(){
  this.timer.stop();
  this.repaint();
};

Talktimer.prototype.toggle = function(){
  this.timer.toggle();
};

Talktimer.prototype.repaint = function(){
  this.drawer.interval.call(this);
};

Talktimer.prototype.setDuration = function(duration){
  this.timer.setDuration(duration);
  this.timer.reset();
  this.repaint();
};

Talktimer.prototype.bindTimerEvents = function(){
  this.timer.on('start', this.drawer.toggleToPause.bind(this));
  this.timer.on('pause', this.drawer.toggleToStart.bind(this));
  this.timer.on('interval', this.drawer.interval.bind(this));
  this.timer.on('interval', this.drawer.weakpoints.bind(this));
  this.timer.on('end', this.drawer.end.bind(this));
};

Talktimer.prototype.bindControlEvents = function(){
  var _this = this;

  this.controls.querySelectorAll('[data-timer-action]').forEach(function(el){
    el.addEventListener('click', function onActionClick(event){
      _this[this.getAttribute('data-timer-action')]();
    });
  });
};

Talktimer.prototype.bindDurationEvents = function(){
  var _this = this;

  this.durations.querySelectorAll('[data-timer-duration]').forEach(function(el){
    el.addEventListener('click', function onDurationSetterClick(event){
      _this.setDuration(this.getAttribute('data-timer-duration'));
      _this.weakpoints = (this.getAttribute('data-timer-weakpoints') || '').split(',');
    });
  });
};


Talktimer.drawers = {
  'defaultDrawer': {
    'interval': function(){
      var _this = this;
      var d = this.timer.currentDuration;
      var qs = function(s){ return _this.target.querySelector(s); };
      var f = Math.floor;

      //minutes
      if (d >= 59){
        qs('[data-timer-value=minutes-dozen]').innerText = f((d / 60) / 10);
        qs('[data-timer-value=minutes]').innerText = f((d / 60) % 10);
      }

      //seconds (always)
      qs('[data-timer-value=seconds-dozen]').innerText = f((d % 60) / 10);
      qs('[data-timer-value=seconds]').innerText = d % 60 % 10;
    },
    'weakpoints': function(){  },
    'end': function(){ console.log('end'); },
    'toggleToPause': function(){
      var el = this.controls.querySelector('[data-timer-action=toggle]');

      el.innerText = el.getAttribute('data-timer-pause');
    },
    'toggleToStart': function(){
      var el = this.controls.querySelector('[data-timer-action=toggle]');

      el.innerText = el.getAttribute('data-timer-start');
    }
  }
};

Talktimer.prototype.drawer = Talktimer.drawers.defaultDrawer;

