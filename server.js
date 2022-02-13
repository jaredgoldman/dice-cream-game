require("dotenv").config()

const token = process.env.DISCORD_TOKEN
// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js")
// const { removeAllListeners } = require("process")
const { initializeGame, playerRoll, state } = require("./app.js")

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!")
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return
  const { commandName } = interaction
  if (commandName === "start") {
    initializeGame(4200, 10000)
    await interaction.reply("Game started!")
  }
  if (commandName === "roll") {
    const rollNumber = playerRoll()
    await interaction.reply(`you rolled the number ${rollNumber}`)
  }
})

// Login to Discord with your client's token
client.login(token)
