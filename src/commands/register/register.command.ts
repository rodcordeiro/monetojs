import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';

export default class RegisterCommand {
  data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register user to interact with bot');
  async execute(interaction: ChatInputCommandInteraction) {
    const user = await UserServices.isRegistered(interaction.user.id);
    console.log({ user });
    await interaction.reply({ content: 'Pong!', ephemeral: true });
  }
}
