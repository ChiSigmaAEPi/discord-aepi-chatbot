import { Message, TextChannel, User } from 'discord.js';

export const AEPI_GUILD_NAME = 'AEPi Chi Sigma';
export const JOIN_INTERESTS_CHANNEL = 'join-interests-here';

const channelPre = '║╶╴';
const channelPost = '╶╴║';

export const formatCategoryName = (name: string) =>
  `${channelPre}${name}${channelPost}`;

export const isCommand = (message: Message, command: string) =>
  message.content.startsWith(`?${command} `) ||
  message.content.startsWith(`!${command} `) ||
  message.content.startsWith(`/${command} `);

// the **** is necessary for parsing the channel id in other functions
export const formatNewInterest = (channel: TextChannel) =>
  `Interested in **${channel}**? Join by adding a 👍 reaction!`;

export const welcomeNewMember = (channel: TextChannel, user: User) =>
  channel.send(`${user} just joined! Welcome!`);

export const INTERESTS_CATEGORY = formatCategoryName('interests');
