const createEmbed = require('../utils/embed');

const choices = ['taş', 'kağıt', 'makas'];
const emojis = { taş: '🪨', kağıt: '📄', makas: '✂️' };

module.exports = {
  name: 'rps',
  description: 'Taş kağıt makas oynatır',
  async execute(message, args, client) {
    try {
      const userChoice = args[0]?.toLowerCase();
      if (!choices.includes(userChoice)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!rps [taş/kağıt/makas]`', '#ff0000')] });
      }
      
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      let result;
      
      if (userChoice === botChoice) {
        result = 'Berabere!';
      } else if (
        (userChoice === 'taş' && botChoice === 'makas') ||
        (userChoice === 'kağıt' && botChoice === 'taş') ||
        (userChoice === 'makas' && botChoice === 'kağıt')
      ) {
        result = 'Sen kazandın!';
      } else {
        result = 'Ben kazandım!';
      }
      
      await message.reply({ embeds: [createEmbed('✊✋✌️ Taş Kağıt Makas', `Sen: ${emojis[userChoice]} ${userChoice}\nBen: ${emojis[botChoice]} ${botChoice}\n\n**${result}**`)] });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}