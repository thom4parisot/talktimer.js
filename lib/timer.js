function Timer(){
  this.currentDuration = 0; //in seconds
  this.initialDuration = 0; //in seconds

  //timer stuff
  this.id = null;
  this.interval = 1;  //in seconds
}

/*
 * Default events emitter signature
 * You can then plug whatever you want to handle them (don't reinvent the wheel)
 */
Timer.prototype.events = {
  'on': function(callback){},
  'emit': function(event, args){}
};

/**
 * Starts a timer
 *
 * @api
 * @param duration {Integer}
 */
Timer.prototype.start = function(duration){
  if (duration || null){
    this.setDuration(duration);
  }

  this.id = setInterval(this.onInterval.bind(this), this.interval * 1000);
};

/**
 * Pauses a timer (holds the countdown)
 *
 * @api
 */
Timer.prototype.pause = function(){
  clearInterval(this.id);
};

/**
 * Resets to the initial duration
 *
 * @api
 */
Timer.prototype.reset = function(){
  this.currentDuration = this.initialDuration;
};

/**
 * Ends the timer (pause and clears the duration)
 *
 * @api
 */
Timer.prototype.stop = function(){
  this.pause();
  this.currentDuration = 0;

  this.events.emit('stop', this);
};

/**
 * Pauses or starts the timer, according to its internal state
 *
 * @api
 */
Timer.prototype.toggle = function(){
  this.id ? this.pause() : this.start();
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
};

/**
 * Called each time an interval ticks
 *
 * You are not intended to call it by yourself
 */
Timer.prototype.onDuration = function(){
  this.currentDuration = this.currentDuration - this.interval;

  if (this.currentDuration <= 0){
    this.stop();
    this.events.emit('end', this);
  }
  else{
    this.events.emit('interval', this);
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