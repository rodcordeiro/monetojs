import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';
import { CategoryRepository } from '../../database/repositories';

export default class TransactionsCommand {
  data = new SlashCommandBuilder()
    .setName('categories')
    .setDescription('List users categories');
  // .addStringOption((option) =>
  //   option.setName('id').setDescription('Moneto user uuid').setRequired(true),
  // );
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      console.log({ user, interaction: interaction.user });
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });
      const categories = await CategoryRepository.find({
        where: { owner: user.owner },
      });
      return await interaction.reply({
        content: categories.map((i) => i.name).join(', '),
        ephemeral: true,
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
