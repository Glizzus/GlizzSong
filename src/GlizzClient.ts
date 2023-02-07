import { Client, ClientOptions, Collection, Events } from "discord.js";
import { CommandHandler } from "./commands/Command";
import Play from "./commands/Play";

export default class GlizzClient extends Client {
  commands: Collection<string, CommandHandler>;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.loadCommands();
    this.defineEvents();
  }

  loadCommands() {
    for (const command of [Play]) {
      console.log(command[0].name);
      const [ { name }, handler ] = command;
      this.commands.set(name, handler);
    }
  }

  defineEvents() {

    this.once(Events.ClientReady, (client) => {
      console.log(`Ready! Logged in as ${client.user.tag}`);
    });

    this.on(Events.Error, console.error);

    this.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.commands.get(interaction.commandName);
      if (!command) {
        return;
      }

      try {
        await command(interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({ content: "ERROR", ephemeral: true });
      }
    })
  }
}

