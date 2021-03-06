[![Build Status](https://travis-ci.org/clinch/elevation.svg?branch=master)](https://travis-ci.org/clinch/elevation)

# elevation

Control elevators to get people where they need to go. Passengers are waiting to get up and down in a building. Your task is to get them to where they need to be, and keeping your passengers happy along the way.

# Description

In this problem, a single Elevator object exists which can move up and down within an elevator shaft. Controlling the elevator is relatively simple; you can move the elevator to any floor and when stopped on the floor, passengers can embark and disembark.

**Passengers will issue two requests** to the elevator controller. The first request will be the floor where they are waiting and the request will also have an associated direction. Once the elevator has positioned itself on the requested floor and stopped, the passenger will issue his/her second request for the destination floor. Finally, once the destination floor has been reached, the passenger will disembark.

# Task

**You must only change controllers.js**. Your final solution should not have modified any other files.

Feel free to create more input test files in the *data* directory. If you have a test file that would be beneficial to other people, please share it.

Create an elevator controller class to accept requests from passengers and move the elevator in an efficient way, while keeping passengers happy. A sample controller has already been provided for you in controllers.js. Feel free to rip it apart as needed.

Your solution will be analyzed entirely on how happy your passengers are at the end of their trips. Remember this as you come up with your solution.

# Definitions

## Elevator

### Emits

- `stop(floor)`: An event fired when Elevator stops at a given floor. Passengers can only embark/disembark from a stopped elevator. At this stage, the direction is not known because the elevator has not yet recieved it's next goto command from the controller.
    + Param `floor`: The floor which the elevator is stopped
- `load(floor, direction)`: An event fired when Elevator is stopped at a given floor and will soon begin moving. This event occurrs when  the elevator is given a goto command from the controller. Passengers can embark/disembark.
    + Param `floor`: The floor which the elevator is stopped
    + Param `direction`: (*Optional*) The direction which the elevator intends to travel after this stop.
- `idle(floor, [direction])` : An event fired when the Elevator has no more instructions queued up and the elevator is waiting for future movements.
    + Param `floor`: The floor which the elevator is stopped
    + Param `direction`: (*Optional*) The direction which the elevator intends to travel after this stop.
- `floorRequest(floor, [direction])`: A request is made to pick up or drop off a passenger. In the case of a Passenger waiting for the elevator to arrive, they will request the elevator to a *floor* and also specify an intended *direction*. A passenger who has already been picked up will call this but will only specify a *floor*, since they are already on the elevator.
    + Param `floor`: The floor which is requested for a passenger to get on or get off.
    + Param `direction`: (*Optional*) The (possibly incorrect) direction which the passenger intends to travel.
- `move(floor, direction)`: An event fired every time the elevator moves past a floor.
    + Param `floor`: The floor the elevator is currently passing.
    + Param `direction`: The direction which the elevator is travelling.

### Methods

- `goto(floor)` : Moves the elevator to the specified floor. Once the elevator arrives at the floor, it will emit a *stop* event. **Note**: Calling this method when the elevator is en route to a previous floor request will immediately change its destination without stopping at the previous floor.
- `requestFloor(floor, [direction])`: Make a request to pick up or drop off a passenger. In the case of a Passenger waiting for the elevator to arrive, they will request the elevator to a *floor* and also specify an intended *direction*. A passenger who has already been picked up will call this but will only specify a *floor*, since they are already on the elevator.
    + Param `floor`: The floor which is requested for a passenger to get on or get off.
    + Param `direction`: (*Optional*) The (possibly incorrect) direction which the passenger intends to travel.
- Several accessors are also available. `getFloor()`, `getDirection()`, `getDestination()` will return the current (or last) floor, the current movement direction, and the current destination of the elevator.

## Passenger

### Emits

- `embark()` : An event fired when the Passenger gets on an elevator.
- `disembark()` : An event fired when the Passenger gets off an elevator.

### Properties

- `satisfaction`: The satisfaction of a Passenger (between 0-100) will be calculated based on how long they had to wait for an elevator to arrive, whether it travelled only in the direction they wanted to go, and how long their trip was to reach their destination.

## ElevatorController

The elevator controller, found in *controllers.js*, is expected to listen to events from the elevator, and move the elevator accordingly. The controller should aim to move the elevator to fulfill the requests from the elevator passengers.


# Installing
```
npm install
```

# Running
A test harness is included in *test.js*. You can pass in data files from the *data* directory. You should pass the name of test file as an argument. Set the environment variable `DEBUG` prior to running. Eg:
```
DEBUG=* node test in1
```
See [https://github.com/visionmedia/debug](https://github.com/visionmedia/debug) for more details on using *debug*.


# Testing
Using the *debug* module, you could do something like this:
```
DEBUG=Elevator,Passenger,SerialElevatorController npm test
```
or perhaps just:
```
npm test
```
