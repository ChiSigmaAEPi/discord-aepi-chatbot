import dotenv from 'dotenv';
import { Client, MessageReaction, User } from 'discord.js';
import { channels } from './constants/all';
import { onCommand } from './utils/all';
import joinInterestReact from './events/joinInterestReact';
import handleNewInterestCommand from './commands/interests/newInterest';
import { getComplete } from './utils/customMiddleware';
import leaveInterestReact from './events/leaveInterestReact';

dotenv.config();

const client = new Client({ partials: ['MESSAGE', 'REACTION'] });

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
    const reaction = <MessageReaction>(
      await getComplete(potentialPartialReaction)
    );
    const user = <User>await getComplete(potentialPartialUser);

    // only handle text channels and non-bot reacts
    if (reaction.message.channel.type !== 'text' || user.id === client.user?.id)
      return;

    // handle the reaction depending on which channel it was in
    switch (reaction.message.channel.name) {
      case channels.JOIN_INTERESTS:
        joinInterestReact(reaction, user);
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
    const reaction = <MessageReaction>(
      await getComplete(potentialPartialReaction)
    );
    const user = <User>await getComplete(potentialPartialUser);

    // only handle text channels and non-bot reacts
    if (reaction.message.channel.type !== 'text' || user.id === client.user?.id)
      return;

    // handle the reaction depending on which channel it was in
    switch (reaction.message.channel.name) {
      case channels.JOIN_INTERESTS:
        leaveInterestReact(reaction, user);
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

// TODO:
// - need to add functionality where if users un-react the message, they then leave the chat
