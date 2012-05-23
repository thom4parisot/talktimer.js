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

Talktimer.prototype.stop = function(){
  this.timer.stop();
  this.repaint();
};

Talktimer.prototype.toggle = function(){
  this.timer.toggle();
};

Talktimer.prototype.repaint = function(){
  console.log('repaint');
};

Talktimer.prototype.setDuration = function(duration){
  console.log('New Duration: %s', duration);
  this.timer.setDuration(duration);
};

Talktimer.prototype.bindTimerEvents = function(){
  this.timer.on('interval', this.drawer.interval.bind(this));
  this.timer.on('interval', this.drawer.weakpoints.bind(this));
  this.timer.on('end', this.drawer.end.bind(this));
};

Talktimer.prototype.bindControlEvents = function(){

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
    'interval': function(){ console.log('interval'); },
    'weakpoints': function(){ console.log('weakpoint'); },
    'end': function(){ console.log('end'); }
  }
};

Talktimer.prototype.drawer = Talktimer.drawers.defaultDrawer;

