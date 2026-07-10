const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const path = require('path');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'eglendir',
  description: 'Ses kanalına girip osuruk.mp3 çalar',
  async execute(message, args, client) {
    try {
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
      
      const player = createAudioPlayer();
      const resourcePath = path.join(__dirname, '../sounds/osuruk.mp3');
      const resource = createAudioResource(resourcePath);
      
      player.play(resource);
      connection.subscribe(player);
      
      await message.reply({ embeds: [createEmbed('Eğlence', 'Osuruk sesi çalınıyor!')] });
      
      player.on('idle', () => {
        connection.destroy();
      });
      
      player.on('error', (error) => {
        console.error(error);
        connection.destroy();
        message.reply({ embeds: [createEmbed('Hata', 'Ses dosyası çalınırken bir hata oluştu!', '#ff0000')] });
      });
      
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}