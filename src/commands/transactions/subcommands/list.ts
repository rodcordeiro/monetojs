import { ChatInputCommandInteraction } from 'discord.js';
import { Pagination } from 'pagination.djs';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { createBatch } from '../../../common/helpers/batch.helper';
import { TransactionsServices } from '../../../services/trasnsactions.service';
import { UserEntity } from '../../../database/entities';
import { StringUtils } from '../../../common/helpers/string.helper';
import { formatToCurrency } from '../../../common/helpers/transformers.helper';
export async function listTransactions(
  interaction: ChatInputCommandInteraction,
  user: UserEntity,
) {
  await interaction.deferReply({ ephemeral: true });
  try {
    const options =
      interaction.options.data[0].options
        ?.map((option) => [option.name, option.value])
        .filter(Boolean) || [];
    const fields = Object.fromEntries(options);
    const transactions = await TransactionsServices.findOwns(user, fields);

    const embeds = createBatch(transactions, 5).map((data, index, arr) =>
      createEmbed(
        data,
        (item) => [
          {
            name: 'Data',
            value: `${new Date(item.date).toLocaleDateString('pt-BR')}`,
            inline: true,
          },
          {
            name: 'Valor',
            value: `${formatToCurrency(item.value)}`,
            inline: true,
          },
          {
            name: 'Description',
            value: StringUtils.Capitalize(item.description.toString()),
            inline: false,
          },
        ],
        {
          title: 'Aqui estão suas últimas 15 transações:',
          page: index + 1,
          totalPages: arr.length,
          totalItems: transactions.length,
        },
      ),
    );
    if (embeds.length === 1) {
      return await interaction.editReply({
        embeds,
      });
    }

    const pagination = new Pagination(interaction, {
      idle: 30000,
      loop: true,
      ephemeral: true,
    });

    pagination.setEmbeds(embeds);

    const payload = pagination.ready();
    const message = await interaction.editReply(payload);
    pagination.paginate(message);
  } catch (e) {
    console.error(e);
    return await interaction.editReply({
      content: 'Whopa guenta la que eu morri',
    });
  }
}
