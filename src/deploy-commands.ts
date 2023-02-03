import { REST, Routes } from 'discord.js';
import CommandsMap from './commands/CommandsMap';
import Config from './Config';

const rest = new REST({ version: '10' }).setToken(Config.token);

async function main() {
  try {
    const { serverId, applicationId } = Config;
    await rest.put(Routes.applicationGuildCommands(applicationId, serverId), {
      body: Array.from(CommandsMap.keys()).map((builder) =>  builder.toJSON!())
    })
  } catch (err) {
    console.error(err);
  }
}

main();