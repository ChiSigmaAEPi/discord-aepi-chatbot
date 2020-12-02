import dotenv from 'dotenv';
import { Client, MessageReaction, User } from 'discord.js';
import { Channels } from './constants/all';
import { onCommand } from './utils/all';
import joinInterestReact from './events/joinInterestReact';
import handleNewInterestCommand from './commands/interests/newInterest';
import { getComplete } from './utils/customMiddleware';
import leaveInterestReact from './events/leaveInterestReact';
import readMeFirstJoinReaction from './events/readMeFirstJoinReaction';
import readMeFirstLeaveReaction from './events/readMeFirstLeaveReaction';

dotenv.config();

const client = new Client({ partials: ['MESSAGE', 'REACTION'] });

client.on('shardError', (err) => {
  console.error('A websocket connection encountered an error:', err);
});

/**
 * Commands go here
 */
onCommand(client, 'new-interest', 1, handleNewInterestCommand);

/**
 * Handle reacts to messages
 */
client.on(
  'messageReactionAdd',
  async (potentialPartialReaction, potentialPartialUser) => {
    // get the full reaction/user
    const reaction = (await getComplete(
      potentialPartialReaction,
    )) as MessageReaction;
    const user = (await getComplete(potentialPartialUser)) as User;

    // only handle text channels and non-bot reacts
    if (
      reaction.message.channel.type !== 'text' ||
      user.id === client.user?.id
    ) {
      return;
    }

    // handle the reaction depending on which channel it was in
    switch (reaction.message.channel.name) {
      case Channels.JoinInterest:
        joinInterestReact(reaction, user);
        break;

      case Channels.ReadMeFirst:
        readMeFirstJoinReaction(reaction, user);
        break;
    }
  },
);

/**
 * Handle unreacts to messages
 */
client.on(
  'messageReactionRemove',
  async (potentialPartialReaction, potentialPartialUser) => {
    // get the full reaction/user
    const reaction = (await getComplete(
      potentialPartialReaction,
    )) as MessageReaction;
    const user = (await getComplete(potentialPartialUser)) as User;

    // only handle text channels and non-bot reacts
    if (
      reaction.message.channel.type !== 'text' ||
      user.id === client.user?.id
    ) {
      return;
    }

    // handle the reaction depending on which channel it was in
    switch (reaction.message.channel.name) {
      case Channels.JoinInterest:
        leaveInterestReact(reaction, user);
        break;

      case Channels.ReadMeFirst:
        readMeFirstLeaveReaction(reaction, user);
        break;
    }
  },
);

/**
 * Login
 */
client
  .login(process.env.BOT_TOKEN)
  .then(() => {
    console.log('Successfully logged in!');
  })
  .catch((err) => console.log(`Error while logging in: ${err}`));
