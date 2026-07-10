const { EmbedBuilder } = require('discord.js');
const createEmbed = require('../utils/embed');

module.exports = {
  name: 'yardim',
  description: 'Tüm komutları gösterir',
  async execute(message, args, client) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📚 Bot Komutları')
        .setTimestamp()
        .addFields(
          {
            name: '🎮 Eğlence Komutları',
            value: `
\`c!zar\` → 1-6 arası rastgele sayı atar
\`c!yazitura\` → Yazı veya tura atar
\`c!kac\` → Rastgele üyeyi etiketler
\`c!sans @üye\` → 0-100 arası şans yüzdesi gösterir
\`c!vs @üye1 @üye2\` → Rastgele kazanan seçer
\`c!ask [soru]\` → Sihirli 8 top ile soru sor
\`c!ship @üye1 @üye2\` → İki kişiyi ship et
\`c!rps [taş/kağıt/makas]\` → Taş kağıt makas oynatır
`,
            inline: false
          },
          {
            name: '👑 Yönetim Komutları (Sadece Adminler)',
            value: `
\`c!sil [1-100]\` → Belirtilen sayıda mesaj siler
\`c!tasi @kullanici #ses-kanali\` → Kullanıcıyı ses kanalına taşır
\`c!lock\` → Kanalı kilitler
\`c!unlock\` → Kanalı açar
\`c!c isim metin/ses\` → Metin veya ses kanalı oluşturur
\`c!kategori isim\` → Kategori oluşturur
\`c!tasikanal #kanal KategoriAdı\` → Kanalı kategoriye taşır
\`c!katil\` → Bulunduğun ses kanalına katılır
\`c!ayril\` → Ses kanalından ayrılır
`,
            inline: false
          },
          {
            name: '🔒 Özel Komutlar',
            value: `
\`/csetup\` → Proxy panelini oluşturur (sadece adminler)
`,
            inline: false
          }
        )
        .setFooter({ text: 'Prefix: c!' });
      
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}