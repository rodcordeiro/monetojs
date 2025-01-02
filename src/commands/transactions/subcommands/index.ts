import { ChatInputCommandInteraction } from 'discord.js';
import { createTransaction } from './create';

function replyMessage(interaction: ChatInputCommandInteraction) {
  if (interaction.replied)
    return interaction.editReply(
      'Whops... Lost myself. Do you mind trying again?',
    );
  return interaction.reply('Whops... Lost myself. Do you mind trying again?');
}

export const actionsMapper = async (
  interaction: ChatInputCommandInteraction,
) => {
  switch (interaction.options.getSubcommand()) {
    // case 'list':
    //   ListDwellers(interaction);
    //   break;
    case 'create':
      createTransaction(interaction);
      break;
    // case 'update':
    //   UpdateDweller(interaction);
    //   break;
    // case 'view':
    //   ViewDweller(interaction);
    //   break;
    // case 'delete':
    //   DeleteDweller(interaction);
    //   break;
    default:
      replyMessage(interaction);
  }
};
