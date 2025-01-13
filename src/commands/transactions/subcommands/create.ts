import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { TransactionsServices } from '../../../services/transactions.service';
import { UserEntity } from '../../../database/entities';
import { formatToCurrency } from '../../../common/helpers/transformers.helper';

export class CreateTransactionCommand {
  data = new SlashCommandSubcommandBuilder()
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
        .setDescription('Transaction value. Use _"."_ to inform decimal values')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription(
          'Enter the date and time in YYYY-MM-DDT HH:mm format or only YYYY-MM-DD',
        )
        .setRequired(false),
    );
  // .addStringOption((option) =>
  //   option
  //     .setName('objective')
  //     .setDescription(
  //       'Is this transaction linked to an objective? Define here',
  //     )
  //     .setRequired(false),
  // ),
  async execute(interaction: ChatInputCommandInteraction, user: UserEntity) {
    // Regex para validar os dois formatos
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Apenas data
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}[T|t]\d{2}:\d{2}$/; // Data com hora

    await interaction.deferReply({ ephemeral: true });
    try {
      const options =
        interaction.options.data[0].options
          ?.map((option) => [option.name, option.value])
          .filter(Boolean) || [];
      const fields = Object.fromEntries(options);
      if (fields.date) {
        if (!dateRegex.test(fields.date))
          if (!datetimeRegex.test(fields.date))
            return await interaction.editReply({
              content: 'Formato de data inválida!',
            });
      }
      const data = (await TransactionsServices.create(fields, user)) as Record<
        string,
        string | number
      >;

      const embed = createEmbed(
        [data],
        (item) => [
          {
            name: 'Date',
            value: new Date(item.date).toLocaleString('pt-br'),
            inline: true,
          },
          {
            name: 'Value',
            value: formatToCurrency(item.value as number),
            inline: true,
          },
          { name: 'Category', value: item.category.toString(), inline: false },
          { name: 'Category', value: item.account.toString(), inline: false },
        ],
        {
          title: 'Nova transação',
          thumbnail:
            'https://raw.githubusercontent.com/rodcordeiro/monetojs/refs/heads/main/src/assets/pay_it.jpg',
        },
      );
      return await interaction.editReply({
        embeds: [embed],
      });
    } catch (e) {
      console.error(e);
      return await interaction.editReply({
        content: 'Whopa guenta la que eu morri',
      });
    }
  }
}
