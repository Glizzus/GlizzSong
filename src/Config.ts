import dotenv from 'dotenv';

class ConfigProvider {
  serverId: string;
  token: string;
  applicationId: string;
  youtubeKey: string;

  constructor() {
    dotenv.config();
    const { env } = process;
    this.serverId = env['SERVER_ID']!;
    this.token = env['TOKEN']!;
    this.applicationId = env['APPLICATION_ID']!;
    this.youtubeKey = env['YOUTUBE_API_KEY']!;
  }
}

const Config = new ConfigProvider();
export default Config;