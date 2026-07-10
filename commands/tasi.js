const { PermissionsBitField } = require('discord.js');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'tasi',
  description: 'Kullanıcıyı ses kanalına taşır',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      const user = message.mentions.members.first();
      const voiceChannel = message.mentions.channels.first();
      
      if (!user || !voiceChannel || voiceChannel.type !== 2) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!tasi @kullanici #ses-kanali`', '#ff0000')] });
      }
      
      if (!user.voice.channel) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanıcı şu anda bir ses kanalında değil!', '#ff0000')] });
      }
      
      await user.voice.setChannel(voiceChannel);
      await message.reply({ embeds: [createEmbed('Başarılı', `${user} kullanıcısı ${voiceChannel} kanalına taşındı!`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu! Kullanıcının veya kanalın izinlerini kontrol edin.', '#ff0000')] });
    }
  }
}