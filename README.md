# Discord Bot

Profesyonel Discord botu, discord.js v14 ile geliştirildi.

## Kurulum

1. `.env.example` dosyasını `.env` olarak kopyalayın ve `TOKEN` kısmına bot tokeninizi yazın.
2. Bağımlılıkları yükleyin: `npm install`
3. Botu çalıştırın: `npm start`

## Özellikler

- Otomatik mesaj cevapları
- Eğlence komutları
- Yönetim komutları
- Ses kanalına girip ses dosyası çalma

## Komutlar

### Eğlence
- `c!eglendir`: Ses kanalına girip osuruk.mp3 çalar
- `c!zar`: 1-6 arası rastgele sayı atar
- `c!yazitura`: Yazı veya tura atar
- `c!kac`: Rastgele üyeyi etiketleyip "kaç lan" yazar
- `c!sans @üye`: 0-100 arası şans yüzdesi gösterir
- `c!vs @üye1 @üye2`: Rastgele kazanan seçer

### Yönetim (Sadece Administrator yetkisi olanlar)
- `c!tasi @kullanici #ses-kanali`: Kullanıcıyı ses kanalına taşır
- `c!lock`: Kanalı kilitle
- `c!unlock`: Kanalı aç
- `c!c isim metin/ses`: Metin veya ses kanalı oluştur
- `c!kategori isim`: Kategori oluştur
- `c!tasikanal #kanal KategoriAdı`: Kanalı kategoriye taşı

## Ses Dosyası

`sounds/osuruk.mp3` dosyasını eklemeyi unutmayın!
