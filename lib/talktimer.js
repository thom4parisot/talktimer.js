NodeList.prototype.forEach = Array.prototype.forEach;

function Talktimer(target){
  var _this = this;
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

  //proxying
  ['start', 'pause', 'reset', 'stop', 'toggle'].forEach(function(method){
    _this[method] = _this.timer[method].bind(_this.timer);
  });
}

/**
 * Sets a new duration for the timer
 *
 * @api
 * @param duration {Integer}
 */
Talktimer.prototype.setDuration = function(duration){
  this.timer.setDuration(duration);
  this.timer.reset();
};

/**
 * Binds events to the internal timer to draw stuff if necessary
 *
 * @internal
 */
Talktimer.prototype.bindTimerEvents = function(){
  var _this = this;
  var timer = this.timer;
  var drawer = this.drawer;

  timer.on('start', drawer.toggleToPause.bind(_this));
  timer.on('pause', drawer.toggleToStart.bind(_this));
  timer.on('reset', drawer.reset.bind(_this));
  timer.on('stop', drawer.end.bind(_this));
  timer.on('end', drawer.end.bind(_this));

  //redrawing on relevant events
  ['interval', 'stop', 'reset'].forEach(function(action){
    timer.on(action, drawer.interval.bind(_this));
    timer.on(action, drawer.weakpoints.bind(_this));
  });
};

/**
 * Binds actions to relevant buttons
 *
 * It enables controlling the timer API through DOM elements
 */
Talktimer.prototype.bindControlEvents = function(){
  var _this = this;

  this.controls.querySelectorAll('[data-timer-action]').forEach(function(el){
    el.addEventListener('click', function onActionClick(event){
      _this[this.getAttribute('data-timer-action')]();
    });
  });
};

/**
 * Binds duration setters to relevant buttons
 */
Talktimer.prototype.bindDurationEvents = function(){
  var _this = this;

  this.durations.querySelectorAll('[data-timer-duration]').forEach(function(el){
    el.addEventListener('click', function onDurationSetterClick(event){
      _this.setDuration(this.getAttribute('data-timer-duration'));
      _this.weakpoints = (this.getAttribute('data-timer-weakpoints') || '').split(',');
    });
  });
};


/**
 * Drawers contain the display logic (in theory)
 * You can then change the working logic without having to bind events again
 *
 * @type {Object}
 */
Talktimer.drawers = {
  'defaultDrawer': {
    /**
     * Redraws the time left in the UI
     *
     * @api
     */
    'interval': function(){
      var _this = this;
      var d = this.timer.currentDuration;
      var qs = function(s){ return _this.target.querySelector(s); };
      var f = Math.floor;

      //minutes
      qs('[data-timer-value=minutes-dozen]').innerText = f((d / 60) / 10);
      qs('[data-timer-value=minutes]').innerText = f((d / 60) % 10);

      //seconds (always)
      qs('[data-timer-value=seconds-dozen]').innerText = f((d % 60) / 10);
      qs('[data-timer-value=seconds]').innerText = d % 60 % 10;
    },
    /**
     * Applies alert rules according to the actual time value
     *
     * @api
     */
    'weakpoints': function(){
      var _this = this;
      var d = this.timer.currentDuration;
      var i = this.timer.initialDuration;
      var className = '';

      switch(true){
        case (d <= 0): className = 'finished'; break;
        case (d < i * 0.10): className = 'low'; break;
        case (d < i * 0.20): className = 'medium'; break;
        default: className = ''; break;
      }

      className ? this.target.setAttribute('data-timer-weakpoint', className) : this.target.removeAttribute('data-timer-weakpoint');
    },
    /**
     * Reinitiate the state of the toggling/start button
     */
    'reset': function(){
      var el = this.controls.querySelector('[data-timer-action=toggle]');

      el.removeAttribute('disabled');
    },
    /**
     * What to do when the timer reached the zero value
     */
    'end': function(){
      var el = this.controls.querySelector('[data-timer-action=toggle]');

      el.setAttribute('disabled', true);
    },
    /**
     * What to do when we are starting
     */
    'toggleToPause': function(){
      var el = this.controls.querySelector('[data-timer-action=toggle]');

      el.innerText = el.getAttribute('data-timer-pause');
    },
    /**
     * What to do when we are pausing
     */
    'toggleToStart': function(){
      var el = this.controls.querySelector('[data-timer-action=toggle]');

      el.innerText = el.getAttribute('data-timer-start');
    }
  }
};

Talktimer.prototype.drawer = Talktimer.drawers.defaultDrawer;

