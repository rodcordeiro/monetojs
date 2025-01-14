import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from 'discord.js';
import { UserServices } from '../../services/user.service';
import { actionsMapper } from './subcommands';
import { CategoriesServices } from '../../services/categories.service';
import { AccountsServices } from '../../services/accounts.service';
import { UserEntity } from '../../database/entities';
import { TransferSubcommand } from './subcommands/transfer';
import { CreateTransactionCommand } from './subcommands/create';
import { ListTransactionsCommand } from './subcommands/list';

export default class TransactionsCommand {
  data = new SlashCommandBuilder()
    .setName('transactions')
    .setDescription('List users last transactions')
    .addSubcommand(new TransferSubcommand().data)
    .addSubcommand(new CreateTransactionCommand().data)
    .addSubcommand(new ListTransactionsCommand().data);

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused(true);
    let filtered: Array<AutocompleteOption> = [];

    const user = await UserServices.isRegistered(interaction.user.id);
    if (!user) return await interaction.respond([]);

    if (['account', 'origin', 'destiny'].includes(focusedValue.name)) {
      const accounts = await AccountsServices.findOwns(
        user.owner as unknown as UserEntity,
      );
      filtered = accounts
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ name, uuid }) => ({ name, value: uuid }))
        .slice(0, 10);
    }

    if (focusedValue.name === 'category') {
      const categories = await CategoriesServices.findOwns(
        user.owner as unknown as UserEntity,
      );

      filtered = categories
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ name, uuid }) => ({ name, value: uuid }))
        .slice(0, 10);
    }

    await interaction.respond(filtered);
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });

      return await actionsMapper(
        interaction,
        user.owner as unknown as UserEntity,
      );
    } catch (e) {
      console.error(e);
      return await interaction.reply({
        content:
          'Woho! Algo de errado não está certo. Os anciões irão verificar meus registros!',
        ephemeral: true,
      });
    }
  }
}
