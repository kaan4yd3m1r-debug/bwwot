const { PermissionsBitField } = require('discord.js');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'tasikanal',
  description: 'Kanalı kategoriye taşı',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      if (args.length < 2) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!tasikanal #kanal KategoriAdı`', '#ff0000')] });
      }
      
      const channel = message.mentions.channels.first();
      if (!channel) {
        return message.reply({ embeds: [createEmbed('Hata', 'Geçerli bir kanal etiketlemelisin!', '#ff0000')] });
      }
      
      const categoryName = args.slice(1).join(' ');
      const category = message.guild.channels.cache.find(c => c.type === 4 && c.name.toLowerCase() === categoryName.toLowerCase());
      
      if (!category) {
        return message.reply({ embeds: [createEmbed('Hata', 'Belirtilen kategori bulunamadı!', '#ff0000')] });
      }
      
      await channel.setParent(category.id);
      await message.reply({ embeds: [createEmbed('Başarılı', `${channel} kanalı ${category} kategorisine taşındı!`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}