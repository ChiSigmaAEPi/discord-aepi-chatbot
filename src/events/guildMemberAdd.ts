import { Client, Message } from 'discord.js';
import client from '../index';

client.on("guildMemberAdd", (member) => {
  member.send(`Waddup bro. Who do you know here?!?`);
});