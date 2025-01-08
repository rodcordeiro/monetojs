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

export default class TransactionsCommand {
  data = new SlashCommandBuilder()
    .setName('transactions')
    .setDescription('List users last transactions')
    .addSubcommand(
      (subcommand) =>
        subcommand
          .setName('create')
          .setDescription('Create a new transaction')
          .addStringOption((option) =>
            option
              .setName('account')
              .setDescription('Account to register the transaction')
              .setAutocomplete(true)
              .setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName('category')
              .setDescription('Transaction category')
              .setAutocomplete(true)
              .setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName('description')
              .setDescription(
                'Transaction description. Use this as label for the transaction',
              )
              .setRequired(true),
          )
          .addNumberOption((option) =>
            option
              .setName('value')
              .setDescription(
                'Transaction value. Use _"."_ to inform decimal values',
              )
              .setRequired(true),
          ),
      // .addStringOption((option) =>
      //   option
      //     .setName('objective')
      //     .setDescription(
      //       'Is this transaction linked to an objective? Define here',
      //     )
      //     .setRequired(false),
      // ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('List last trsnsactions')
        .addStringOption((option) =>
          option
            .setName('account')
            .setDescription('Account to register the transaction')
            .setAutocomplete(true)
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName('category')
            .setDescription('Transaction category')
            .setRequired(false)
            .setAutocomplete(true),
        ),
    );

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused(true);
    let filtered: Array<AutocompleteOption> = [];

    const user = await UserServices.isRegistered(interaction.user.id);
    if (!user) return await interaction.respond([]);

    if (focusedValue.name === 'account') {
      const accounts = await AccountsServices.findOwns(user);
      filtered = accounts
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ name, uuid }) => ({ name, value: uuid }))
        .slice(0, 10);
    }

    if (focusedValue.name === 'category') {
      const categories = await CategoriesServices.findOwns(user);

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
