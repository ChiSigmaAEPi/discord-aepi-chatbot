import { MessageReaction, TextChannel, User } from 'discord.js';
import { Indicator } from '../constants/all';
import { sendWelcomeMessage } from '../utils/messaging';

// TODO need to specify the thumbs up react
const joinInterestReact = async (reaction: MessageReaction, user: User) => {
  const { message } = reaction;

  // get the interest channel
  const channelString = message.content.split(Indicator.Bold)[1];

  // get channel
  try {
    const channel = message.guild?.channels.cache.find(
      (ch) => ch.toString() === channelString && ch.type === 'text',
    ) as TextChannel | undefined;
    if (!channel) throw Error('channel is undefined');

    // give user read access and send a welcome message
    await channel.updateOverwrite(user, { VIEW_CHANNEL: true });
    sendWelcomeMessage(channel, user);
  } catch (err) {
    console.log(`Couldn't handle the react: ${err}`);
  }
};

export default joinInterestReact;
