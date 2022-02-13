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
    .setDescription("initializes dice cream"),
].map((command) => command.toJSON())

const rest = new REST({ version: "9" }).setToken(token)

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error)
