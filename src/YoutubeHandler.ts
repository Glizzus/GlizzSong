import { youtube } from "@googleapis/youtube";
import Config from "./Config";

export default class YoutubeHandler {

  private static async getIdByLookup(lookup: string) {
    const { data } = await youtube('v3').search.list({
      part: ['id', 'snippet'],
      q: lookup,
      key: Config.youtubeKey
    });
    const { videoId } = data.items![0].id!;
    return videoId;
  }

  public static async getUrl(lookup: string) {
    const videoId = await this.getIdByLookup(lookup);
    return new URL(`https://www.youtube.com/watch?v=${videoId}`);
  }

}