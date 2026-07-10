const createEmbed = require('../utils/embed');

module.exports = {
  name: 'zar',
  description: '1-6 arası rastgele sayı atar',
  async execute(message, args, client) {
    try {
      const result = Math.floor(Math.random() * 6) + 1;
      await message.reply({ embeds: [createEmbed('🎲 Zar', `Çekilen sayı: **${result}**`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}