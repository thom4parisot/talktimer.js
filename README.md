Managing a conference is nice. Ensuring talks finish on time is part of the deal you have
with your audience.

As I can't guaranty the quality of your speakers, `talktimer.js` is a tool that
nearly guaranties talks to finish on time.

Why? Because the speaker will have that displayed on a tablet device, with a browser
opened on a webpage.

## Principles

`talktimer.js` is a set of decoupled elements, relying on UI events.
It is then delivered as a fully working component, you can extend without touching
the code, nor extending it.

## Usage

```javascript
<script src="/path/to/talktimer.js"></script>
<script>
var talktimer = new Talktimer('#timer');
talktimer.start();
</script>
```

## Skeleton

### Timer
```html
<div id="timer" data-timer-controls="timer-controls" data-timer-durations="timer-durations">
  <span data-timer-value="minutes-dozen">0</span>
  <span data-timer-value="minutes">0</span>
  <span data-timer-value="minutes">0</span>
  <span data-timer-separator>:</span>
  <span data-timer-value="seconds-dozen">0</span>
  <span data-timer-value="seconds">0</span>
</div>
```

### Controls

```html
<div id="timer-controls">
  <button type="button" data-timer-action="toggle" data-timer-start="Start" data-timer-pause="Pause">Start</button>
  <button type="button" data-timer-action="stop">Stop</button>
  <button type="button" data-timer-action="reset">Reset</button>
</div>
```

### Durations

```html
<div id="timer-durations">
  <button type="button" data-timer-duration="300">5 minutes</button>
  <button type="button" data-timer-duration="1800" data-timer-weakpoints="300">20 minutes</button>
  <button type="button" data-timer-duration="3600" data-timer-weakpoints="300,1800">40 minutes</button>
</div>
```

## Licence