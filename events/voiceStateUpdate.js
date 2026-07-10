module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    try {
      if (oldState.member.id === client.user.id && !newState.channelId) {
        const timer = client.voiceTimers.get(oldState.guild.id);
        if (timer) {
          clearTimeout(timer);
          client.voiceTimers.delete(oldState.guild.id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}