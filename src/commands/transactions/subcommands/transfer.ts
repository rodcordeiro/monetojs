import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UserEntity } from '../../../database/entities';

export class TransferSubcommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('transfer')
    .setDescription('Create a transfer between accounts')
    .addStringOption((option) =>
      option
        .setName('origin')
        .setDescription('Account to register the transaction')
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('destiny')
        .setDescription('Account to register the transaction')
        .setAutocomplete(true)
        .setRequired(true),
    );
  execute(interaction: ChatInputCommandInteraction, _user: UserEntity) {
    interaction.reply({
      content: 'This is a transfer subcommand',
      ephemeral: true,
    });
  }
}
