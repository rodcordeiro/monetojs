import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from 'discord.js';
import { UserServices } from '../../services/user.service';
import { actionsMapper } from './subcommands';
import { CategoriesServices } from '../../services/categories.service';
import { AccountsServices } from '../../services/accounts.service';
import { UserEntity, CategoryEntity } from '../../database/entities';
import { TransferSubcommand } from './subcommands/transfer';
import { CreateTransactionCommand } from './subcommands/create';
import { ListTransactionsCommand } from './subcommands/list';
import { TransactionsServices } from '../../services/transactions.service';
import { UpdateTransactionCommand } from './subcommands/update';

export default class TransactionsCommand {
  data = new SlashCommandBuilder()
    .setName('transactions')
    .setDescription('List users last transactions')
    .addSubcommand(new TransferSubcommand().data)
    .addSubcommand(new CreateTransactionCommand().data)
    .addSubcommand(new ListTransactionsCommand().data)
    .addSubcommand(new UpdateTransactionCommand().data);
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
      ).then(
        (data) =>
          data.flatMap(
            (item) =>
              item.subcategories
                ? [
                    item,
                    item.subcategories.map((i) => ({
                      ...i,
                      name: `[${item.name}] ${i.name}`,
                    })),
                  ].flat()
                : item,
            2,
          ) as CategoryEntity[],
      );

      filtered = categories
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ name, uuid }) => ({ name, value: uuid }))
        .slice(0, 10);
    }
    if (focusedValue.name === 'transaction') {
      const transactions = await TransactionsServices.findOwns(
        user.owner as unknown as UserEntity,
        (qb) => {
          if (focusedValue.value) {
            qb.andWhere('a.description like :description', {
              description: `%${focusedValue.value}%`,
            });
          }
          qb.orderBy('a.date', 'DESC').skip(0).take(10);
        },
      );
      filtered = transactions
        .filter((transaction) =>
          transaction.description?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ description, id }) => ({
          name: description,
          value: id.toString(),
        }))
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
