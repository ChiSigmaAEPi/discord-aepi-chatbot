import { MessageReaction, TextChannel, User } from 'discord.js';
import { Indicator } from '../constants/all';
import { sendGoodbyeMessage } from '../utils/all';

const leaveInterestReact = async (reaction: MessageReaction, user: User) => {
  const { message } = reaction;

  // get the interest channel
  const channelString = message.content.split(Indicator.Bold)[1];

  // get channel, remove user read access, and send a left message
  try {
    const channel = message.guild?.channels.cache.find(
      (ch) => ch.toString() === channelString && ch.type === 'text',
    ) as TextChannel | undefined;
    if (!channel) throw Error('channel is undefined');

    await channel.updateOverwrite(user, { VIEW_CHANNEL: false });
    sendGoodbyeMessage(channel, user);
  } catch (err) {
    console.log(`Couldn't handle the react: ${err}`);
  }
};

export default leaveInterestReact;
