module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
    client.user.setActivity('c!yardim yazarak komutları gör!');
  }
};
