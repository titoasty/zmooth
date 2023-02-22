# Zmooth

Zmooth is a library to smoothly interpolate values.
You simply set a destination value, and it will automatically interpolate to it.
The interpolation formula is the following:
```
currentValue = previousValue + (destinationValue - previousValue) * delta * speed
```
You can change the destination value at any time

## Basic example

You can see an example here: 


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
// create a zmooth object with the start value 0 and a speed of 5
const myZmooth = zmooth.val(0, 5, function(value) {
    console.log(value);
});


// set destination value to 10
myZmooth.to = 10;


// you can also access the value with the "value" property:
setInterval(function() {
    console.log(myZmooth.value);
}, 100);


// if you want to kill the zmooth object, just call .kill()
myZmooth.kill();
```


## Functions
### `zmooth.to(startValue, speed=1, callback=undefined)`

Create a zmooth object and returns it.
You can now set the destination value by setting the *to* property.

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
setInterval(function() {
    console.log(myZmooth.value);
}, 100);

// and now let's kill the zmooth object after a certain time
setTimeout(function() {
    myZmooth.kill();
}, 5000);
```

### `zmooth.prop(object, propertyName, speed=5, callback=undefined)`

Same as val() but the property of the object will be automatically updated.

```javascript
// create a dummy object
const myObj = {
    myProperty: 0,
}

// create a zmooth object referencing "myProperty" of myObj
const myZmooth = zmooth.prop(obj, 'myProperty', 5, function(value) {
    console.log(myProperty.value);
});

// now myObj.myProperty will be automatically assigned the smoothed value
myZmooth.to = 10;
```



### `zmooth.killAll()`

Kill all the zmooth objects
