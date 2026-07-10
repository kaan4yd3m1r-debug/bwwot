const createEmbed = require('../utils/embed');

module.exports = {
  name: 'yazitura',
  description: 'Yazı veya tura atar',
  async execute(message, args, client) {
    try {
      const choices = ['Yazı', 'Tura'];
      const result = choices[Math.floor(Math.random() * choices.length)];
      await message.reply({ embeds: [createEmbed('🪙 Yazı Tura', `Sonuç: **${result}**`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}