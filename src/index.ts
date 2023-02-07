import { GatewayIntentBits } from 'discord.js';
import Config from './Config';
import GlizzClient from './GlizzClient';

const client = new GlizzClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
})

client.login(Config.token); 