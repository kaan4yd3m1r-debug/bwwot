const { EmbedBuilder } = require('discord.js');
const setupCommand = require('../commands/setup');

// Get ping emoji and color
function getPingInfo(ping) {
  if (ping === null) return { emoji: '❌', color: '#990000', text: 'Ölü' };
  if (ping < 500) return { emoji: '⚡', color: '#00cc00', text: `${ping}ms` };
  if (ping < 3000) return { emoji: '🟡', color: '#ffcc00', text: `${ping}ms` };
  return { emoji: '🔴', color: '#ff3300', text: `${ping}ms` };
}

const cooldowns = new Map();

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      // Buttons only
      if (!interaction.isButton()) return;
      
      const protocol = interaction.customId.replace('proxy_', '');
      const cooldownKey = `${interaction.user.id}_${protocol}`;
      const now = Date.now();
      const cooldownTime = 60000; // 1 minute
      
      if (cooldowns.has(cooldownKey)) {
        const remaining = Math.ceil((cooldowns.get(cooldownKey) - now) / 1000);
        return interaction.reply({ 
          content: `Bu butonu kullanmak için ${remaining} saniye beklemelisin!`, 
          ephemeral: true 
        });
      }
      
      await interaction.deferReply({ ephemeral: true });
      
      const startTime = Date.now();
      const proxies = await setupCommand.fetchProxies(protocol);
      const timeTaken = Math.ceil((Date.now() - startTime) / 1000);
      
      // Set cooldown
      cooldowns.set(cooldownKey, now + cooldownTime);
      setTimeout(() => cooldowns.delete(cooldownKey), cooldownTime);
      
      // Build proxy list
      let proxyList = '';
      for (const p of proxies) {
        const info = getPingInfo(p.ping);
        proxyList += `${info.emoji} \`${p.proxy}\` - ${info.text}\n`;
      }
      
      if (!proxyList) proxyList = 'Proxy bulunamadı!';
      
      const embed = new EmbedBuilder()
        .setColor('#00ccff')
        .setTitle(`📋 ${protocol.toUpperCase()} Proxyleri`)
        .setDescription(proxyList)
        .setFooter({ text: `${timeTaken} Saniyede Bulundu` })
        .setTimestamp();
      
      const reply = await interaction.editReply({ embeds: [embed], ephemeral: true });
      
      // Delete message after cooldown
      setTimeout(() => {
        reply.delete().catch(err => console.error('Reply delete error:', err));
      }, cooldownTime);
    } catch (error) {
      console.error('Interaction error:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ content: 'Bir hata oluştu!', ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true }).catch(() => {});
      }
    }
  }
};
