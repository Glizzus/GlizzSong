import { AudioPlayer, createAudioResource, VoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';

type StreamOptions = {
  player: AudioPlayer,
  connection: VoiceConnection,
  url: URL 
};

async function startStreaming(options: StreamOptions) {
  const { player } = options;
  options.connection.subscribe(player)
  const stream = ytdl(options.url.href, {
    filter: 'audioonly',
    quality: 'lowestaudio'
  });
  const resource = createAudioResource(stream);
  player.play(resource);
}

export default startStreaming;


