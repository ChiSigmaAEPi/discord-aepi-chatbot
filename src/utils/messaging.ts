import { TextChannel, User } from 'discord.js';
import { channels } from '../constants/all';

/**
 * Send a message to the #join-interests-here channel, returning the sent message.
 * NOTE: the **** is necessary for parsing the channel id in other functions
 * @param channel - the channel to format
 */
export const sendNewInterestMessage = async (channel: TextChannel) => {
  // find the join interests here channel
  const joinInterestsChannel = <TextChannel | null>(
    channel.guild?.channels.cache.find(
      (ch) => ch.name === channels.JOIN_INTERESTS && ch.type === 'text',
    )
  );

  // handle null channel (probably a not founded channel)
  if (!joinInterestsChannel) {
    throw Error(
      "Can't find the join-interests-here channel (the name was probably changed)",
    );
  }

  // send the message
  await joinInterestsChannel
    .send(`Interested in **${channel}**? Join by adding a 👍 reaction!`)
    .then((joinMessage) => joinMessage.react('👍'));
};

export const sendWelcomeMessage = (channel: TextChannel, user: User) =>
  channel.send(`${user} just joined! Welcome!`);
