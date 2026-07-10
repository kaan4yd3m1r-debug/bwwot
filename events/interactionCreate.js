const { EmbedBuilder } = require('discord.js');
const setupCommand = require('../commands/setup');

const cooldowns = new Map();

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    try {
      if (!interaction.isButton()) return;

      const protocol = interaction.customId.replace('proxy_', '');
      const cooldownKey = `${interaction.user.id}_${protocol}`;
      const now = Date.now();
      const cooldownTime = 30000;

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

      cooldowns.set(cooldownKey, now + cooldownTime);

      setTimeout(() => {
        cooldowns.delete(cooldownKey);
      }, cooldownTime);

      let proxyList = '';

      for (const p of proxies) {
        const info = setupCommand.getPingInfo(p.ping);

        proxyList += `🌍 **${p.proxy}** → ${info.emoji} ${info.text}\n`;
      }

      if (!proxyList) {
        proxyList = '❌ Proxy bulunamadı!';
      }

      const embed = new EmbedBuilder()
        .setColor('#00ccff')
        .setTitle(`📋 ${protocol.toUpperCase()} Proxyleri`)
        .setDescription(
          `**Toplam:** ${proxies.length}/${setupCommand.maxProxies}\n\n${proxyList}`
        )
        .setFooter({
          text: `${timeTaken} Saniyede Bulundu`
        })
        .setTimestamp();

      const reply = await interaction.editReply({
        embeds: [embed],
        ephemeral: true
      });

      setTimeout(() => {
        reply.delete().catch(() => {});
      }, cooldownTime);

    } catch (error) {
      console.error('Interaction error:', error);

      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
          content: 'Bir hata oluştu!'
        }).catch(() => {});
      } else {
        await interaction.reply({
          content: 'Bir hata oluştu!',
          ephemeral: true
        }).catch(() => {});
      }
    }
  }
};