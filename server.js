require("dotenv").config()
const roleId = process.env.DISCORD_HOST_ID
const token = process.env.DISCORD_TOKEN
const artistId = process.env.ARTIST_DISCORD_ID
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

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] })

const customEmojis = {
  TopDog: client.emojis.cache.find(emoji => emoji.name === 'TopDog'),
  LaughingRandy: client.emojis.cache.find(emoji => emoji.name === 'LaughingRandy'),
  peperain: client.emojis.cache.find(emoji => emoji.name === 'peperain'),
  veryangry: client.emojis.cache.find(emoji => emoji.name === 'veryangry'),
  bongocat: client.emojis.cache.find(emoji => emoji.name === 'bongocat'),
  spy: client.emojis.cache.find(emoji => emoji.name === 'spy'),
  screamloop: client.emojis.cache.find(emoji => emoji.name === 'screamloop'),
  freakeyebrows: client.emojis.cache.find(emoji => emoji.name === 'freakeyebrows'),
  footlicker: client.emojis.cache.find(emoji => emoji.name === 'footlicker')
}

const losingMessages = [
  customEmojis.LaughingRandy + ' hahahahaha! roll again and again and again ' + customEmojis.LaughingRandy,
  customEmojis.peperain + ' cry me a river, try again ' + customEmojis.peperain,
  customEmojis.veryangry + ' smash another roll ' + customEmojis.veryangry,
  customEmojis.bongocat + ' come on come on come on! AGAIN! ' + customEmojis.bongocat,
  customEmojis.spy + ' how many more times do you have to roll those dice? '+ customEmojis.spy
]

const winningMessages = [
  customEmojis.screamloop + customEmojis.screamloop + customEmojis.screamloop + ` BIG WIN! DM <@${artistId}> to claim ` + customEmojis.screamloop + customEmojis.screamloop + customEmojis.screamloop,
  customEmojis.freakeyebrows + ' WINNER WINNER CHICKEN DINNER ' + customEmojis.freakeyebrows,
  customEmojis.footlicker + ' Licked it good! Congrats! ' + customEmojis.footlicker,
  customEmojis.TopDog + ' Top Dog in the house, congrats ' + customEmojis.TopDog
]
/*
: screamloop: : screamloop: : screamloop: BIG WIN! DM @Randyal to claim : screamloop: : screamloop: : screamloop: 
: freakeyebrows: WINNER WINNER CHICKEN DINNER : freakeyebrows:
: footlicker: Licked it good! Congrats! : footlicker:
: TopDog: Top Dog in the house, congrats : TopDog:
*/
// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Dice cream ready!")
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  // if (!interaction.member._roles.includes(roleId)) return

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
    gameState.gameSpaceMessage = await interaction.reply(gameSpace)
    // start updating gamespace regularely
    startGameUpdate()
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
      let randomWinMessage = winningMessages[Math.floor(Math.random() * winningMessages.length)]
      let message = `you rolled the number ${rollNumber}.\n` + randomWinMessage
      await interaction.reply({
        content: message,
        ephemeral: true,
      })
      return
    }

    let userTimeOut = gameState.timeOutInterval / 1000
    let randomLoseMessage = losingMessages[Math.floor(Math.random()* losingMessages.length)]
    await interaction.reply({
      content: `you rolled the number ${rollNumber}.\n` + randomLoseMessage + `\nPlease wait ${userTimeOut} seconds to roll again.`,
      ephemeral: true,
    })
    // edit replies to keep refresh rate and roll number visible
    while (userTimeOut > 0) {
      await wait(1000)
      userTimeOut--
      await interaction.editReply(
        message
      )
      if (userTimeOut === 0) {
        message = `you rolled the number ${rollNumber}.\n` + randomLoseMessage + `\nTime to Roll again!`
        await interaction.editReply(
          message
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
