# Monopoly
Monopoly game in online format. Thanks to web socket technology, you can play a popular game at a distance without any restrictions

## Technologies
`NodeJS/Express` is used on the server side. The client is written in `Vue/Vuex`

## Features
* **Updates in real time**, allowing you to play the game online. (Implemented using `Socket.io`)
* **The rules and street names** are taken from the original game. Nothing has changed
* **The style is based on the original game**, but we had to slightly change the proportions of the field for ease of play

## For the future
* Add authorization and profiles
* Setting up the game for special rules
* Add other variations of the game (like auction, casino, etc.)

## Commands
In file `package.json` contains the following commands:
* `server-serve` - launching server part using `nodemon` in test mode
* `client-serve` - launching client part using the built-in development server `vue-cli`
* `client-build` - client part assembly. Necessary for correct operation `websockets`
* `dev` - client part assembly and simultaneous server part launch
* `test` - running tests

## Test mode
If `NODE_ENV=test` is set, the server will not wait for reconnection with the websocket and will immediately kick the player