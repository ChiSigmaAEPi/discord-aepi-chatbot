import dotenv from 'dotenv';
import { Client, MessageReaction, User } from 'discord.js';
import { channels } from './constants/all';
import { onCommand } from './utils/all';
import joinInterestReact from './events/joinInterestReact';
import handleNewInterestCommand from './commands/interests/newInterest';

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
    // get the full reaction if needed
    let reaction: MessageReaction;
    if (potentialPartialReaction.partial) {
      try {
        reaction = await potentialPartialReaction.fetch();
      } catch (err) {
        console.error(`Error fetching the reaction: ${err}`);
        return;
      }
    } else {
      reaction = <MessageReaction>potentialPartialReaction;
    }

    // get the full user if needed
    let user: User;
    if (potentialPartialUser.partial) {
      try {
        user = await potentialPartialUser.fetch();
      } catch (err) {
        console.error(`Error while fetching the reaction: ${err}`);
        return;
      }
    } else {
      user = <User>potentialPartialUser;
    }

    const { message } = reaction;

    // only handle text channels and non-bot reacts
    if (message.channel.type !== 'text' || user.id === client.user?.id) return;

    // handle the reaction depending on which channel it was in
    switch (message.channel.name) {
      case channels.JOIN_INTERESTS:
        joinInterestReact(reaction, user);
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
