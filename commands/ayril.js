const { PermissionsBitField } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'ayril',
  description: 'Bulunduğun ses kanalından ayrılır',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      const connection = getVoiceConnection(message.guild.id);
      
      if (!connection) {
        return message.reply({ embeds: [createEmbed('Hata', 'Ben zaten bir ses kanalında değilim!', '#ff0000')] });
      }
      
      const timer = client.voiceTimers.get(message.guild.id);
      if (timer) {
        clearTimeout(timer);
        client.voiceTimers.delete(message.guild.id);
      }
      
      connection.destroy();
      await message.reply({ embeds: [createEmbed('Başarılı', 'Ses kanalından ayrıldım!')] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}