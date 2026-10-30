# 📚 LexiNote — Çok Dilli Akıllı Not & Bilgi Yönetimi Sistemi (v0.1.0)

[![Canlı Web Uygulaması](https://img.shields.io/badge/Canl%C4%B1_Web-GitHub_Pages-brightgreen.svg)](https://alpbuz1611.github.io/lexinote/)
[![Android APK İndir](https://img.shields.io/badge/APK_%C4%B0ndir-Android-success.svg?logo=android)](https://github.com/alpbuz1611/lexinote/releases)
[![Windows EXE İndir](https://img.shields.io/badge/Windows_EXE-Windows_11-blue.svg?logo=windows)](https://github.com/alpbuz1611/lexinote/releases)
[![macOS DMG İndir](https://img.shields.io/badge/macOS_DMG-macOS-orange.svg?logo=apple)](https://github.com/alpbuz1611/lexinote/releases)
[![Sürüm](https://img.shields.io/badge/s%C3%BCr%C3%BCm-v0.1.0--beta-blue.svg)](https://github.com/alpbuz1611/lexinote/releases)
[![Lisans](https://img.shields.io/badge/lisans-MIT-green.svg)](LICENSE)
[![FreeDict](https://img.shields.io/badge/FreeDict-GPLv2%2B-orange.svg)](LICENSES.md)
[![ENABLE1](https://img.shields.io/badge/ENABLE1-Public_Domain-lightgrey.svg)](LICENSES.md)
[![Gizlilik](https://img.shields.io/badge/Gizlilik-%25100_Yerel_%26_Offline-success.svg)](https://github.com/alpbuz1611/lexinote)
[![Platform](https://img.shields.io/badge/Platform-Linux_|_Windows_11_|_macOS_|_Android-purple.svg)](https://github.com/alpbuz1611/lexinote)

🌐 **Canlı Web ve PWA Adresi:** [https://alpbuz1611.github.io/lexinote/](https://alpbuz1611.github.io/lexinote/)  
*For English documentation, see: [🇬🇧 English README](README.md)*

---

**LexiNote**, gizlilik odaklı, sıfır telemetri prensibiyle çalışan, **zengin metin düzenleme**, **bağlantılı not yönetimi (Knowledge Graph/Wiki-Links)** ve **%100 çevrimdışı çift dilli sözlük & imla denetimi** altyapısını tek bir çatı altında birleştiren açık kaynaklı bir masaüstü ve mobil not platformudur.

---

## 📑 İçindekiler
- [1. Temel Özellikler](#1-temel-özellikler)
- [2. Not Modları ve Temalar](#2-not-modları-ve-temalar)
- [3. Çevrimdışı Sözlük ve İmla Altyapısı](#3-çevrimdışı-sözlük-ve-imla-altyapısı)
- [4. Güvenlik ve AES-256 GCM Şifreleme](#4-güvenlik-ve-aes-256-gcm-şifreleme)
- [5. Sistem Mimarisi & Teknoloji Yığını](#5-sistem-mimarisi--teknoloji-yığını)
- [6. Kurulum ve Çalıştırma](#6-kurulum-ve-çalıştırma)
- [7. Windows 11 Masaüstü Kurulumu (.exe & PWA)](#7-windows-11-masaüstü-kurulumu-exe--pwa)
- [8. macOS Masaüstü Kurulumu (.dmg & .zip)](#8-macos-masaüstü-kurulumu-dmg--zip)
- [9. Mobil Kurulum (Android APK)](#9-mobil-kurulum-android-apk)
- [10. Adım Adım GitHub'a Yükleme Kılavuzu](#10-adım-adım-githuba-yükleme-kılavuzu)
- [11. Kapsamlı Kalite Güvencesi ve Test Paketi (268 Test)](#11-kapsamlı-kalite-güvencesi-ve-test-paketi-268-test)
- [12. Gelecek Sürüm Yol Haritası (v0.2+)](#12-gelecek-sürüm-yol-haritası-v02)
- [13. Lisanslar ve Hukuki Atıflar](#13-lisanslar-ve-hukuki-atıflar)

---

## 1. Temel Özellikler

- **🌐 %100 İngilizce Varsayılan Arayüz & İlk Kurulum Dil Seçimi (i18n):** Uygulama ilk açıldığında şık bir onboarding penceresiyle kullanıcıya dil tercihini (🇬🇧 English veya 🇹🇷 Türkçe) sorar. Üst menüden tek tıkla `EN / TR` arasında anlık geçiş yapılabilir.
- **🌌 İnteraktif Zihin & Bağlantı Haritası (Connected Mindmap & Knowledge Graph):** HTML5 Canvas tabanlı 60 FPS fizik simülasyonu; notlar arasındaki `[[Wiki-Bağlantıları]]` ve etiketleri canlı bir sinir ağı olarak görselleştirir.
  - **Uzay Boşluğu (Cosmic Void):** Nebula arka planı, 180+ parıldayan yıldız, parlayan gezegen düğümleri ve kenarlar üzerinde süzülen ışık dalgası (photon pulse) efektleri.
  - **Onyx Matrix (Saf Siyah):** OLED saf siyah (`#050505`), minimalist noktalı grid ve neon zümrüt/kehribar halkaları.
  - Sürükle-bırak düğümler, fare tekerleğiyle yakınlaşma/uzaklaşma (zoom/pan), arama filtreleme ve nota tıklayarak doğrudan editörde açma.
- **🔒 %100 Yerel ve Gizlilik Odaklı (Local-First):** Hiçbir harici API'ye, buluta veya telemetri sunucusuna veri göndermez. Notlarınız yalnızca sizin cihazınızda yaşar.
- **📝 Zengin Metin Düzenleme (Rich Text WYSIWYG):** Başlıklar (H1, H2, H3), kalın, italik, altı çizili, üstü çizili, madde imleri, numaralı listeler, kod blokları, alıntılar, tablolar ve renk paletleri.
- **🔗 Çift Yönlü Not Bağlantıları (Wiki-Links):** Metin içinde `[[Not Başlığı]]` yazarak notlar arasında örümcek ağı benzeri bilgi bağlantıları kurun; sağ panelde gelen ve giden referansları anlık izleyin.
- **🛡️ Hatasız İmla Denetimi & Öneri Motoru:** `gurur` gibi kelimelerin `huzur`a çevrilmesi gibi yanlış düzeltmeler kesin olarak engellenmiştir. Levenshtein mesafesi kontrollü çalışır.
- **📖 Gömülü 82.000+ Kayıtlı Sözlük:** FreeDict TEI ve ENABLE1 veri tabanları kod bölünmesiyle (code-splitting) uygulamaya gömülüdür; anlık çeviri ve sözlük sorguları milisaniyeler içinde çevrimdışı yanıtlanır.
- **🌙 Kusursuz Karanlık Mod (Dark Mode):** Hem profesyonel lacivert hem de sıcak sepya temaları için özel tasarlanmış, gözü yormayan gece modları.
- **🔤 Tamamen Yerel Tipografi:** Google Fonts CDN bağımlılığı olmadan paketlenmiş Noto Sans, Noto Serif ve DejaVu Sans Mono fontları.

---

## 2. Not Modları ve Temalar

LexiNote, farklı çalışma senaryoları için özelleştirilmiş 3 farklı not türü sunar:

### A. 💼 Professional (İş & Proje Notu)
- **Kullanım Alanı:** Araştırma raporları, toplantı tutanakları, proje planları, sprint takipleri.
- **Dahili Bileşenler:** 
  - Görev ve teslim listesi (Checklist)
  - Öncelik rozeti (`Düşük`, `Orta`, `Yüksek`, `Kritik`)
  - Teslim tarihi (Deadline) ve durum göstergeleri
- **Renk Paleti:** Kurumsal Koyu Arduvaz (`#243B53`), Taş Grisi (`#E8ECEF`), Gece Mavisi (`#0F172A`).

### B. 📖 Journal (Kişisel Günlük & Tefekkür)
- **Kullanım Alanı:** Günlük tutma, duygu günlüğü, kişisel gelişim ve düşünce notları.
- **Dahili Bileşenler:** 
  - Ruh hali seçici (Mood Tracker: 😊 Mutlu, 🌿 Sakin, 🎯 Odaklanmış, ⚡ Enerjik vb.)
  - Hava durumu seçici (Güneşli, Yağmurlu, Bulutlu vb.)
  - **İsteğe Bağlı** Günün Tefekkür Sorusu (Tek tıkla gizlenebilir / yeni soru üretilebilir)
  - **İsteğe Bağlı** Günlük Şükran Kartı (Tek tıkla gizlenebilir / genişletilebilir)
- **Renk Paleti:** Sıcak Krem (`#FAF8F5`), Kağıt Dokusu (`#F4EFEA`), Sıcak Sepya (`#8C6D58`).

### C. 📄 Sade Not (Boş Sayfa — Minimalist Mod)
- **Kullanım Alanı:** Yalnızca yazıya odaklanmak isteyen yazarlar, serbest düşünce akışları veya hızlı karalamalar.
- **Dahili Bileşenler:** Sağda veya solda hiçbir widget, görev listesi, ruh hali seçici veya bağlantı kutusu yer almaz. Dümdüz, temiz ve dikkat dağıtmayan bir beyaz/koyu sayfa sunar.

---

## 3. Çevrimdışı Sözlük ve İmla Altyapısı

LexiNote, internet bağlantısına ihtiyaç duymayan hibrit bir sözlük ve imla mimarisine sahiptir:

| Sözlük / Veri Kaynağı | Kapsam / Boyut | Lisans | Entegrasyon Durumu |
| :--- | :--- | :--- | :--- |
| **FreeDict (English ➔ Turkish)** | 34.405 Madde Başı, 68.000+ Tanım | GPL-2.0-or-later | ✅ Doğrulandı (`freedict_eng_tur.json`) |
| **FreeDict (Turkish ➔ English)** | 48.294 Madde Başı Ters Dizin | GPL-2.0-or-later | ✅ Doğrulandı (`freedict_tur_eng.json`) |
| **ENABLE1 (Scrabble/Norvig)** | 172.820 Doğrulanmış İngilizce Kelime | Public Domain | ✅ Doğrulandı (`enable1Data.js`) |
| **TDK & Türkçe Kelime Listesi** | 15.000+ Temel Türkçe Sözcük | Açık Kaynak İmla Listesi | ✅ Doğrulandı (`tdkTurkishWords.js`) |
| **Özel Kullanıcı Terimleri** | Dinamik (Kullanıcı Tarafından Eklenenler) | Kullanıcıya Özel | ✅ Doğrulandı (`indexedDB` / `localStorage`) |

### Doğal Dil & Sentaks Tabanlı Çeviri Motoru
Seçilen bir metin veya kelime çevrilmek istendiğinde LexiNote:
1. FreeDict TEI tabanında tam eşleşme arar.
2. Birden fazla anlam varsa bağlama göre numaralandırılmış liste sunar (`1. yurtdışında, 2. gurbette`).
3. Çok kelimeli kalıplarda İngilizce SVO (Özne-Yüklem-Nesne) sentaksını Türkçe SOV (Özne-Nesne-Yüklem) kurallarına dönüştüren yerel kural motorunu işletir.

### Güvenli İmla Denetimi (Spellcheck)
- **False-Positive Koruması:** Kelimeleri zorla başka kelimelere dönüştürmez. Kullanıcının yazdığı kelime geçerli bir Türkçe veya İngilizce kelime ise (`gurur`, `huzur`, `international`) imla hatası olarak işaretlenmez.
- **Toplu Denetim Modalı:** Not genelinde tek tıkla tarama yapar; İngilizce, Türkçe ve Çok Dilli sekmelerle kelime bazında düzeltme veya "Sözlüğüme Ekle" imkanı sunar.

---

## 4. Güvenlik ve AES-256 GCM Şifreleme

Kişisel notlar ve kurumsal iş dokümanları için LexiNote donanım destekli şifreleme sunar:
- **Algoritma:** AES-GCM (Galois/Counter Mode) 256-bit
- **Anahtar Türetme:** PBKDF2 (SHA-256 ile 100.000 iterasyon)
- **Tuz (Salt) & IV:** Her not için kriptografik olarak güvenli rastgele 16-byte Salt ve 12-byte IV (Initialization Vector) üretilir.
- **Sıfır Bilgi Mimarisi (Zero-Knowledge):** Parolanız hiçbir zaman diskte veya hafızada düz metin olarak saklanmaz. Parola unutulursa şifreli notlar matematiksel olarak kurtarılamaz.

---

## 5. Sistem Mimarisi & Teknoloji Yığını

```
├── electron/
│   └── main.cjs               # Electron masaüstü kapsayıcısı (güvenli IPC)
├── public/
│   ├── fonts/                 # Çevrimdışı Noto & DejaVu font dosyaları
│   ├── icons/                 # PWA ve uygulama simgeleri (192px, 512px, svg)
│   ├── manifest.json          # PWA Progressive Web App tanımlayıcısı
│   ├── sw.js                  # Service Worker (Çevrimdışı önbellekleme)
│   └── LICENSES.md            # GPLv2+ ve Public Domain yasal atıf metinleri
├── src/
│   ├── assets/fonts/          # Vite bundle gömülü TTF fontları
│   ├── components/
│   │   ├── Editor.jsx         # Zengin metin editörü & not modları
│   │   ├── Sidebar.jsx        # Gelişmiş not ağacı, arama, filtreler
│   │   ├── BatchSpellcheckModal.jsx # Çok dilli imla denetimi penceresi
│   │   ├── DictionaryModal.jsx# FreeDict sözlük arayüzü
│   │   ├── EncryptionModal.jsx# AES-256 şifreleme/çözme arabirimi
│   │   └── NewNoteModal.jsx   # 3'lü not türü oluşturma diyaloğu
│   ├── data/
│   │   ├── freedict/          # 82.000+ kayıtlı çift dilli FreeDict veritabanı
│   │   ├── enable1Data.js     # 172.820 kelimelik İngilizce corpus
│   │   └── defaultNotes.js    # Başlangıç şablonları
│   └── utils/
│       ├── offlineDictionaries.js # Hibrit arama & morfolojik analiz motoru
│       └── cryptoUtils.js     # WebCrypto AES-GCM 256-bit motoru
├── .github/workflows/
│   └── build-apk.yml          # Otomatik Android APK CI/CD derleme hattı
└── package.json               # React 19, Vite 6, Tailwind v4, Electron 45
```

---

## 6. Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ (Node.js 20 veya 22 önerilir)
- npm veya pnpm

### Depoyu Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone https://github.com/alpbuz1611/lexinote.git
cd lexinote
npm install
```

### 1. Masaüstü Uygulaması Olarak Çalıştırma (Önerilen)
Masaüstü penceresi olarak başlatmak için:
```bash
chmod +x baslat.sh
./baslat.sh
```
veya:
```bash
npm run desktop
```

### 2. Web Tarayıcısında Çalıştırma
```bash
npm run dev
```
Uygulama `http://localhost:5252` adresinde açılır (5252 portu sabitlenmiştir).

### 3. Üretim Derlemesi (Production Build)
```bash
npm run build
```
Derleme çıktısı `dist/` klasörüne tamamen statik ve optimize edilmiş olarak oluşturulur.

---

## 7. Windows 11 Masaüstü Kurulumu (.exe & PWA)

LexiNote, Windows 11 üzerinde bağımsız bir masaüstü uygulaması olarak çalışır:

### Seçenek A: Doğrudan Windows Kurulum Dosyası (.exe)
Doğrudan Windows `.exe` kurulum paketini indirin:

[![Windows EXE İndir](https://img.shields.io/badge/⬇️_%C4%B0ndir-Windows_EXE_(Setup)-blue?style=for-the-badge&logo=windows)](https://github.com/alpbuz1611/lexinote/releases)

1. **[Windows EXE İndir](https://github.com/alpbuz1611/lexinote/releases)** butonuna tıklayın (veya doğrudan: [LexiNote.Setup.0.1.0.exe](https://github.com/alpbuz1611/lexinote/releases/download/v0.1.0/LexiNote.Setup.0.1.0.exe) | Portable: [LexiNote.0.1.0.exe](https://github.com/alpbuz1611/lexinote/releases/download/v0.1.0/LexiNote.0.1.0.exe)).
2. İndirilen setup dosyasına çift tıklayarak kurun; Başlat Menüsü ve Masaüstü kısayollarıyla bağımsız pencerede internetsiz kullanın.

### Seçenek B: Tarayıcı Üzerinden PWA Masaüstü Kurulumu
1. Canlı web adresini açın: **[https://alpbuz1611.github.io/lexinote/](https://alpbuz1611.github.io/lexinote/)** (Edge veya Chrome ile).
2. Adres çubuğunun sağındaki **"Uygulamayı Yükle"** simgesine tıklayın.
3. Windows 11 Görev Çubuğuna ve Başlat Menüsüne yerel bir uygulama gibi sabitlenecektir.

---

## 8. macOS Masaüstü Kurulumu (.dmg & .zip)

LexiNote, macOS (Apple Silicon M serisi ve Intel işlemcili Mac'ler) üzerinde yerel masaüstü uygulaması olarak çalışır:

[![macOS DMG İndir](https://img.shields.io/badge/⬇️_%C4%B0ndir-macOS_DMG_(Apple_Silicon_&_Intel)-orange?style=for-the-badge&logo=apple)](https://github.com/alpbuz1611/lexinote/releases)

1. **[macOS DMG İndir](https://github.com/alpbuz1611/lexinote/releases)** butonuna tıklayın (veya doğrudan: [LexiNote-0.1.0.dmg](https://github.com/alpbuz1611/lexinote/releases/download/v0.1.0/LexiNote-0.1.0.dmg) | Taşınabilir: [LexiNote-0.1.0-mac.zip](https://github.com/alpbuz1611/lexinote/releases/download/v0.1.0/LexiNote-0.1.0-mac.zip)).
2. İndirilen `.dmg` disk imajını açın.
3. **LexiNote** simgesini **Applications** (Uygulamalar) klasörüne sürükleyip bırakın.
4. Launchpad veya Spotlight üzerinden LexiNote'u sıfır telemetri ve %100 yerel hızla başlatın.

---

## 9. Mobil Kurulum (Android APK)

LexiNote'u Android telefon veya tabletinize doğrudan APK olarak kurun:

[![Android APK İndir](https://img.shields.io/badge/⬇️_%C4%B0ndir-Android_APK_(v0.1.0)-success?style=for-the-badge&logo=android)](https://github.com/alpbuz1611/lexinote/releases)

1. **[Android APK İndir](https://github.com/alpbuz1611/lexinote/releases)** butonuna tıklayın (veya doğrudan [lexinote-v0.1.0.apk](https://github.com/alpbuz1611/lexinote/releases/download/v0.1.0/lexinote-v0.1.0.apk)).
2. İndirilen `.apk` dosyasına dokunarak **Yükle** deyin ve LexiNote'u telefonunuzda %100 internetsiz kullanın!

> ⚠️ **Fiziksel Cihaz Uyumluluk Bildirimi:** Capacitor Android derleme ve paketleme süreçleri hatasız tamamlanmış olmakla birlikte, belirli donanımlar (ör. Samsung Galaxy S24 Ultra) üzerindeki fiziksel dokunmatik ve jest etkileşimleri, fiziksel laboratuvar koşullarında cihaz testi yapılana kadar resmi olarak **TEST EDİLMEDİ (NOT TESTED)** statüsündedir.

---

## 10. Adım Adım GitHub'a Yükleme Kılavuzu

Projenizi GitHub'a yüklemek için aşağıdaki adımları sırasıyla uygulayabilirsiniz:

### Adım 1: GitHub'da Yeni Depo Oluşturun
1. [GitHub](https://github.com) hesabınıza giriş yapın.
2. Sağ üstteki **`+`** simgesine tıklayıp **"New repository"** seçin.
3. Depo adı olarak `lexinote` yazın.
4. Gizlilik ayarını isteğinize göre **Public** (Açık) veya **Private** (Gizli) seçin.
5. *"Initialize this repository with a README"* seçeneğini **İŞARETLEMEYİN** (Depomuzda zaten tam teşekküllü bir README mevcuttur).
6. **"Create repository"** butonuna tıklayın.

### Adım 2: Yerel Depoyu Bağlayın ve Yükleyin
Bilgisayarınızdaki proje klasöründe terminali açıp şu komutları çalıştırın:

```bash
cd /home/yigitalpbuz/.gemini/antigravity/scratch/lexinote

# 1. GitHub uzak deposunu bağlayın
git remote add origin https://github.com/alpbuz1611/lexinote.git

# 2. Kodları GitHub'a gönderin
git push -u origin main
```

---

## 11. Kapsamlı Kalite Güvencesi ve Test Paketi (268 Test)

LexiNote, veri tutarlılığı, kriptografik gizlilik, IndexedDB ölçekleme ve çevrimdışı sözlük bütünlüğünü garanti altına alan 268 adet otomatik teste sahiptir:

```bash
# Tüm master test paketini çalıştırın (268 otomatik test)
npm test
```

Master test paketi şu 3 ana modülden oluşur:
1. **v0.1.0 Kapsamlı Kalite Denetimi:** 148 otomatik test (`scripts/qa_audit/run_all_audits.js`)
2. **IndexedDB Depolama Motoru & Stres Testi:** 83 otomatik test (`scripts/qa_indexeddb/run_all_indexeddb_tests.js`)
3. **Uçtan Uca Sürüm ve Çeviri Doğrulama:** 37 otomatik test (`scripts/verify_e2e_release.js`)

Ayrıntılı performans kıyaslamaları (1.000 not toplu yazma: 91 ms, tekil not okuma: 0.06 ms), 100.000 kelimelik metin dayanıklılığı ve hata kurtarma protokolleri için resmi [📄 Kapsamlı QA Raporu](docs/QA_REPORT.md) belgesini inceleyebilirsiniz.

### Test Sonuç Özeti
```text
################################################################
🛡️  LEXINOTE MASTER QUALITY ASSURANCE & VERIFICATION SUITE
################################################################
Aşama 1: Veri Tutarlılığı & CRUD           :  16 Başarılı, 0 Hatalı
Aşama 2: Güvenlik & Kriptografi Denetimi   :  17 Başarılı, 0 Hatalı
Aşama 3: Zengin Metin Editörü & Not Modları:  33 Başarılı, 0 Hatalı
Aşama 4: Çevrimdışı Sözlük & İmla Denetimi :  19 Başarılı, 0 Hatalı
Aşama 5: WikiLinks, Grafik & Zihin Haritası:  48 Başarılı, 0 Hatalı
Aşama 6: Çapraz Platform Paketleme Yolları :  10 Başarılı, 0 Hatalı
Aşama 7: Performans & Gecikme Ölçümleri    :   5 Başarılı, 0 Hatalı
Aşama 8: IndexedDB Motoru & Stres/Ölçek    :  83 Başarılı, 0 Hatalı
Aşama 9: E2E Sözlük, Çok Anlamlılık & SOV  :  37 Başarılı, 0 Hatalı
----------------------------------------------------------------
TOPLAM: 268 BAŞARILI, 0 HATALI (%100.0 BAŞARI ORANI)
################################################################
```

---

## 12. Gelecek Sürüm Yol Haritası (v0.2+)

LexiNote'u küresel çapta öne çıkaracak bir sonraki geliştirme hedefleri:

1. **🌐 WebRTC / Local Wi-Fi P2P Not Senkronizasyonu:** Buluta veya sunucuya gerek kalmadan, aynı Wi-Fi ağındaki bilgisayar ve telefon arasında uçtan uca şifreli anlık not eşitleme.
2. **🕸️ 2D/3D Etkileşimli Not İlişki Grafiği (Canvas Graph View):** Notlar arasındaki `[[bağlantıları]]` görsel bir ağaç ve düğüm haritası olarak canlandıran interaktif tuval.
3. **🎙️ Yerel WebSpeech / Whisper Çevrimdışı Sesli Not Alma:** Kullanıcı konuşurken notu metne döken ve otomatik noktalama uygulayan yerel ses tanıma.
4. **📊 Akıllı Markdown / PDF / ePub Dışa Aktarımı:** Notları şık biçimlendirilmiş akademik PDF veya kitapçık formatında tek tıkla dışa aktarma.
5. **🏷️ Otomatik Anlamsal Etiketleme (Semantic Tagging):** Notun içeriğindeki anahtar kelimeleri tespit edip otomatik etiket öneren yerel kural motoru.

---

## 13. Lisanslar ve Hukuki Atıflar

- **Uygulama Kodu:** MIT License © 2026 LexiNote Contributors.
- **Sözlük Verisi:** FreeDict English–Turkish & Turkish–English sözlük verileri **GNU General Public License v2.0 or later (GPL-2.0-or-later)** ile lisanslanmıştır. Ayrıntılı yasal metin için [LICENSES.md](LICENSES.md) dosyasına bakınız.
- **Kelime Listesi:** ENABLE1 kelime listesi Public Domain (Kamu Malı) kapsamındadır.
- **İkonlar:** Lucide Icons (ISC License).
- **Yazı Tipleri:** Google Noto Fonts (SIL Open Font License 1.1), DejaVu Fonts (Bitstream Vera License).
