const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const net = require('net');
const createEmbed = require('../utils/embed');

// Proxy stores
const proxyStore = {
  http: [],
  https: [],
  socks4: [],
  socks5: []
};
const maxProxies = 20;

// Fetch proxies from free API
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

module.exports = {
  name: 'setup',
  description: 'Proxy panelini oluşturur (sadece adminler)',
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için admin olmalısın!', '#ff0000')] });
      }
      
      // Delete command message
      await message.delete().catch(() => {});
      
      // Fetch proxies first
      await Promise.all([
        fetchProxies('http'),
        fetchProxies('https'),
        fetchProxies('socks4'),
        fetchProxies('socks5')
      ]);
      
      const embed = new EmbedBuilder()
        .setColor('#00ccff')
        .setTitle('🚀 Bo Sinn 1953 Proxy Hizmetleri')
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
      
      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Setup error:', error);
    }
  }
};

// Export for interaction handling
module.exports.proxyStore = proxyStore;
module.exports.fetchProxies = fetchProxies;
module.exports.checkPing = checkPing;
