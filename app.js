let initialState = {
  isActive: false,
  win: false,
  luckyNumber: null,
  range: null,
  players: [],
}
let gameInterval

let state = initialState

const initializeGame = (luckyNumber, range) => {
  setupState(luckyNumber, range)
  createGameSpace(state.luckyNumber)
  gameInterval = setInterval(updateGameSpace, 3000)
}

const stopGame = () => {
  clearInterval(gameInterval)
}

const setupState = (luckyNumber, range) => {
  state.isActive = true
  state.luckyNumber = luckyNumber
  state.range = range
}

const playerRoll = (user) => {
  const roll = rollDice()
  const id = user.id
  const userExists = state.players.find((player) => player.id === id)
  if (!userExists) {
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
  return {
    rollNumber: roll,
    isWin: state.win,
  }
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
    console.log("WINNER")
  }
  // update game space to winning banner
}

const generateRandomRoll = (range) => {
  return Math.floor(Math.random() * range)
}

module.exports = { initializeGame, playerRoll, stopGame, gameState: state }
