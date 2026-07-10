const createEmbed = require('../utils/embed');

const responses = [
  'Evet kesinlikle!',
  'Kesinlikle hayır!',
  'Belki...',
  'Sonra sor!',
  'Odaklan ve tekrar sor!',
  'Bence evet!',
  'Bence hayır!',
  'İmkansız!',
  'Kesinlikle!',
  'Şüpheliyim...'
];

module.exports = {
  name: 'ask',
  description: 'Sihirli 8 top soru sor',
  async execute(message, args, client) {
    try {
      if (!args[0]) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!ask [soru]`', '#ff0000')] });
      }
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      await message.reply({ embeds: [createEmbed('🎱 Sihirli 8 Top', response)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}