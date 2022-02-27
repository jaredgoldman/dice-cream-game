require("dotenv").config()
const roleId = process.env.DISCORD_HOST_ID
const token = process.env.DISCORD_TOKEN
const { Client, Intents } = require("discord.js")
const wait = require("util").promisify(setTimeout)
const {
  initializeGame,
  playerRoll,
  stopGame,
  startGameUpdate,
  gameState,
  createGameSpace,
  handleRolledRecently,
} = require("./app.js")

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Dice cream ready!")
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  if (!interaction.member._roles.includes(roleId)) return

  const {
    commandName,
    options: { _hoistedOptions },
  } = interaction
  const [luckyNumber, range, timeout] = _hoistedOptions

  if (commandName === "start") {
    // stop game if game is running already
    stopGame()
    // initialize state
    initializeGame(luckyNumber.value, range.value, timeout.value)
    // created gamespace with embeds and button
    const gameSpace = createGameSpace()
    // send gamespace to server and gamespace back to app
    const gameSpaceMessage = await interaction.reply(gameSpace)
    // start updating gamespace regularely
    startGameUpdate(gameSpaceMessage)
  }
  if (commandName === "stop") {
    stopGame()
    interaction.reply({
      content: "Game stopped",
      ephemeral: true,
    })
  }
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId !== "roll") return
  const { user } = interaction

  if (gameState.isActive) {
    if (gameState.rolledRecently.has(user.id)) {
      await interaction.reply({
        content: "Ah ah, wait your turn!",
        ephemeral: true,
      })
      return
    }

    handleRolledRecently(user)

    const { rollNumber, isWin } = playerRoll(user)

    if (isWin) {
      await interaction.reply({
        content: `you rolled the number ${rollNumber} and WON!!!`,
        ephemeral: true,
      })
      return
    }

    let userTimeOut = gameState.timeOutInterval / 1000

    await interaction.reply({
      content: `you rolled the number ${rollNumber}. Please wait ${userTimeOut} seconds to roll again.`,
      ephemeral: true,
    })
    // edit replies to keep refresh rate and roll number visible
    while (userTimeOut > 0) {
      await wait(1000)
      userTimeOut--
      await interaction.editReply(
        `you rolled the number ${rollNumber}. Please wait ${userTimeOut} seconds to roll again.`
      )
      if (userTimeOut === 0) {
        await interaction.editReply(
          `you rolled the number ${rollNumber}. Time to Roll again!`
        )
      }
    }
  } else {
    await interaction.reply({
      content: `the game hasn't started yet!`,
      ephemeral: true,
    })
  }
})
// Login to Discord with your client's token
client.login(token)
