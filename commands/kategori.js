const { PermissionsBitField, ChannelType } = require('discord.js');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'kategori',
  description: 'Kategori oluştur',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      if (!args[0]) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!kategori isim`', '#ff0000')] });
      }
      
      const name = args.join(' ');
      
      const category = await message.guild.channels.create({
        name: name,
        type: ChannelType.GuildCategory
      });
      
      await message.reply({ embeds: [createEmbed('Başarılı', `${category} kategorisi oluşturuldu!`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}