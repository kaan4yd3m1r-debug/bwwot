const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = (title, description, color = config.color) => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}