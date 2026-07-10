const { PermissionsBitField } = require('discord.js');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'sil',
  description: 'Belirtilen sayıda mesaj siler',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      const amount = parseInt(args[0]);
      
      if (isNaN(amount) || amount < 1 || amount > 100) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!sil [1-100]`', '#ff0000')] });
      }
      
      await message.channel.bulkDelete(amount + 1, true);
      
      const reply = await message.channel.send({ embeds: [createEmbed('Başarılı', `${amount} mesaj silindi!`)] });
      setTimeout(() => reply.delete(), 3000);
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Mesajları silerken bir hata oluştu! 14 günden eski mesajları silemem.', '#ff0000')] });
    }
  }
}