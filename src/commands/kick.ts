// import client from '../index';
import { onCommand } from '../index';

// client.on('message', async (message) => {
//   if (!message.content.startsWith('!kick')) return;

//   const member = message.mentions.members?.first()
//   if (!member) {
//     message.reply(
//       'Who are you trying to kick? You must mention a user.'
//     );
//     return;
//   }
  
//   if (!member.kickable) {
//     message.reply("I can't kick this user. Sorry!");
//     return;
//   }

//   try {
//     await member.kick();
//     message.reply(`${member.user.tag} was kicked.`);
//   } catch (err) {
//     message.reply('Sorry, an error occured.');
//   }
// });