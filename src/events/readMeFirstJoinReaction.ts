import { MessageReaction, TextChannel, User } from 'discord.js';
import { Indicator } from '../constants/all';
import { extractId } from '../utils/all';
import { sendWelcomeMessage } from '../utils/messaging';

/**
 * The functions only work for the following formatted messages within the read-me-first-bitches channel:
 * **:emojiNameHere: #channel-name-here**
 * Example: **:one: #basketball**
 * Note: the ** will disappear in discord when the message is sent
 * @param reaction - the reaction made on the message
 * @param user - the user who made the reaction
 */
const readMeFirstJoinReaction = async (
  reaction: MessageReaction,
  user: User,
) => {
  const { message } = reaction;

  // get the list of channels and then find the chosen channel name
  const selectableChannels = message.content
    .split(Indicator.Bold)
    .filter((line) => line.includes(Indicator.Channel)) // filter out lines that don't include channels
    // get the emojis and channels for each line that includes a channel (of the format in the description)
    .map((line) => {
      const emoji = line.substring(0, 3);
      const channel =
        Indicator.EmbedStart +
        Indicator.Channel +
        extractId(line.split(Indicator.Channel)[1]) +
        Indicator.EmbedEnd;

      return { emoji, channel };
    })
    .filter(({ emoji, channel }) => emoji && channel);

  const channelString = selectableChannels.find(
    (channel) => channel.emoji === reaction.emoji.toString(),
  )?.channel;

  // get channel, guve user access, and send welcome message
  try {
    if (!channelString) throw Error('channelString is undefined');

    const channel = message.guild?.channels.cache.find(
      (ch) => ch.toString() === channelString && ch.type === 'text',
    ) as TextChannel | undefined;
    if (!channel) throw Error('channel is undefined');

    await channel.updateOverwrite(user, { VIEW_CHANNEL: true });
    sendWelcomeMessage(channel, user);
  } catch (err) {
    console.log(`Couldn't handle the react: ${err}`);
  }
};

export default readMeFirstJoinReaction;
