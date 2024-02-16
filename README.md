# Zmooth

Zmooth is a library to smoothly interpolate values over time.\
You simply set a destination value, and it will automatically interpolate to it over time.\
The interpolation formula is the following:
```
currentValue = previousValue + (destinationValue - previousValue) * delta * speed
```
You can change the destination value at any time

## Basic example

You can see an example [here](https://titoasty.github.io/zmooth/examples/mouse.html)


## Installation

Npm
```sh
npm install zmooth
```

Yarn
```sh
yarn add zmooth
```

Or you can use the files located in the "dist" directory.


## Usage

```javascript
// create a zmooth object with the start value 0
// and an interpolation speed of 5
// the last parameter is a callback called
// each time the value is interpolated
const myZmooth = zmooth.val(0, 5, function(value) {
    console.log(value);
});


// sets destination value to 10
// now the callback above will be called with a value
// gradually going from 0 to 10 over time
myZmooth.to = 10;


// you can also directly access the value with field "value"
setInterval(function() {
    console.log(myZmooth.value);
}, 100);


// to kill the zmooth object, just call .kill()
myZmooth.kill();
```

Another example using requestAnimationFrame:

```javascript
const myZmooth = zmooth.val(0, 5);

const render = function() {
    requestAnimationFrame(render);

    console.log(myZmooth.value);
}

requestAnimationFrame(render);

myZmooth.to = 10;
```

## Functions
### `zmooth.to(startValue, [speed=1], [callback=undefined])`

Creates a zmooth object and returns it.\
You can now set the destination value by setting the "*to*" property.

To kill it, simply call .kill() on a zmooth object.

```javascript
// create a zmooth object with start value 0 and speed 5
// everytime the value is changed, the callback will be called
const myZmooth = zmooth.to(0, 5, function(value) {
    console.log(value);
});

// now set destination value
myZmooth.to = 10

// let's observe the value changing
const intID = setInterval(function() {
    console.log(myZmooth.value);
}, 100);

// let's kill the zmooth object after an arbitrary duration
setTimeout(function() {
    clearInterval(intID);
    myZmooth.kill();
}, 5000);
```

### `zmooth.prop(object, propertyName, speed=5, callback=undefined)`

Same as val() but targets the property of an object.
The property will be automatically updated.

```javascript
// creates a dummy object
const myObj = {
    myProperty: 0,
}

// creates a zmooth object referencing "myProperty" of myObj
const myZmooth = zmooth.prop(obj, 'myProperty', 5, function(value) {
    console.log(myProperty.value);
});

// now myObj.myProperty will automatically be assigned the smoothed value
myZmooth.to = 10;
```



### `zmooth.killAll()`

Kills all the zmooth objects
