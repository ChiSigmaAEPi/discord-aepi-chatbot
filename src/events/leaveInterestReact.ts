import { MessageReaction, TextChannel, User } from 'discord.js';
import { sendGoodbyeMessage } from '../utils/all';

const leaveInterestReact = async (reaction: MessageReaction, user: User) => {
  const { message } = reaction;

  // get the interest channel
  const channelString = message.content.split('**')[1];

  // get channel
  try {
    const channel = <TextChannel | undefined>(
      message.guild?.channels.cache.find(
        (ch) => ch.toString() === channelString && ch.type === 'text',
      )
    );
    if (!channel) throw Error('channel is undefined');

    // take away user's read access and send a 'left' message
    await channel.updateOverwrite(user, { VIEW_CHANNEL: false });
    sendGoodbyeMessage(channel, user);
  } catch (err) {
    console.log(`Couldn't handle the react: ${err}`);
  }
};

export default leaveInterestReact;
