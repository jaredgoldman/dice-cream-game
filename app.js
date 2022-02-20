const { Client, MessageEmbed } = require("discord.js")

let initialState = {
  isActive: false,
  win: false,
  luckyNumber: null,
  range: null,
  players: [],
  gameSpace: null,
}
let gameInterval

let state = initialState

let totalRolls = 0


const initializeGame = (luckyNumber, range, msg) => {
  setupState(luckyNumber, range)
  createGameSpace(state.luckyNumber)
  
}

const startGameUpdate = (msg) => {
  gameInterval = setInterval(updateGameSpace, 3000, msg)
}

const stopGame = () => {
  clearInterval(gameInterval)
}

const setupState = (luckyNumber, range) => {
  state.isActive = true
  state.luckyNumber = luckyNumber
  state.range = range
  state.win = false
  totalRolls = 0
}

const playerRoll = (user) => {
  const roll = rollDice()
  totalRolls++
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

const createGameSpace = (luckyNumber) => {
  // use discord syntax to build gamespace
  state.gameSpace = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Dice Cream Has Begun!')
  .setDescription('Roll the lucky number to win!')
  .addFields(
    { name: 'Lucky Number:', value: `${luckyNumber}` },
    { name: 'Total Rolls:', value: `${totalRolls}`},
    { name: 'Closest Players:', value: 'Not Yet Implemented'},
  );
  console.log("creating gamespace")
}

const updateGameSpace = (msg) => {
  if (!state.win) {
    console.log("updating gamespace")
    // update game space to reflect current scores found in state.players
    state.gameSpace = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Dice Cream Has Begun!')
  .setDescription('Roll the lucky number to win!')
  .addFields(
    { name: 'Lucky Number:', value: `${state.luckyNumber}` },
    { name: 'Total Rolls:', value: `${totalRolls}`},
    { name: 'Closest Players:', value: 'Not Yet Implemented'},
  );
    msg.edit({ embeds: [state.gameSpace], fetchReply: true})
  } else {
    const gameSpaceWinner = new MessageEmbed()
    .setColor('#ffff00')
    .setTitle('WINNNNNERRR')
    .setDescription(`USER has rolled ${state.luckyNumber} and WON in ${totalRolls} rolls. Please contact RANDY AL to claim your prize!`)
    console.log("update gamespace banner")
    console.log("WINNER")
    msg.edit({ embeds: [gameSpaceWinner], components: [], fetchReply: true})
    stopGame()
  }
  // update game space to winning banner
}

const generateRandomRoll = (range) => {
  return Math.floor(Math.random() * range)
}

module.exports = { initializeGame, playerRoll, stopGame, startGameUpdate, gameState: state }
