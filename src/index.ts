import dotenv from 'dotenv';
import { Client, Message, TextChannel } from 'discord.js';
import {
  formatCategoryName,
  formatNewInterest,
  welcomeNewMember,
  isCommand,
} from './constants/constants';

dotenv.config();

const client = new Client();

client.on('message', (message: Message) => {
  console.log('Message received! Contents: ', message.content);
});

const onCommand = (
  command: string,
  numReqArguments: number,
  next: (message: Message, args: string[]) => void,
) => {
  console.log('in onCommand before on message');
  client.on('message', (message: Message) => {
    console.log('in onCommand');
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

// login
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log('Successfully logged in!'))
  .catch((err) => console.log(`Error in logging in: ${err}`));

// test new-interest command
// TODO still need to figure out how to do it well
onCommand('new-interest', 1, async (message, args) => {
  // get the interest name and category where it belongs
  const interestName = args[0];
  const category = message.guild?.channels.cache.find(
    (cat) => cat.name === formatCategoryName('interests'),
  );

  // create the new channel, with only the new user in it
  let newChannel: TextChannel | undefined;
  try {
    newChannel = await message.guild?.channels.create(interestName, {
      type: 'text',
      parent: category?.id,
      permissionOverwrites: [
        { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
        { id: message.author.id, allow: ['VIEW_CHANNEL'] },
      ],
    });
  } catch (err) {
    message.reply(`Error in creating the interest :( ${err}`);
    return;
  }

  // add the new interest to the #join-interests-here channel, so anyone can join it
  try {
    // find the #join-interests-channel
    const joinInterestsChannel = <TextChannel | null>(
      await message.guild?.channels.cache.find(
        (channel) =>
          channel.name === 'join-interests-here' && channel.type === 'text',
      )
    );

    // add the new interest to the #join-interests-channel
    const joinMessage = await joinInterestsChannel?.send(
      formatNewInterest(interestName),
    );
    joinMessage?.react('👍');

    // setup the react collector for this message (need a thumbs up reaction,
    // and ignore reactions from the bot and the creator of the channel)
    const reactCollector = joinMessage?.createReactionCollector(
      (reaction, user) => {
        console.log(reaction.emoji.name);
        console.log(user.id !== client.user?.id);
        console.log(user.id);
        console.log(message.author.id);
        console.log(user.id !== message.author.id);
        return (
          reaction.emoji.name === '👍' &&
          user.id !== client.user?.id &&
          user.id !== message.author.id
        );
      },
    );
    reactCollector?.on('collect', async (reaction, user) => {
      // give user view access and send a welcome message
      await newChannel?.updateOverwrite(user, { VIEW_CHANNEL: true });
      newChannel?.send(welcomeNewMember(user));
    });

    message.reply('Interest created!');
  } catch (err) {
    message.reply(
      `Was able to create the interest, but couldn't add a join-message to the
      #join-interests-here channel :( ask Amit to take a look at what happened`,
    );
  }
});
