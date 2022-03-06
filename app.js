const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const artistId = process.env.ARTIST_DISCORD_ID

let initialState = {
  isActive: false,
  win: false,
  luckyNumber: null,
  range: null,
  players: [],
  gameSpace: null,
  gameSpaceMessage: null,
  winningPlayer: null,
  timeOutInterval: null,
  totalRolls: 0,
  rolledRecently: new Set(),
  availableRolls: [],
}

let gameInterval

let state = initialState

const initializeGame = (luckyNumber, range, timeout) => {
  setupState(luckyNumber, range, timeout)
  createGameSpace(state.luckyNumber)
}

const startGameUpdate = (msg) => {
  gameInterval = setInterval(updateGameSpace, 3000, msg)
}

const stopGame = () => {
  if (gameInterval) {
    clearInterval(gameInterval)
  }
  state.isActive = false
  state.availableRolls = []
}

const setupState = (luckyNumber, range, timeout) => {
  state.isActive = true
  state.luckyNumber = luckyNumber
  state.range = range
  state.win = false
  state.totalRolls = 0
  state.players = []
  state.winningPlayer = null
  state.timeOutInterval = timeout * 1000
  state.availableRolls = [...Array(range).keys()]
}

const playerRoll = (user) => {
  const roll = rollDice()
  state.totalRolls++
  if (state.win) {
    state.winningPlayer = user
    // update game space to winning banner
        const gameSpaceWinner = new MessageEmbed()
        .setColor("#ffff00")
        .setTitle("WINNNNNERRR")
        .setDescription(
          `${state.winningPlayer} has rolled ${state.luckyNumber} and WON in ${state.totalRolls} rolls. Please contact <@${artistId}> to claim your prize!`
        )
    console.log("update gamespace banner")
    console.log("WINNER")
    state.gameSpaceMessage.edit({ embeds: [gameSpaceWinner], components: [], fetchReply: true })
    stopGame()
  }
  const distToLuckyNumber = Math.abs(roll - state.luckyNumber)

  const id = user.id
  const userExists = state.players.find((player) => player.id === id)
  if (!userExists) {
    // if user does not exist, add new user entry to state
    state.players.push({
      id,
      rolls: [roll],
      wallet: "",
      otherData: {},
      closestRoll: roll,
      closestRollDist: distToLuckyNumber,
    })
  } else {
    // if player odes exist, update state and check if roll is closer thhan previous
    state.players.forEach((player) => {
      if (player.id === id) {
        player.rolls.push(roll)
        if (distToLuckyNumber < player.closestRollDist) {
          player.closestRoll = roll
          player.closestRollDist = distToLuckyNumber
        }
      }
    })
  }
  return {
    rollNumber: roll,
    isWin: state.win,
  }
}

const rollDice = () => {
  const number = generateRandomRoll()
  if (number === state.luckyNumber) {
    state.win = true
  }
  return number
}

const createGameSpace = (luckyNumber) => {
  const buttonRow = createButton()
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Dice Cream Has Begun!")
    .setDescription("Roll the lucky number to win!")
    .setThumbnail("https://i.imgur.com/nBl91fS.png")
    .addFields(
      { name: "Lucky Number:", value: `${luckyNumber}` },
      { name: "Range", value: `${state.range}` },
      { name: "Closest Players:", value: "No Rolls Yet!" },
      { name: "Total Rolls:", value: `${state.totalRolls}` }
    )
  return {
    components: [buttonRow],
    embeds: [embed],
    fetchReply: true,
  }
}

const updateGameSpace = () => {
  if (!state.win) {
    // sort players by closest roll distance
    const playersByDist = state.players.sort(
      (a, b) => a.closestRollDist - b.closestRollDist
    )
    // grab top five rolls
    const leaderBoard = playersByDist.slice(0, 5)

    let leaderBoardEmbed = leaderBoard
      .map((player, index) => {
        return `${index + 1}) <@${player.id}> - \`${player.closestRoll}\`\n`
      })
      .join("")
    leaderBoardEmbed = "\u200B\n" + leaderBoardEmbed

    state.gameSpace = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Dice Cream Has Begun!")
      .setDescription("Roll the lucky number to win!")
      .setThumbnail("https://i.imgur.com/nBl91fS.png")
      .addFields(
        { name: "Lucky Number:", value: `${state.luckyNumber}` },
        { name: "Range", value: `${state.range}` },
        { name: "Closest Players:", value: leaderBoardEmbed },
        { name: "Total Rolls:", value: `${state.totalRolls}` }
      )
    state.gameSpaceMessage.edit({ embeds: [state.gameSpace], fetchReply: true })
  }
}

const createButton = () => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("roll")
      .setLabel(`Roll 🎲`)
      .setStyle("PRIMARY")
  )
}

const generateRandomRoll = () => {
  let index =  Math.floor(Math.random() * state.availableRolls.length)
  let number = state.availableRolls.splice(index, 1)[0]
  return number
}

const handleRolledRecently = (user) => {
  state.rolledRecently.add(user.id)

  setTimeout(() => {
    state.rolledRecently.delete(user.id)
    // add buffer 1.5 seconds so users can't roll early
  }, state.timeOutInterval + 1500)
}

module.exports = {
  initializeGame,
  createGameSpace,
  playerRoll,
  stopGame,
  startGameUpdate,
  handleRolledRecently,
  gameState: state,
}
