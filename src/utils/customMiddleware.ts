import { Client, Message, MessageReaction, User } from 'discord.js';

const isCommand = (message: Message, command: string) =>
  message.content.startsWith(`?${command} `) ||
  message.content.startsWith(`!${command} `) ||
  message.content.startsWith(`/${command} `);

/**
 * Custom middleware for commands
 * @param client - the client (i.e. chatbot)
 * @param command - the command you want (exclude !,/,?)
 * @param numReqArguments - the number of arguments that are required (haven't handled optional arguments yet)
 * @param next - the function you want to call
 */
// eslint-disable-next-line import/prefer-default-export
export const onCommand = (
  client: Client,
  command: string,
  numReqArguments: number,
  next: (message: Message, args: string[]) => void,
) => {
  client.on('message', (message: Message) => {
    // check the command
    if (!isCommand(message, command)) return;

    // check arguments
    const splitMessage = message.content.split(' ');
    if (numReqArguments > 0 && splitMessage.length < numReqArguments + 1) {
      message.reply('Wrong number of arguments!');
      return;
    }

    next(message, splitMessage.slice(1));
  });
};

interface Partial {
  partial: boolean;
  fetch: () => Promise<MessageReaction | User>;
}
export const getComplete = async (potentialPartial: Partial) => {
  // get the full reaction if needed
  try {
    return await potentialPartial.fetch();
  } catch (err) {
    console.error(`Error fetching the partial: ${err}`);
    throw err;
  }
};
