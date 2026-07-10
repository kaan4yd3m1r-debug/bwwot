module.exports = {
  name: 'turkmenler',
  description: 'Gizli komut',
  async execute(message, args, client) {
    try {
      const reply = await message.channel.send(`ÇOCUK : EGE TÜRKMEN 
 EŞCİNSEL BABA : TUNCAY TURKMEN 
 LEZ ANNE : SEVİDE 
 MOLOTOV MAKER ABİLERİ`);
      setTimeout(() => {
        reply.delete().catch(err => console.error(err));
        message.delete().catch(err => console.error(err));
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  }
}