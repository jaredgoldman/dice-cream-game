require("dotenv").config()

const token = process.env.DISCORD_TOKEN
// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js")
// const { removeAllListeners } = require("process")
const { initializeGame, playerRoll, stopGame, gameState } = require("./app.js")

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!")
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return
  const {
    commandName,
    user,
    options: { _hoistedOptions },
  } = interaction

  const [luckyNumber, range] = _hoistedOptions

  if (commandName === "start") {
    stopGame()
    initializeGame(luckyNumber.value, range.value)
    await interaction.reply("Game started!")
  }

  if (commandName === "roll") {
    if (gameState.isActive) {
      const { rollNumber, isWin } = playerRoll(user)

      if (isWin) {
        await interaction.reply(
          `you rolled the number ${rollNumber} and WON!!!`
        )
      } else {
        await interaction.reply(`you rolled the number ${rollNumber}`)
      }
    } else {
      await interaction.reply(`the game hasn't started yet!`)
    }
  }
})

// Login to Discord with your client's token
client.login(token)
