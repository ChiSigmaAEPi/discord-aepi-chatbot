import { Message, User } from 'discord.js';

const channelPre = '║╶╴';
const channelPost = '╶╴║';

export const formatCategoryName = (name: string) =>
  `${channelPre}${name}${channelPost}`;

export const isCommand = (message: Message, command: string) =>
  message.content.startsWith(`?${command} `) ||
  message.content.startsWith(`!${command} `) ||
  message.content.startsWith(`\\${command} `);

export const formatNewInterest = (name: string) =>
  `Are you interested in **${name}**? Join by adding a 👍 reaction!`;

export const welcomeNewMember = (name: User) => `${name} just joined! Welcome!`;
