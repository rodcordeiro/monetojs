import { ChatInputCommandInteraction } from 'discord.js';
import { UserEntity } from '../../../database/entities';
import { BaseCommandType } from '../../../common/commands/base.command';
import { ListAccountsCommand } from './list';
import { CreateAccountsCommand } from './create';

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
  [ListAccountsCommand, CreateAccountsCommand]
    .map((Command) => new Command() as unknown as BaseCommandType)
    .map((i) => ({ name: i.data.name, command: i }))
    ?.find((i) => i.name === interaction.options.getSubcommand())
    ?.command?.execute(interaction, user) ?? replyMessage(interaction);
