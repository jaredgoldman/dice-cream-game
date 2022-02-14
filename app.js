let initialState = {
  isActive: false,
  win: false,
  luckyNumber: null,
  range: null,
  players: [],
}

let state = initialState

const initializeGame = (luckyNumber, range) => {
  setupState(luckyNumber, range)
  createGameSpace(state.luckyNumber)
  setInterval(updateGameSpace, 3000)
}

const setupState = (luckyNumber, range) => {
  state.isActive = true
  state.luckyNumber = luckyNumber
  state.range = range
}

const playerRoll = (user) => {
  const roll = rollDice()
  const id = user.id
  const userExists = state.players.filter((player) => player.id === id)
  if (!userExists.length) {
    state.players.push({
      id,
      rolls: [roll],
      wallet: "",
      otherData: {},
    })
  } else {
    // update player
    state.players.forEach((player) => {
      if (player.id === id) {
        player.rolls.push(roll)
      }
    })
  }
  console.log(state.players)
  return roll
}

const rollDice = () => {
  const number = generateRandomRoll(state.range)
  if (number === state.luckyNumber) {
    state.win = true
  }
  return number
}

const createGameSpace = () => {
  // use discored syntax to build gamespace
  console.log("creating gamespace")
}

const updateGameSpace = () => {
  if (!state.win) {
    console.log("updating gamespace")
    // update game space to reflect current scores found in state.players
  } else {
    console.log("update gamespace banner")
  }
  // update game space to winning banner
}

const generateRandomRoll = (range) => {
  return Math.floor(Math.random() * range)
}

module.exports = { initializeGame, playerRoll, gameState: state }
