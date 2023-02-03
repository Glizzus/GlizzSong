import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection, AudioPlayerStatus } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import Command, { CommandHandler } from "./Command";
import startStreaming from "../MusicPlayer";
import { youtube } from '@googleapis/youtube';
import Config from "../Config";
import ytdl from "ytdl-core";
import Queue from "../Queue";

const player = createAudioPlayer({});
player.on('error', console.error);

const songs = new Queue<URL>();

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Streams audio from Youtube URL")
  .addStringOption((option) => 
    option.setName('url')
      .setDescription("The URL of the video to play")
      .setRequired(true)
  );

async function search(lookup: string) {
  const { data } = await youtube('v3').search.list({
    part: ['id', 'snippet'],
    q: lookup,
    key: Config.youtubeKey
  });
  return data.items![0].id?.videoId;
}

async function getUrl(lookup: string) {
  try {
    return new URL(lookup);
  } catch (err) {
    const videoId = await search(lookup);
    if (!videoId) {
      throw new Error("ERROR");
    }
    return new URL(`https://www.youtube.com/watch?v=${videoId}`);
  }
}

function getResource() {
  const stream = ytdl(songs.dequeue().href, {
    filter: 'audioonly',
    quality: 'lowestaudio'
  });
  return createAudioResource(stream);
}

async function stream(connection: VoiceConnection, url: URL) {
  songs.enqueue(url);
  connection.subscribe(player)
  player.play(getResource());
  player.on(AudioPlayerStatus.Idle, () => {
    player.play(getResource())
  })
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
  const url = await getUrl(lookup);
  await stream(connection, url);
  await interaction.reply({ content: `Playing ${url}` });
}

const Play: Command = [data, playHandler];
export default Play;