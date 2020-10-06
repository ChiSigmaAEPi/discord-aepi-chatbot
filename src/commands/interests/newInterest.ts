import { Message, TextChannel } from 'discord.js';
import { categories, channels } from '../../constants/all';
import { sendNewInterestMessage } from '../../utils/messaging';

const handleNewInterestCommand = async (message: Message, args: string[]) => {
  // get the interest name and interests category
  const interestName = args[0];
  const category = message.guild?.channels.cache.find(
    (cat) => cat.name === categories.INTERESTS_CATEGORY,
  );

  // create the new channel in the interests category, with only the new user
  let newChannel: TextChannel | undefined;
  try {
    newChannel = await message.guild?.channels.create(interestName, {
      type: 'text',
      parent: category?.id,
      permissionOverwrites: [
        { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
        { id: message.author.id, allow: ['VIEW_CHANNEL'] },
      ],
    });

    if (!newChannel) throw Error('the new channel is undefined');
  } catch (err) {
    message.reply(`Error in creating the interest :( ${err}`);
    return;
  }

  try {
    // add the new interest to the #join-interests-here channel, so anyone can join it
    await sendNewInterestMessage(newChannel);

    // send success messages
    newChannel.send(`${message.author} channel was created!`);
    message.reply('interest created!');
  } catch (err) {
    // send fail message
    message.reply(
      `was able to create the interest, but couldn't add a join-message to the
      #${channels.JOIN_INTERESTS} channel :( ask Amit to take a look at what happened, error: ${err}`,
    );
  }
};

export default handleNewInterestCommand;
