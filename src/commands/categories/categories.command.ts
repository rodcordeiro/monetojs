import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';
import { createBatch } from '../../common/helpers/batch.helper';
import { Pagination } from 'pagination.djs';
import { CategoriesServices } from '../../services/categories.service';
import { createEmbed } from '../../common/helpers/embeds.helper';
import { UserEntity, CategoryEntity } from '../../database/entities';
// import { ArrayUtils } from '@rodcordeiro/lib';

export default class TransactionsCommand {
  data = new SlashCommandBuilder()
    .setName('categories')
    .setDescription('List users categories');

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });
      await interaction.deferReply({ ephemeral: true });
      const categories = await CategoriesServices.findOwns(
        user.owner as unknown as UserEntity,
      ).then(
        (data) =>
          data.flatMap((item) =>
            item.subcategories
              ? [
                  item,
                  item.subcategories.map((i) => ({
                    ...i,
                    name: `[${item.name}] ${i.name}`,
                  })),
                ].flat()
              : item,2
          ) as CategoryEntity[],
      );

      const embeds = createBatch(
        categories,

        10,
      ).map((data, index, arr) =>
        createEmbed(
          data,
          (item) => ({
            name: 'Name: ',
            value: `[${item.positive ? '+' : '-'}] ${item.name}`,
            inline: false,
          }),
          {
            title: 'Aqui estão suas categorias',
            page: index + 1,
            totalPages: arr.length,
            totalItems: categories.length,
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
