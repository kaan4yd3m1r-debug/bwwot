const { REST, Routes } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
    client.user.setActivity('c!yardim yazarak komutları gör!');
    
    // Register slash commands
    const commands = [
      {
        name: 'csetup',
        description: 'Proxy panelini oluşturur (sadece adminler)',
      }
    ];
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    
    try {
      console.log('Slash komutları kaydediliyor...');
      
      // Register commands globally (takes ~1 hour to propagate, or use guild ID for instant)
      // For development, use guild-specific:
      // await rest.put(Routes.applicationGuildCommands(client.user.id, 'YOUR_GUILD_ID'), { body: commands });
      
      // For production, global:
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      
      console.log('Slash komutları başarıyla kaydedildi!');
    } catch (error) {
      console.error('Slash komut hatası:', error);
    }
  }
}
