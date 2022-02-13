# DICE CREAM

## Architecture

- Node.js

## Routes

- Slash command to start the process

## Dependencies

- Discord.js

## Business Logic

- Players jump into channel together
- Prize is stickied to the top
- Gamespace is displayed with button
  - features lucky number, roll rarte, refresh rate, leaderboard, total rolls
- Dice is rolled by user optionally once and after refresh rate
- Private message comes up telling you if you won or not and what you rolled
- When game is completed gamespace turns into winning message
- Messages cannot be set from users

## Actions

- Jared to set up logic
- Julian to work on creating gamespace

## Pseudocode

// initialize the game

let win = false
main(lucky_number) {

// start listening to rolls
setupListener(lucky_number)
// create the gamespace
createGameSpace(lucky_number)
setInterval(updateGameSpace, 1000)
}`

setupState() {
// store winning number
// initialize data structure/state
}

setupListener(lucky_number) {
// communicate with gamespace
client.on('click') {
if (!user) {
// create object for every user playing
} else {
// update user
}
// roll dice
rollDice(lucky_number)
}
}

rollDice(lucky_number) {
const number = generateRandomRoll()
if (number === lucky_number) {
win = true
}
// roll dice
return number
}

createGameSpace() {
// use discored syntax to build gamespace
}

updateGameSpace() {
while (!win) {

}
// update game space to winning banner
}

generateRandomRoll() {
math.random.....
}
