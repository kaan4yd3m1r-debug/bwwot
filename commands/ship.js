const createEmbed = require('../utils/embed');

module.exports = {
  name: 'ship',
  description: 'İki kişiyi ship et',
  async execute(message, args, client) {
    try {
      if (message.mentions.users.size !== 2) {
        return message.reply({ embeds: [createEmbed('Hata', 'Kullanımı: `c!ship @üye1 @üye2`', '#ff0000')] });
      }
      
      const users = Array.from(message.mentions.users.values());
      const percentage = Math.floor(Math.random() * 101);
      const name1 = users[0].username.slice(0, Math.floor(users[0].username.length / 2));
      const name2 = users[1].username.slice(Math.floor(users[1].username.length / 2));
      const shipName = name1 + name2;
      
      let heart = '';
      if (percentage < 25) heart = '💔';
      else if (percentage < 50) heart = '💛';
      else if (percentage < 75) heart = '💙';
      else heart = '💕';
      
      await message.reply({ 
        embeds: [createEmbed('💘 Ship', `${users[0]} ❤️ ${users[1]}\nShip İsmi: **${shipName}**\nUyumluluk: **%${percentage}** ${heart}`)]
      });
    } catch (error) {
      console.error(error);
      await message.reply({ embeds: [createEmbed('Hata', 'Bir hata oluştu!', '#ff0000')] });
    }
  }
}