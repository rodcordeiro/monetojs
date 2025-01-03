import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';
import { createBatch } from '../../common/helpers/batch.helper';
import { Pagination } from 'pagination.djs';
import { createEmbed } from '../../common/helpers/embeds.helper';
import { AccountsServices } from '../../services/accounts.service';
import { formatToCurrency } from '../../common/helpers/transformers.helper';

export default class AccountsCommand {
  data = new SlashCommandBuilder()
    .setName('accounts')
    .setDescription('List user accounts');

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });
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
