import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UserEntity } from '../../../database/entities';
import { AccountsServices } from '../../../services/accounts.service';
import { createBatch } from '../../../common/helpers/batch.helper';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { formatToCurrency } from '../../../common/helpers/transformers.helper';
import { Pagination } from 'pagination.djs';

export class ListAccountsCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('List user accounts');

  async execute(interaction: ChatInputCommandInteraction, user: UserEntity) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const accounts = await AccountsServices.findOwns(user);
      const embeds = createBatch(accounts, 6).map((data, index, arr) =>
        createEmbed(
          data,
          (item) => [
            {
              name: 'Name: ',
              value: item.name,
              inline: true,
            },
            {
              name: 'Ammount: ',
              value: formatToCurrency(item.ammount),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
          ],
          {
            title: 'Aqui estão suas contas',
            page: index + 1,
            totalPages: arr.length,
            totalItems: accounts.length,
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
      return await interaction.reply({
        content:
          'Woho! Algo de errado não está certo. Os anciões irão verificar meus registros!',
        ephemeral: true,
      });
    }
  }
}
