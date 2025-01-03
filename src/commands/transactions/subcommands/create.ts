import { ChatInputCommandInteraction } from 'discord.js';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { TransactionsServices } from '../../../services/trasnsactions.service';
import { UserEntity } from '../../../database/entities';
import { StringUtils } from '../../../common/helpers/string.helper';

export async function createTransaction(
  interaction: ChatInputCommandInteraction,
  user: UserEntity,
) {
  await interaction.deferReply({ ephemeral: true });
  try {
    const options =
      interaction.options.data[0].options
        ?.map((option) => [option.name, option.value])
        .filter(Boolean) || [];
    const fields = Object.fromEntries(options);
    const data = await TransactionsServices.create(fields, user);

    const embed = createEmbed(
      Object.entries(data as Record<string, unknown>)
        .filter(([name, value]) => !!name && !!value)
        .map(([name, value]) => ({
          name,
          value,
        })),
      (item) => ({
        name: StringUtils.Capitalize(item.name.toString()),
        value: (item.value as string).toString(),
      }),
      {
        title: 'Nova transação',
      },
    );
    return await interaction.editReply({
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
    return await interaction.editReply({
      content: 'Whopa guenta la que eu morri',
    });
  }
}
