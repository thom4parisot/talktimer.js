function Timer(){
  this.currentDuration = 0; //in seconds
  this.initialDuration = 0; //in seconds

  //timer stuff
  this.id = null;
  this.interval = 1;  //in seconds

  //events
  this.events = {};
}

/**
 * Basic event listener for a timer
 *
 * @param event {String}
 * @param callback {Function}
 */
Timer.prototype.on = function(event, callback){
  if (!this.events[event]){
    this.events[event] = [];
  }

  this.events[event].push(callback);
};

/**
 * Basic event emitter for the timer
 *
 * @param event {String}
 * @param args {Array}
 */
Timer.prototype.emit = function(event, args){
  var context = this;
  args = Array.isArray(args) ? args : (args ? [args] : null);

  (this.events[event] || []).forEach(function(callback){
    callback.apply(context, args);
  });
};

/**
 * Starts a timer
 *
 * @api
 * @param duration {Integer}
 */
Timer.prototype.start = function(duration){
  if (this.id){
    return false;
  }

  if (duration || null){
    this.setDuration(duration);
    this.reset();
  }

  this.id = setInterval(this.onInterval.bind(this), this.interval * 1000);
  this.emit('start', this);
};

/**
 * Pauses a timer (holds the countdown)
 *
 * @api
 */
Timer.prototype.pause = function(){
  clearInterval(this.id);
  this.id = null;

  this.emit('pause', this);
};

/**
 * Resets to the initial duration
 *
 * @api
 */
Timer.prototype.reset = function(){
  this.currentDuration = this.initialDuration;

  this.emit('reset', this);
};

/**
 * Ends the timer (pause and clears the duration)
 *
 * @api
 */
Timer.prototype.stop = function(){
  this.pause();
  this.currentDuration = 0;

  this.emit('stop', this);
};

/**
 * Pauses or starts the timer, according to its internal state
 *
 * @api
 */
Timer.prototype.toggle = function(){
  this.id ? this.pause() : this.start();

  this.emit('toggle', this);
};

/**
 * Sets a new initial duration
 * It does not affect the current duration (call `reset` if you need that)
 *
 * @api
 * @param duration {Integer}
 */
Timer.prototype.setDuration = function(duration){
  this.initialDuration = Timer.sanitizeDuration(duration);

  this.emit('setDuration', this);
};

/**
 * Called each time an interval ticks
 *
 * You are not intended to call it by yourself
 */
Timer.prototype.onInterval = function(){
  this.currentDuration = this.currentDuration - this.interval;

  this.emit('interval', this);


  if (this.currentDuration <= 0){
    this.stop();
    this.emit('end', this);
  }
};

/**
 * Takes anything and tries to provide it back as a working number
 *
 * @static
 * @throw TypeError
 * @param duration {*}
 * @return {Number}
 */
Timer.sanitizeDuration = function(duration){
  duration = parseInt(duration, 10);

  if (isNaN(duration) || duration < 0){
    throw TypeError('Provided duration is not a positive integer.');
  }

  return duration;
};