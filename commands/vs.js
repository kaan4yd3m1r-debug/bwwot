const createEmbed = require('../utils/embed');

module.exports = {
  name: 'vs',
  description: 'Rastgele kazanan seçer',
  async execute(message, args, client) {
    try {
      if (message.mentions.users.size !== 2) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!vs @üye1 @üye2`', '#ff0000')] });
      }
      
      const users = Array.from(message.mentions.users.values());
      const winner = users[Math.floor(Math.random() * users.length)];
      
      await message.reply({ embeds: [createEmbed('⚔️ VS', `Kazanan: **${winner}**!`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}