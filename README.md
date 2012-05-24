# talktimer.js

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
</script>
```

### setDuration(duration)

Sets a new initial value and resets the timer to this value.

### start(duration)

Starts the countdown for the sake of your speakers.

If the `duration` argument is set, also give a call to `setDuration` prior to the countdown.

### toggle()

Toggles between `start` and `pause`, according to the state of the timer.

### pause()

Pauses the countdown.

### stop()

Pauses the countdown and sets it to `00:00`.

### reset()

Resets to the initial value.

### repaint()

Redraws the timer, applying styles if relevant.


## Skeleton

### Timer
```html
<div id="timer" data-timer-controls="timer-controls" data-timer-durations="timer-durations">
  <span data-timer-value="minutes-dozen">0</span><!--
    --><span data-timer-value="minutes">0</span><!--
    --><span data-timer-separator>:</span><!--
    --><span data-timer-value="seconds-dozen">0</span><!--
    --><span data-timer-value="seconds">0</span>
</div>
```

`data-*` attributes are used to customize the timer experience:
* `data-timer-controls`: binds the timer to a controls holder with id `#<value>`
* `data-timer-durations`: binds the timer to a durations holder with id `#<value>`

### Controls

```html
<div id="timer-controls">
  <button type="button" data-timer-action="toggle" data-timer-start="Start" data-timer-pause="Pause">Start</button>
  <button type="button" data-timer-action="stop">Stop</button>
  <button type="button" data-timer-action="reset">Reset</button>
</div>
```

`data-*` attributes are used to customize the timer experience:
* `data-timer-action`: Talktimer API method used on click
* `data-timer-start`: contains the label used when the "start" action is enabled
* `data-timer-pasue`: contains the label used when the "pause" action is enabled

### Durations

```html
<div id="timer-durations">
  <button type="button" data-timer-duration="300">5 minutes</button>
  <button type="button" data-timer-duration="1200">20 minutes</button>
  <button type="button" data-timer-duration="2400">40 minutes</button>
</div>
```

`data-*` attributes are used to customize the timer experience:
* `data-timer-duration`: initialize the bound talktimer instance with this duration (in seconds)