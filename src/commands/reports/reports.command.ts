import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';

import { UserEntity } from '../../database/entities';
import { actionsMapper } from './subcommands';
import { SummaryCommand } from './subcommands/summary';

export default class ReportsCommand {
  data = new SlashCommandBuilder()
    .setName('reports')
    .setDescription('Returns transactions reports')
    .addSubcommand(new SummaryCommand().data);

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });
      return await actionsMapper(
        interaction,
        user.owner as unknown as UserEntity,
      );
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
