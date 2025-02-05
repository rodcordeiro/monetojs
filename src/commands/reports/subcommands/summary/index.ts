import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UserEntity } from '../../../../database/entities';
import { Pagination } from 'pagination.djs';
import { getInOutMonthlyEmbed } from './in_out_monthly';
import { getAverageInOut } from './averageInOut';
import { getCategoryClassificationAverages } from './avgClassifications';

export class SummaryCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('summary')
    .setDescription('Returns a summary account');
  async execute(interaction: ChatInputCommandInteraction, user: UserEntity) {
    await interaction.deferReply({ ephemeral: true });

    const pagination = new Pagination(interaction, {
      idle: 30000,
      loop: true,
      ephemeral: true,
    });

    pagination.setEmbeds(
      await Promise.all([
        await getAverageInOut(user.id),
        await getInOutMonthlyEmbed(user.id),
        await getCategoryClassificationAverages(user.id),
      ]),
    );

    const payload = pagination.ready();
    const message = await interaction.editReply(payload);
    pagination.paginate(message);
  }
}
