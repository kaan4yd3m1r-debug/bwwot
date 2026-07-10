const { PermissionsBitField } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const createEmbed = require('../utils/embed');
const config = require('../config/config');

module.exports = {
  name: 'katil',
  description: 'Bulunduğun ses kanalına katılır',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      const member = message.member;
      
      if (!member.voice.channel) {
        return message.reply({ embeds: [createEmbed('Hata', 'Önce bir ses kanalına katılmalısın!', '#ff0000')] });
      }
      
      const voiceChannel = member.voice.channel;
      
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
      });
      
      const existingTimer = client.voiceTimers.get(voiceChannel.guild.id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      const timer = setTimeout(async () => {
        try {
          const randomMsg = config.idleMessages[Math.floor(Math.random() * config.idleMessages.length)];
          const textChannel = message.channel;
          if (textChannel) {
            await textChannel.send(randomMsg);
          }
        } catch (err) {
          console.error(err);
        }
      }, 15 * 60 * 1000);
      
      client.voiceTimers.set(voiceChannel.guild.id, timer);
      
      await message.reply({ embeds: [createEmbed('Başarılı', `${voiceChannel} kanalına katıldım!`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}