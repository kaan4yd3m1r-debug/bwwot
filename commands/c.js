const { PermissionsBitField, ChannelType } = require('discord.js');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'c',
  description: 'Metin veya ses kanalı oluştur',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için Administrator yetkisine sahip olmalısın!', '#ff0000')] });
      }
      
      if (args.length < 2) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı:\n`c!c isim metin`\n`c!c isim ses`', '#ff0000')] });
      }
      
      const name = args[0];
      const type = args[1].toLowerCase();
      
      let channelType;
      if (type === 'metin') {
        channelType = ChannelType.GuildText;
      } else if (type === 'ses') {
        channelType = ChannelType.GuildVoice;
      } else {
        return message.reply({ embeds: [createEmbed('Hata', 'Sadece "metin" veya "ses" seçilebilir!', '#ff0000')] });
      }
      
      const channel = await message.guild.channels.create({
        name: name,
        type: channelType
      });
      
      await message.reply({ embeds: [createEmbed('Başarılı', `${type === 'metin' ? 'Metin' : 'Ses'} kanalı ${channel} oluşturuldu!`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu! İzinleri kontrol edin.', '#ff0000')] });
    }
  }
}