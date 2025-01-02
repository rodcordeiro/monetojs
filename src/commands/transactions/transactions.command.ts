import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from 'discord.js';
import { UserServices } from '../../services/user.service';
import { actionsMapper } from './subcommands';
import { CategoryRepository } from '../../database/repositories';
import { UserEntity } from '../../database/entities';

export default class TransactionsCommand {
  data = new SlashCommandBuilder()
    .setName('transactions')
    .setDescription('List users last transactions')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Create a new transaction')
        .addStringOption((option) =>
          option
            .setName('account')
            .setDescription('Account to be registered')
            .setAutocomplete(true)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('category')
            .setDescription('Transaction categoriy')
            .setAutocomplete(true)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('Transaction description')
            .setRequired(true),
        )
        .addNumberOption((option) =>
          option
            .setName('value')
            .setDescription('Transaction value')
            .setRequired(true),
        ),
    );
  // .addNumberOption((option) =>
  //   option.setName('value').setRequired(true).setMinValue(0.01),
  // ),
  // );

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused(true);
    let filtered: Array<AutocompleteOption> = [];

    const user = await UserServices.isRegistered(interaction.user.id);
    if (!user) return await interaction.respond([]);

    if (focusedValue.name === 'account') {
      const qb = CategoryRepository.createQueryBuilder('category');

      const categories = await qb
        .where('category.owner = :owner', {
          owner: (user.owner as unknown as UserEntity).id,
        })
        .getMany();
      filtered = categories
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .map(({ name, uuid }) => ({ name, value: uuid }));
    }
    if (focusedValue.name === 'category') {
      const qb = CategoryRepository.createQueryBuilder('category');

      const categories = await qb
        .where('category.owner = :owner', {
          owner: (user.owner as unknown as UserEntity).id,
        })
        .getMany();
      filtered = categories
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .map(({ name, uuid }) => ({ name, value: uuid }));
    }
    console.log({ filtered });

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

      return await actionsMapper(interaction);
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
