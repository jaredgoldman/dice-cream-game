require("dotenv").config()

const token = process.env.DISCORD_TOKEN
// Require the necessary discord.js classes
const { Client, Intents, MessageActionRow, MessageButton} = require("discord.js")

const wait = require('util').promisify(setTimeout)

// const { removeAllListeners } = require("process")
const { initializeGame, playerRoll, stopGame, startGameUpdate, gameState, gameSpace } = require("./app.js")

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!")
})

let gameSpaceMessage;

const rolledRecently = new Set();
const timeOutInterval = 12000;


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
    const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('roll')
            .setLabel(`Roll 🎲`)
            .setStyle('PRIMARY'),
        );
    gameSpaceMessage = await interaction.reply({ components: [row], embeds: [gameState.gameSpace], fetchReply: true});
    startGameUpdate(gameSpaceMessage);

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
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton) return;
    const { user } = interaction
    if (interaction.customId === "roll") {
      if (gameState.isActive) {
        if (rolledRecently.has(user.id)) {
          await interaction.reply({
            content: "Ah ah, wait your turn!",
            ephemeral: true,
          }); 
          return;
        }
        rolledRecently.add(user.id);
        setTimeout(() => {
          rolledRecently.delete(user.id);
        }, timeOutInterval);
        const { rollNumber, isWin } = playerRoll(user)
        if (isWin) {
          await interaction.reply( {
           content: `you rolled the number ${rollNumber} and WON!!!`,
           ephemeral: true,
          })
        } else {
          let userTimeOut = timeOutInterval / 1000; 
          await interaction.reply({
              content: `you rolled the number ${rollNumber}. Please wait ${userTimeOut} seconds to roll again.`,
              ephemeral: true,
            })
          while ( userTimeOut > 0) {
            await wait(1000);
            userTimeOut--;
            await interaction.editReply(`you rolled the number ${rollNumber}. Please wait ${userTimeOut} seconds to roll again.`);
          }
          
                
        }
      } else {
        await interaction.reply({
          content: `the game hasn't started yet!`,
          ephemeral: true,
        })
      }
    }
})
// Login to Discord with your client's token
client.login(token)

