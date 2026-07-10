const createEmbed = require('../utils/embed');

module.exports = {
  name: 'sans',
  description: '0-100 arası şans yüzdesi gösterir',
  async execute(message, args, client) {
    try {
      if (!args[0] || !message.mentions.users.first()) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!sans @üye`', '#ff0000')] });
      }
      
      const user = message.mentions.users.first();
      const sans = Math.floor(Math.random() * 101);
      
      await message.reply({ embeds: [createEmbed('🍀 Şans', `${user} kişisinin şansı: **%${sans}**`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}