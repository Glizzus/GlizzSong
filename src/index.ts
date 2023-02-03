import { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus, AudioPlayerStatus } from '@discordjs/voice';
import { Client, Events, GatewayIntentBits, GuildDefaultMessageNotifications, Message } from 'discord.js';
import Config from './Config';
import Play from './commands/Play';
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