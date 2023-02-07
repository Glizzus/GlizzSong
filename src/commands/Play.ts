import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import Command, { CommandHandler } from "./Command";
import YoutubeHandler from "../YoutubeHandler";
import GlizzPlayer from "../GlizzPlayer";

const player = new GlizzPlayer();
player.on('error', console.error);

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Streams audio from Youtube URL")
  .addStringOption((option) => 
    option.setName('url')
      .setDescription("The URL of the video to play")
      .setRequired(true)
  );

async function getUrl(lookup: string) {
  try {
    return new URL(lookup);
  } catch (err) {
    return YoutubeHandler.getUrl(lookup);
  }
}

const playHandler: CommandHandler = async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const userId = interaction.member?.user.id;
  if (!userId) {
    return;
  }
  const { guild } = interaction;
  if (!guild) {
    return;
  }
  const member = interaction.guild?.members.cache.get(userId);
  if (!member) {
    return;
  }
  const { channelId } = member?.voice;
  if (!channelId) {
    return;
  }
  const { voiceAdapterCreator, id } = guild;
  const connection = joinVoiceChannel({
    channelId,
    guildId: id,
    adapterCreator: voiceAdapterCreator
  });
  const lookup = interaction.options.getString("url");
  if (!lookup) {
    interaction.reply({ content: 'That URL does not exist', ephemeral: true });
    return;
  }
  player.connect(connection);
  const url = await getUrl(lookup);
  player.playNext(url);
}

const Play: Command = [data, playHandler];
export default Play;