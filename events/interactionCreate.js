const { EmbedBuilder } = require('discord.js');
const setupCommand = require('../commands/setup');

const cooldowns = new Map();

module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {
    try {
      if (!interaction.isButton()) return;

      const protocol = interaction.customId.replace('proxy_', '');
      const cooldownKey = `${interaction.user.id}_${protocol}`;
      const now = Date.now();
      const cooldownTime = 30000;

      if (cooldowns.has(cooldownKey)) {
        const remaining = Math.ceil((cooldowns.get(cooldownKey) - now) / 1000);

        return interaction.reply({
          content: `Bu butonu tekrar kullanmak için **${remaining} saniye** beklemelisin.`,
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      const startTime = Date.now();

      const proxies = await setupCommand.fetchProxies(protocol);

      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);

      cooldowns.set(cooldownKey, now + cooldownTime);

      setTimeout(() => cooldowns.delete(cooldownKey), cooldownTime);

      let proxyList = '';

      for (const p of proxies) {
        const info = setupCommand.getPingInfo(p.ping);

        proxyList += `🌍 **${String(p.proxy).trim()}** ${info.emoji} **${info.text}**\n`;
      }

      if (!proxyList) {
        proxyList = '❌ Proxy bulunamadı.';
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📋 ${protocol.toUpperCase()} Proxyleri`)
        .addFields(
          {
            name: `📦 Toplam Proxy`,
            value: `**${proxies.length}/${setupCommand.maxProxies}**`,
            inline: false
          },
          {
            name: '🌍 Proxy Listesi',
            value: proxyList,
            inline: false
          }
        )
        .setFooter({
          text: `${timeTaken} saniyede bulundu`
        })
        .setTimestamp();

      const reply = await interaction.editReply({
        embeds: [embed]
      });

      setTimeout(() => {
        interaction.deleteReply().catch(() => {});
      }, cooldownTime);

    } catch (error) {
      console.error(error);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: '❌ Bir hata oluştu.'
        }).catch(() => {});
      } else {
        await interaction.reply({
          content: '❌ Bir hata oluştu.',
          ephemeral: true
        }).catch(() => {});
      }
    }
  }
};
