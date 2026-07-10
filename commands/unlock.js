const { PermissionsBitField } = require('discord.js');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'unlock',
  description: 'Kanalı aç',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      const channel = message.channel;
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: true
      });
      
      await message.reply({ embeds: [createEmbed('Başarılı', 'Kanal açıldı!')] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}