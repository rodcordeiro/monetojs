import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';

import QuickChart from 'quickchart-js';
import { TransactionsRepository } from '../../database/repositories/transactions.repository';
import { UserEntity } from '../../database/entities';
import{formatToCurrency} from '../../common/helpers/transformers.helper'

export default class ReportsCommand {
  data = new SlashCommandBuilder()
    .setName('reports')
    .setDescription('Sends transactions reports');

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });
      await interaction.deferReply({ ephemeral: true });

      const transactions = TransactionsRepository.createQueryBuilder('a');

      transactions.select(['a.value', 'b.positive']);
      transactions.leftJoinAndSelect('a.category', 'b', 'a.category = b.id');
      transactions.leftJoinAndSelect('a.account', 'c', 'a.account = c.id');
      transactions.andWhere('b.internal is false');
      transactions.andWhere('a.owner = :owner', {
        owner: (user.owner as unknown as UserEntity).id,
      });
      const data = (await transactions.getMany()).reduce(
        (prev, next: unknown) => {
          if (next?.category.positive) {
            return { ...prev, positive: prev.positive + next.value };
          }
          return { ...prev, negative: prev.negative + next.value };
        },
        {
          positive: 0,
          negative: 0,
        },
      );
      console.log({ data });

      const chart = new QuickChart();
      chart.setConfig({
        type: 'doughnut',
        data: {
          labels: ['Positive', 'Negative'],
          datasets: [
            {
              data: [
                data.positive.toPrecision(2).toString(),
                data.negative.toPrecision(2).toString(),
              ],
            },
          ],
        },
        options: {
          plugins: {
            doughnutlabel: {
              labels: [
                {
                  text: formatToCurrency(data.positive - data.negative),
                    //.toPrecision(2)
                    //.toString(),
                  font: { size: 20 },
                },
                { text: 'total' },
              ],
            },
          },
        },
      });
      // chart.setConfig({
      //   type: 'doughnut',
      //   labels: ['positive', 'negative'],
      //   data: {
      //     datasets: [
      //       {
      //         label: 'positive',
      //         data: data.positive.toPrecision(2).toString(),
      //       },
      //       {
      //         label: 'negative',
      //         data: data.negative.toPrecision(2).toString(),
      //       },
      //     ],
      //   },
      // options: {
      //   plugins: {
      //     doughnutlabel: {
      //       labels: [
      //         {
      //           text: (data.positive - data.negative)
      //             .toPrecision(2)
      //             .toString(),
      //           font: { size: 20 },
      //         },
      //         { text: 'total' },
      //       ],
      //     },
      //   },
      // },
      // });

      const chartEmbed = {
        title: 'Gastos x Despesas',
        description: 'Gastos x Despesas dos últimos 6 meses',
        image: {
          url: chart.getUrl(),
        },
      };
      return await interaction.editReply({
        embeds: [chartEmbed, chartEmbed],
      });
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
