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

// Fetch proxies from free API (without ping checks for speed)
async function fetchProxiesBasic(protocol) {
  try {
    const apiUrls = {
      http: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
      https: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=10000&country=all&ssl=all&anonymity=all',
      socks4: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=10000&country=all&ssl=all&anonymity=all',
      socks5: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all'
    };
    
    const response = await axios.get(apiUrls[protocol], { timeout: 10000 });
    const proxies = response.data.split('\n').filter(p => p.trim()).slice(0, maxProxies);
    
    // Store just the proxy strings for setup speed
    proxyStore[protocol] = proxies.map(p => ({ proxy: p, ping: null }));
    return proxyStore[protocol];
  } catch (error) {
    console.error(`Proxy fetch error for ${protocol}:`, error);
    return [];
  }
}

// Fetch proxies with ping checks
async function fetchProxies(protocol) {
  try {
    const apiUrls = {
      http: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
      https: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=10000&country=all&ssl=all&anonymity=all',
      socks4: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=10000&country=all&ssl=all&anonymity=all',
      socks5: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all'
    };
    
    const response = await axios.get(apiUrls[protocol], { timeout: 10000 });
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
    socket.setTimeout(3000); // Faster timeout
    
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
  if (ping === null) return { emoji: '❌', text: 'Ölü' };
  if (ping < 500) return { emoji: '⚡', text: `${ping}ms` };
  if (ping < 3000) return { emoji: '🟡', text: `${ping}ms` };
  return { emoji: '🔴', text: `${ping}ms` };
}

module.exports = {
  name: 'setup',
  description: 'Proxy panelini oluşturur (sadece adminler)',
  proxyStore,
  maxProxies,
  fetchProxies,
  checkPing,
  getPingInfo,
  async execute(message, args, client) {
    try {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ embeds: [createEmbed('Hata', 'Bu komutu kullanmak için admin olmalısın!', '#ff0000')] });
      }
      
      // Delete command message
      await message.delete().catch(() => {});
      
      // Fetch proxies quickly (without pings)
      await Promise.all([
        fetchProxiesBasic('http'),
        fetchProxiesBasic('https'),
        fetchProxiesBasic('socks4'),
        fetchProxiesBasic('socks5')
      ]);
      
      // Create panel embed
      const embed = new EmbedBuilder()
        .setColor('#00ccff')
        .setTitle('🚀 Chivas Proxy Hizmetleri')
        .setDescription('Aşağıdaki butonlardan istediğiniz proxy türünü seçin!')
        .addFields(
  {
    name: '🌐 HTTP PROXY',
    value: `### ${proxyStore.http.length}/${maxProxies} Proxy`,
    inline: false
  },
  {
    name: '🔒 HTTPS PROXY',
    value: `### ${proxyStore.https.length}/${maxProxies} Proxy`,
    inline: false
  },
  {
    name: '🧦 SOCKS4 PROXY',
    value: `### ${proxyStore.socks4.length}/${maxProxies} Proxy`,
    inline: false
  },
  {
    name: '🧦 SOCKS5 PROXY',
    value: `### ${proxyStore.socks5.length}/${maxProxies} Proxy`,
    inline: false
  }
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
      
      // Send the panel immediately
      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Setup error:', error);
      try {
        await message.channel.send({
          embeds: [createEmbed('Hata', 'Proxy paneli oluşturulurken bir hata oluştu!', '#ff0000')]
        });
      } catch (err) {
        console.error('Error sending setup error message:', err);
      }
    }
  }
};
