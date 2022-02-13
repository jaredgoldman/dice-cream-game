let initialState = {
  isActive: false,
  win: false,
  luckyNumber: null,
  players: [],
}

let state = initialState

const main = (luckyNumber, range) => {
  // start listening to rolls
  setupListener(luckyNumber)
  // create the gamespace
  createGameSpace(luckyNumber)
  setInterval(updateGameSpace, 1000)
}

const setupState = (luckyNumber) => {
  state.isActive = true
  state.luckyNumber = luckyNumber
}

const setupListener = (luckyNumber, range) => {
  // communicate with gamespace
  // client.on('click') {
  const roll = rollDice(luckyNumber, range)
  const id = user.id
  if (!user) {
    state.players.push({
      id,
      rolls: [roll],
      wallet: "",
      otherData: {},
    })
  } else {
    // update user
    state.players.forEach((player) => {
      if (player.id === id) {
        player.rolls.push(roll)
      }
    })
  }
  // }
}

const rollDice = (lucky_number, range) => {
  const number = generateRandomRoll(range)
  if (number === lucky_number) {
    state.win = true
  }
  return number
}

const createGameSpace = () => {
  // use discored syntax to build gamespace
}

const updateGameSpace = () => {
  while (!win) {
    // update game space to reflect current scores found in state.players
  }
  // update game space to winning banner
}

const generateRandomRoll = (range) => {
  return Math.floor(Math.random() * range)
}
