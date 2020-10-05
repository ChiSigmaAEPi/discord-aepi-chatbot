import dotenv from 'dotenv';
import {
  Client,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from 'discord.js';
import {
  formatNewInterest,
  welcomeNewMember,
  isCommand,
  AEPI_GUILD_NAME,
  JOIN_INTERESTS_CHANNEL,
  INTERESTS_CATEGORY,
} from './constants/constants';
import joinInterestReact from './events/joinInterestReact';

dotenv.config();

const client = new Client({ partials: ['MESSAGE', 'REACTION'] });

const addInterestReactCollector = (message: Message) => {
  // extract the interest channel name from message
  const channelId = message.content.split('**')[1];
  console.log('inside addinterestreactcollector');
  console.log(channelId);

  // TODO test
  // get channel
  const channel = <TextChannel | undefined>(
    message.guild?.channels.cache.find(
      (ch) => ch.toString() === channelId && ch.type === 'text',
    )
  );
  console.log(channel);

  // setup the react collector for this message (needs thumbs up reaction,
  // ignore reactions from the bot)
  const reactCollector = message.createReactionCollector(
    (reaction, user) =>
      reaction.emoji.name === '👍' && user.id !== client.user?.id,
  );

  // on a react, give user view access and send a welcome message to the channel
  reactCollector?.on('collect', async (reaction, user) => {
    try {
      await channel?.updateOverwrite(user, { VIEW_CHANNEL: true });
      // TODO channel?.send(welcomeNewMember(user));
    } catch (err) {
      console.log(
        `Couldn't create react collectors for previous messages: ${err}`,
      );

      // get the server admin role, and @them, warning them of this error
      const serverAdmins = message.guild?.roles.cache.find((role) =>
        role.permissions.has('ADMINISTRATOR'),
      );
      channel?.send(`${serverAdmins}, reactCollector error occurred: ${err}`);
    }
  });
};

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

// test new-interest command
// TODO still need to figure out how to do it well
onCommand('new-interest', 1, async (message, args) => {
  // get the interest name and interests category
  const interestName = args[0];
  const category = message.guild?.channels.cache.find(
    (cat) => cat.name === INTERESTS_CATEGORY,
  );

  // create the new channel in the interests category, with only the new user
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

    if (!newChannel) throw Error('the new channel is undefined');
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
          channel.name === JOIN_INTERESTS_CHANNEL && channel.type === 'text',
      )
    );

    // add the new interest to the #join-interests-channel
    const joinMessage = await joinInterestsChannel?.send(
      formatNewInterest(newChannel),
    );
    if (!joinMessage) throw Error('Join message undefined');

    joinMessage.react('👍');

    // setup the react collector for this message
    // addInterestReactCollector(joinMessage);

    newChannel.send(`${message.author} channel was created!`);
    message.reply('Interest created!');
  } catch (err) {
    message.reply(
      `Was able to create the interest, but couldn't add a join-message to the
      #${JOIN_INTERESTS_CHANNEL} channel :( ask Amit to take a look at what happened, error: ${err}`,
    );
  }
});

// login
client
  .login(process.env.BOT_TOKEN)
  .then(() => {
    console.log('Successfully logged in!');

    // get the join interests channel
    // TODO client.guilds.fet
    // TODO const guild = client.guilds.cache.find((g) => g.name === AEPI_GUILD_NAME);
    // console.log(guild?.name);
    // const joinInterestsChannel = <TextChannel>(
    //   guild?.channels.cache.find(
    //     (channel) =>
    //       channel.name === JOIN_INTERESTS_CHANNEL && channel.type === 'text',
    //   )
    // );
    // console.log(joinInterestsChannel.name);

    // // read all previous messages in #join-interests-here and add a react collector to them
    // joinInterestsChannel?.messages.cache.map((message) => {
    //   // for each message, add a react collector to it
    //   console.log(message.content);
    //   try {
    //     addInterestReactCollector(message);
    //   } catch (err) {
    //     console.log(`Couldn't create a react collector: ${err}`);
    //   }
    // });
  })
  .catch((err) => console.log(`Error while logging in: ${err}`));

// TODO:
// - need to add functionality where if users un-react the message, they then leave the chat
// - need to add functionality where if the server restarts, the chatbot should read all previous messages in #join-interests-here and add createReactionCollectors to them

client.on(
  'messageReactionAdd',
  async (potentialPartialReaction, potentialPartialUser) => {
    // check if need to get complete reaction
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

    // check if need to get complete user
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

    if (message.channel.type !== 'text' || user.id === client.user?.id) return;

    // handle the reaction depending on which channel it was in
    switch (message.channel.name) {
      case JOIN_INTERESTS_CHANNEL:
        joinInterestReact(reaction, user);
        break;
    }
  },
);
