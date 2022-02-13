let initialState = {
  isActive: false,
  win: false,
  luckyNumber: null,
  players: [],
}

let state = initialState

const main = (luckyNumber) => {
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

const setupListener = (lucky_number) => {
  // communicate with gamespace
  // client.on('click') {
  const roll = rollDice(lucky_number)
  const id = user.id
  if (!user) {
    state.players.push({
      id: state.players.length + 1,
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

const rollDice = (lucky_number) => {
  const number = generateRandomRoll()
  if (number === lucky_number) {
    state.win = true
  }
  // roll dice
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

const generateRandomRoll = () => {
  return Math.floor(Math.random() * 10001)
}
