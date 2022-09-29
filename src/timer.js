export class Timer{
  currentDuration = 0; //in seconds
  initialDuration = 0; //in seconds

  //timer stuff
  id = null;
  interval = 1;  //in seconds

  //events
  events = {};

  /**
   * Basic event listener for a timer
   *
   * @param event {String}
   * @param callback {Function}
   */
  on (event, callback){
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
  emit (event, args){
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
  start (duration){
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
  pause (){
    clearInterval(this.id);
    this.id = null;

    this.emit('pause', this);
  };

  /**
   * Resets to the initial duration
   *
   * @api
   */
  reset (){
    this.currentDuration = this.initialDuration;

    this.emit('reset', this);
  };

  /**
   * Ends the timer (pause and clears the duration)
   *
   * @api
   */
  stop (){
    this.pause();
    this.currentDuration = 0;

    this.emit('stop', this);
  };

  /**
   * Pauses or starts the timer, according to its internal state
   *
   * @api
   */
  toggle (){
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
  setDuration (duration){
    this.initialDuration = Timer.sanitizeDuration(duration);
    this.currentDuration = this.initialDuration;

    this.emit('setDuration', this);
  };

  /**
   * Called each time an interval ticks
   *
   * You are not intended to call it by yourself
   */
  onInterval (){
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
  static sanitizeDuration (duration){
    duration = parseInt(duration, 10);

    if (isNaN(duration) || duration < 0){
      throw TypeError('Provided duration is not a positive integer.');
    }

    return duration;
  }
}
