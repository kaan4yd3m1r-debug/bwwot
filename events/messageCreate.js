const config = require('../config/config');

const whitelist = ['youtube.com', 'tiktok.com', 'instagram.com', 'tenor.com'];
const urlRegex = /(https?:\/\/[^\s]+)/g;

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    
    // Link filtresi
    const urls = message.content.match(urlRegex);
    if (urls) {
      let hasBadLink = false;
      for (const url of urls) {
        try {
          const urlObj = new URL(url);
          const domain = urlObj.hostname.replace('www.', '');
          if (!whitelist.some(w => domain.includes(w))) {
            hasBadLink = true;
            break;
          }
        } catch {
          hasBadLink = true;
          break;
        }
      }
      
      if (hasBadLink && !message.member.permissions.has('Administrator')) {
        try {
          await message.delete();
          await message.channel.send('reklam yapma oç');
        } catch (err) {
          console.error(err);
        }
        return;
      }
    }
    
    const content = message.content.toLowerCase().trim();
    
    if (config.autoResponses[content]) {
      try {
        await message.reply(config.autoResponses[content]);
      } catch (err) {
        console.error(err);
      }
    } else if (Math.random() <= 0.02) {
      try {
        const randomResponse = config.randomResponses[Math.floor(Math.random() * config.randomResponses.length)];
        await message.channel.send(randomResponse);
      } catch (err) {
        console.error(err);
      }
    }
    
    if (!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName);
    
    if (!command) return;
    
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      try {
        await message.reply('Komut çalıştırılırken bir hata oluştu!');
      } catch (err) {
        console.error(err);
      }
    }
  }
}