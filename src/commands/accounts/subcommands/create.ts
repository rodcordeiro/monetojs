import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UserEntity } from '../../../database/entities';
import { AccountsServices } from '../../../services/accounts.service';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { formatToCurrency } from '../../../common/helpers/transformers.helper';

export class CreateAccountsCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a new account')
    .addStringOption((option) =>
      option.setName('name').setDescription('Account name').setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('payment')
        .setDescription('Payment type for this account')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addNumberOption((option) =>
      option
        .setName('ammount')
        .setDescription('Current account ammount')
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option
        .setName('threshold')
        .setDescription('Account threshold')
        .setRequired(false),
    );

  async execute(interaction: ChatInputCommandInteraction, user: UserEntity) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const options =
        interaction.options.data[0].options
          ?.map((option) => [option.name, option.value])
          .filter(Boolean) || [];
      const fields = Object.fromEntries(options);

      const data = (await AccountsServices.create(fields, user)) as Record<
        string,
        string | number
      >;
      console.log({ fields, data });
      // const embed = createEmbed(
      //   [data],
      //   (item) => [
      //     {
      //       name: 'Name',
      //       value: item.name.toString(),
      //       inline: true,
      //     },
      //     {
      //       name: 'Value',
      //       value: formatToCurrency(item.value as number),
      //       inline: true,
      //     },
      //   ],
      //   {
      //     title: 'Nova conta!',
      //   },
      // );
      return await interaction.editReply({
        content: 'teste',
        // embeds: [embed],
      });
    } catch (e) {
      console.error(e);
      return await interaction.editReply({
        content:
          'Woho! Algo de errado não está certo. Os anciões irão verificar meus registros!',
      });
    }
  }
}
