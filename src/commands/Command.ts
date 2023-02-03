import { Interaction, SlashCommandBuilder } from "discord.js";

export type CommandHandler = (message: Interaction) => Promise<void>;
type Command = [Partial<SlashCommandBuilder> & Pick<SlashCommandBuilder, 'name' | 'description'>, CommandHandler]
export default Command;
