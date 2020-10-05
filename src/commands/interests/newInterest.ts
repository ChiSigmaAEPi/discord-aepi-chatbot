import { Message } from 'discord.js';
import { formatChannelName, isCommand } from '../../constants/constants';
import { onCommand } from '../../index';

onCommand('new-interest', 1, async (message, args)=> {
  // make a new text channel with the name of whatever is passed in, and put the author in the channel
  console.log('in new interest');
  const name = args[1];
  try {
    await message.guild?.channels.create(name, { parent: formatChannelName('interests') });
    message.reply('Interest created!');
  } catch (err) {
    message.reply('Error in creating the interest :(');
  }
});



// client.on('message', async (message) => {
//   // check correct arguments
//   if (!isCommand(message, 'new-interest')) return;

//   const splitMessage = message.content.split(" ");
//   if (splitMessage.length != 2) {
//     if (splitMessage.length > 2) {
//       message.reply(
//         'No spaces can be in channel names. Use dashes instead: channel-name-example'
//       );
//     } else {
//       message.reply('Missing new interest name.');
//     }
//     return;
//   }
  
//   // make a new text channel with the name of whatever is passed in, and put the author in the channel
//   const name = splitMessage[1];
//   try {
//     await message.guild?.channels.create(name, { parent: formatChannelName('interests') });
//     message.reply('Interest created!');
//   } catch (err) {
//     message.reply('Error in creating the interest :(');
//   }
// });