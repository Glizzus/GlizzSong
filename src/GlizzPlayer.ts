import { AudioPlayer, CreateAudioPlayerOptions, createAudioResource, VoiceConnection } from "@discordjs/voice";
import ytdl from "ytdl-core";


export default class GlizzPlayer extends AudioPlayer {

  private connections: VoiceConnection[] = [];

  public constructor(options?: CreateAudioPlayerOptions) {
    super(options);
    this.defineEvents();
  }

  public defineEvents() {
    this.on('error', console.error);
  }

  private static getResource(url: URL) {
    const { href } = url;
    const stream = ytdl(href, {
      filter: 'audioonly',
      quality: 'lowestaudio'
    });
    return createAudioResource(stream);
  }

  public playNext(url: URL) {
    this.play(GlizzPlayer.getResource(url))
  }

  public connect(connection: VoiceConnection) {
    connection.subscribe(this);
    this.connections.push(connection)
  }
}