import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
// import { createEmbed } from '../../../common/helpers/embeds.helper';
// import { TransactionsServices } from '../../../services/transactions.service';
import { UserEntity } from '../../../database/entities';
// import { formatToCurrency } from '../../../common/helpers/transformers.helper';

export class UpdateTransactionCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('update')
    .setDescription('Update an existing transaction')
    .addStringOption((option) =>
      option
        .setName('transaction')
        .setDescription('Transaction to be updated')
        .setAutocomplete(true)
        .setRequired(true),
    )
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
        .setAutocomplete(true)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription(
          'Transaction description. Use this as label for the transaction',
        )
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option
        .setName('value')
        .setDescription('Transaction value. Use _"."_ to inform decimal values')
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription(
          'Enter the date and time in YYYY-MM-DDT HH:mm format or only YYYY-MM-DD',
        )
        .setRequired(false),
    );

  async execute(interaction: ChatInputCommandInteraction, _user: UserEntity) {
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

      console.log({ fields });
      // validar quais campos foram alterados
      // se valor, ajustar saldo da conta
      // se conta, ajustar saldo da conta anterior e da nova
      // atualizar transação

      // const data = (await TransactionsServices.create(fields, user)) as Record<
      //   string,
      //   string | number
      // >;

      // const embed = createEmbed(
      //   [data],
      //   (item) => [
      //     {
      //       name: 'Date',
      //       value: new Date(item.date).toLocaleString('pt-br'),
      //       inline: true,
      //     },
      //     {
      //       name: 'Value',
      //       value: formatToCurrency(item.value as number),
      //       inline: true,
      //     },
      //     { name: '\u200B', value: '\u200B', inline: true },
      //     { name: 'Category', value: item.category.toString(), inline: true },
      //     { name: 'Account', value: item.account.toString(), inline: true },
      //     {
      //       name: 'Description',
      //       value: item.description.toString(),
      //       inline: false,
      //     },
      //   ],
      //   {
      //     title: 'Nova transação',
      //     thumbnail:
      //       'https://raw.githubusercontent.com/rodcordeiro/monetojs/refs/heads/main/src/assets/pay_it.jpg',
      //   },
      // );
      return await interaction.editReply({
        content: 'Rodei!',
        // embeds: [embed],
      });
    } catch (e) {
      console.error(e);
      return await interaction.editReply({
        content: 'Whopa guenta la que eu morri',
      });
    }
  }
}
