const createEmbed = require('../utils/embed');

module.exports = {
  name: 'kac',
  description: 'Rastgele üyeyi etiketleyip "kaç lan" yazar',
  async execute(message, args, client) {
    try {
      const members = message.guild.members.cache.filter(m => !m.user.bot);
      const randomMember = members.random();
      
      if (randomMember) {
        await message.channel.send(`kaç lan ${randomMember}`);
      } else {
        await message.reply({ embeds: [createEmbed('Hata', 'Sunucuda uygun üye bulunamadı!', '#ff0000')] });
      }
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}