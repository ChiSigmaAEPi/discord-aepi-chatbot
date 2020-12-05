import { config } from 'dotenv';
import { Client, MessageReaction, User } from 'discord.js';
import { Channels } from './constants/all';
import { onCommand } from './utils/all';
import joinInterestReact from './events/joinInterestReact';
import handleNewInterestCommand from './commands/interests/newInterest';
import { getComplete } from './utils/customMiddleware';
import leaveInterestReact from './events/leaveInterestReact';
import readMeFirstJoinReaction from './events/readMeFirstJoinReaction';
import readMeFirstLeaveReaction from './events/readMeFirstLeaveReaction';

config();

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'USER', 'REACTION'], // need partials to handle uncached messages' reactions
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
    const reaction = await getComplete<MessageReaction>(
      potentialPartialReaction,
    );
    const user = await getComplete<User>(potentialPartialUser);

    // only handle text channels and non-bot reacts
    if (reaction.message.channel.type !== 'text' || user.bot) {
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
    const reaction = await getComplete<MessageReaction>(
      potentialPartialReaction,
    );
    const user = await getComplete<User>(potentialPartialUser);

    // only handle text channels and non-bot reacts
    if (reaction.message.channel.type !== 'text' || user.bot) {
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
  .catch((err) => {
    console.log(`Error while logging in: ${err}`);
    throw err;
  });
