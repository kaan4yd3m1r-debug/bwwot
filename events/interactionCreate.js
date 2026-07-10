const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const net = require('net');

// Proxy stores
const proxyStore = {
  http: [],
  https: [],
  socks4: [],
  socks5: []
};
const maxProxies = 20;
const cooldowns = new Map();

// Fetch proxies from free API (replace with better one if needed)
async function fetchProxies(protocol) {
  try {
    const apiUrls = {
      http: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
      https: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=10000&country=all&ssl=all&anonymity=all',
      socks4: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=10000&country=all&ssl=all&anonymity=all',
      socks5: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all'
    };
    
    const response = await axios.get(apiUrls[protocol], { timeout: 30000 });
    const proxies = response.data.split('\n').filter(p => p.trim()).slice(0, maxProxies);
    
    // Check ping for each proxy
    const checkedProxies = [];
    for (const proxy of proxies) {
      const [host, portStr] = proxy.split(':');
      const port = parseInt(portStr);
      if (!host || !port) continue;
      
      const ping = await checkPing(host, port);
      checkedProxies.push({ proxy, ping });
    }
    
    proxyStore[protocol] = checkedProxies;
    return checkedProxies;
  } catch (error) {
    console.error(`Proxy fetch error for ${protocol}:`, error);
    return [];
  }
}

// Check TCP ping
function checkPing(host, port) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      const ping = Date.now() - start;
      socket.destroy();
      resolve(ping);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(null);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(null);
    });
    
    socket.connect(port, host);
  });
}

// Get ping emoji and color
function getPingInfo(ping) {
  if (ping === null) return { emoji: '❌', color: '#990000', text: 'Ölü' };
  if (ping < 500) return { emoji: '⚡', color: '#00cc00', text: `${ping}ms` };
  if (ping < 3000) return { emoji: '🟡', color: '#ffcc00', text: `${ping}ms` };
  return { emoji: '🔴', color: '#ff3300', text: `${ping}ms` };
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      // Slash commands
      if (interaction.isChatInputCommand()) {
        // /csetup
        if (interaction.commandName === 'csetup') {
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için admin olmalısın!', ephemeral: true });
          }
          
          // Fetch proxies first
          await Promise.all([
            fetchProxies('http'),
            fetchProxies('https'),
            fetchProxies('socks4'),
            fetchProxies('socks5')
          ]);
          
          const embed = new EmbedBuilder()
            .setColor('#00ccff')
            .setTitle('🚀 Chivas Proxy Hizmetleri')
            .setDescription('Aşağıdaki butonlardan istediğiniz proxy türünü seçin!')
            .addFields(
              { name: '🌐 HTTP', value: `${proxyStore.http.length}/${maxProxies}`, inline: true },
              { name: '🔒 HTTPS', value: `${proxyStore.https.length}/${maxProxies}`, inline: true },
              { name: '🧦 SOCKS4', value: `${proxyStore.socks4.length}/${maxProxies}`, inline: true },
              { name: '🧦 SOCKS5', value: `${proxyStore.socks5.length}/${maxProxies}`, inline: true }
            )
            .setTimestamp();
          
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('proxy_http')
                .setLabel('HTTP Proxyleri')
                .setEmoji('🌐')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId('proxy_https')
                .setLabel('HTTPS Proxyleri')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId('proxy_socks4')
                .setLabel('SOCKS4 Proxyleri')
                .setEmoji('🧦')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId('proxy_socks5')
                .setLabel('SOCKS5 Proxyleri')
                .setEmoji('🧦')
                .setStyle(ButtonStyle.Primary)
            );
          
          await interaction.channel.send({ embeds: [embed], components: [row] });
          await interaction.reply({ content: 'Proxy paneli oluşturuldu!', ephemeral: true });
        }
        return;
      }
      
      // Buttons
      if (interaction.isButton()) {
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
        const proxies = await fetchProxies(protocol);
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
      }
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
