import { Timer } from './timer.js'

export default class Talktimer {
  timer = new Timer();
  weakpoints = [];

  //@see https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
  interactionEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

  drawer = Talktimer.drawers.defaultDrawer;
  target = null
  controls = null
  durations = null


  constructor (target) {
    this.target = document.querySelector(target);

    if (!this.target) {
      throw new Error('target DOM element is missing')
    }

    this.controls = document.getElementById(this.target.getAttribute('data-timer-controls'));
    this.durations = document.getElementById(this.target.getAttribute('data-timer-durations'));

    this.bindTimerEvents();
    this.controls && this.bindControlEvents();
    this.durations && this.bindDurationEvents();

      //proxying
    ['start', 'pause', 'reset', 'stop', 'toggle'].forEach((method) => {
      this[method] = this.timer[method].bind(this.timer);
    });
  }

  /**
   * Sets a new duration for the timer
   *
   * @api
   * @param duration {Integer}
   */
  setDuration (duration){
    this.timer.setDuration(duration);
    this.timer.reset();
  };

  /**
   * Binds events to the internal timer to draw stuff if necessary
   *
   * @internal
   */
  bindTimerEvents (){
    const timer = this.timer;
    const drawer = this.drawer;

    timer.on('start', drawer.toggleToPause.bind(this));
    timer.on('pause', drawer.toggleToStart.bind(this));
    timer.on('reset', drawer.reset.bind(this));
    timer.on('stop', drawer.end.bind(this));
    timer.on('end', drawer.end.bind(this));

    //redrawing on relevant events
    ['interval', 'stop', 'reset'].forEach((action) => {
      timer.on(action, drawer.interval.bind(this));
      timer.on(action, drawer.weakpoints.bind(this));
    });
  };

  /**
   * Binds actions to relevant buttons
   *
   * It enables controlling the timer API through DOM elements
   */
  bindControlEvents (){
    Array.from(this.controls.querySelectorAll('[data-timer-action]')).forEach((el) => {
      el.addEventListener(this.interactionEvent, (event) => {
        this[el.getAttribute('data-timer-action')]();
      });
    });
  };

  /**
   * Binds duration setters to relevant buttons
   */
  bindDurationEvents (){
    Array.from(this.durations.querySelectorAll('[data-timer-duration]')).forEach((el) => {
      el.addEventListener(this.interactionEvent, (event) => {
        this.setDuration(el.getAttribute('data-timer-duration'));
        this.weakpoints = (el.getAttribute('data-timer-weakpoints') || '').split(',');
      });
    });
  };


  /**
   * Drawers contain the display logic (in theory)
   * You can then change the working logic without having to bind events again
   *
   * @type {Object}
   */
  static drawers = {
    'defaultDrawer': {
      /**
       * Redraws the time left in the UI
       *
       * @api
       */
      interval (){
        const d = this.timer.currentDuration;
        const qs = (s) => this.target.querySelector(s);
        const f = Math.floor;

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
      weakpoints (){
        const d = this.timer.currentDuration;
        const i = this.timer.initialDuration;
        let className = '';

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
      reset (){
        const el = this.controls.querySelector('[data-timer-action=toggle]');

        el.removeAttribute('disabled');
      },
      /**
       * What to do when the timer reached the zero value
       */
      end (){
        const el = this.controls.querySelector('[data-timer-action=toggle]');

        el.setAttribute('disabled', true);
      },
      /**
       * What to do when we are starting
       */
      toggleToPause (){
        const el = this.controls.querySelector('[data-timer-action=toggle]');

        el.innerText = el.getAttribute('data-timer-pause');
      },
      /**
       * What to do when we are pausing
       */
      toggleToStart (){
        const el = this.controls.querySelector('[data-timer-action=toggle]');

        el.innerText = el.getAttribute('data-timer-start');
      }
    }
  };
}

