import { MessageReaction, TextChannel, User } from 'discord.js';
import { sendWelcomeMessage } from '../utils/messaging';

const joinInterestReact = async (reaction: MessageReaction, user: User) => {
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

    // give user read access and send a welcome message
    await channel.updateOverwrite(user, { VIEW_CHANNEL: true });
    sendWelcomeMessage(channel, user);
  } catch (err) {
    console.log(`Couldn't handle the react: ${err}`);
  }
};

export default joinInterestReact;
