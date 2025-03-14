import { ChatInputCommandInteraction } from 'discord.js';
import { TransferSubcommand } from './transfer';
import { UserEntity } from '../../../database/entities';
import { CreateTransactionCommand } from './create';
import { BaseCommandType } from '../../../common/commands/base.command';
import { ListTransactionsCommand } from './list';
import { UpdateTransactionCommand } from './update';

function replyMessage(interaction: ChatInputCommandInteraction) {
  if (interaction.replied)
    return interaction.editReply(
      'Whops... Lost myself. Do you mind trying again?',
    );
  return interaction.reply('Whops... Lost myself. Do you mind trying again?');
}

export const actionsMapper = async (
  interaction: ChatInputCommandInteraction,
  user: UserEntity,
) =>
  [
    TransferSubcommand,
    CreateTransactionCommand,
    ListTransactionsCommand,
    UpdateTransactionCommand,
  ]
    .map((Command) => new Command() as unknown as BaseCommandType)
    .map((i) => ({ name: i.data.name, command: i }))
    ?.find((i) => i.name === interaction.options.getSubcommand())
    ?.command?.execute(interaction, user) ?? replyMessage(interaction);
