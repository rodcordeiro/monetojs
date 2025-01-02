import { ChatInputCommandInteraction } from 'discord.js';

export async function createTransaction(
  interaction: ChatInputCommandInteraction,
) {
  await interaction.deferReply({ ephemeral: false });
  const fields = Object.fromEntries(
    interaction.options.data[0].options?.map((option) => [
      option.name,
      option.value,
    ]) || [],
  );
  console.log({ fields });
  return await interaction.editReply({
    content: 'Finge que eu criei',
    // embeds: [embed],
  });
}
