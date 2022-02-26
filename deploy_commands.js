require("dotenv").config()
const { SlashCommandBuilder } = require("@discordjs/builders")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const clientId = process.env.DISCORD_CLIENT_ID
const guildId = process.env.DISCORD_GUILD_ID
const token = process.env.DISCORD_TOKEN

const commands = [
  new SlashCommandBuilder()
    .setName("start")
    .setDescription("initializes dice cream")
    .addNumberOption((option) =>
      option
        .setName("lucky_number")
        .setDescription("the winning number!")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("range")
        .setDescription("numbers will be rolled up to this number")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("timeout")
        .setDescription("number of seconds between rolls for a single user")
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName("stop").setDescription("stops the game"),
].map((command) => command.toJSON())

const rest = new REST({ version: "9" }).setToken(token)

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error)
