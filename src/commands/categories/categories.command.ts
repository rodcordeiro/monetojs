import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  APIEmbedField,
} from 'discord.js';
import { UserServices } from '../../services/user.service';
import { CategoryRepository } from '../../database/repositories';
import { UserEntity } from '../../database/entities';
import { createBatch } from '../../common/helpers/batch.helper';
import { Pagination } from 'pagination.djs';

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
      const qb = CategoryRepository.createQueryBuilder('category');

      const categories = await qb
        .where('category.owner = :owner', {
          owner: (user.owner as unknown as UserEntity).id,
        })
        .getMany();
      const embeds = createBatch(categories, 6).map((data, index, arr) => {
        const embed = new EmbedBuilder()
          .setColor(Colors.Blurple)
          .setTitle(`Aqui estão suas categorias`)
          .setThumbnail('https://moneto-app.gabrielbizzi.com.br/logo.svg')
          .setFooter({
            text: `Page: ${index + 1}/${arr.length}. Categorias: ${categories.length}`,
          });
        data.map((item) =>
          embed.addFields([
            {
              name: 'Name: ',
              value: `[${item.positive ? '+' : '-'}]${!!item.parentCategory && `[${categories.find((i) => i.id === item.parentCategory)?.name}]`} ${item.name}`,
              inline: true,
            },
            // {
            //   name: 'positive: ',
            //   value: item.positive ? 'Sim' : 'Não',
            //   inline: true,
            // },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
          ] as APIEmbedField[]),
        );
        return embed;
      });

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
