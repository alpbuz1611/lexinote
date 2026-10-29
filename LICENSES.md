# 📜 LexiNote — Veri Kaynakları ve Lisans Bildirimleri (Legal & Data Notices)

Bu belgede LexiNote uygulamasında kullanılan tüm çevrimdışı sözlük, kelime listesi, yazım denetimi ve veri katmanlarının resmi kaynakları, sürümleri, lisans koşulları ve dağıtım yükümlülükleri ayrıntılı olarak belgelenmiştir.

---

## 1. İngilizce-Türkçe Anlam ve Çeviri Sözlüğü (FreeDict)

* **Resmi Proje**: [FreeDict — Free Bilingual Dictionaries](https://freedict.org/)
* **Sözlük Adı**: English–Turkish FreeDict Dictionary (`eng-tur`)
* **Sözlük Sürümü**: **0.3** (Yayım Tarihi: 03.12.2017)
* **Resmi İndirme Adresi**:
  * [https://download.freedict.org/dictionaries/eng-tur/0.3/freedict-eng-tur-0.3.src.tar.xz](https://download.freedict.org/dictionaries/eng-tur/0.3/freedict-eng-tur-0.3.src.tar.xz)
  * Kaynak Kod Deposu: [https://github.com/freedict/fd-dictionaries/tree/master/eng-tur](https://github.com/freedict/fd-dictionaries/tree/master/eng-tur)
* **Veri Biçimi ve Yapısı**: TEI P5 XML (`eng-tur.tei`). XML hiyerarşisinde `<entry>`, `<form><orth>`, `<sense><cit type="trans"><quote>` etiketleriyle çoklu anlamlar ve deyimsel ifadeler yapılandırılmıştır.
* **Kelime Kapsamı**: 
  * TEI XML Giriş Sayısı: **36.589** madde başı
  * Tekil İngilizce Madde Başı: **34.405** kelime
  * Türkçe Ters İndeks: **48.294** kelime/ifade
* **Lisans**: **GNU General Public License v2.0 or later (GPL-2.0-or-later)**
* **Telif Hakkı & Katkıda Bulunanlar**:
  * Copyright (C) 1999–2017 by various authors.
  * Dönüştüren & Derleyen: Michael Bunk, Sebastian Humenda, Piotr Bański, Valentino, Karl Bartel.
  * Orijinal Kaynak Dayanağı: `gtksozluk2` (Linux Programlama).

### Dağıtım, Değiştirme ve Yeniden Dağıtım Koşulları (GPLv2+)
1. **Kaynak Kod Paylaşım Yükümlülüğü**: GPLv2+ uyarınca, bu sözlük verisi ve veriyi dönüştüren betikler (`scripts/parse_freedict.py`) ile türetilmiş veri dosyaları (`freedict_eng_tur.json`) projede açık olarak sunulmalıdır.
2. **Değişiklik Bildirimi**: Sözlük verisinde yapılan format dönüştürme ve indeksleme işlemleri belgelenmiştir.
3. **Telif ve Lisans Metni**: FreeDict telif hakkı ve GPL bildirimleri korunmalıdır.

### Ticari Dağıtım ve Mobil / Google Play Store Yayını Değerlendirmesi
* **Ticari Dağıtım**: GPL lisansı verinin ticari amaçla dağıtılmasına engel değildir; ancak GPL'in getirdiği **copyleft** (kaynak kodun alıcıya sunulması ve kısıtlama getirilememesi) yükümlülüğü geçerlidir.
* **Google Play / App Store Yükümlülükleri**:
  * GPL ile lisanslanmış veriyi içeren bir uygulama Google Play üzerinde dağıtıldığında, uygulamanın kaynak kodu (veya GPL ile lisanslı veri/bağlantı katmanı) kullanıcılara açık kaynak olarak sunulmalıdır.
  * Google Play Geliştirici Dağıtım Sözleşmesi ve mağaza DRM mekanizmaları bazı GPL yorumlarında çakışma yaratabileceğinden; LexiNote'un açık kaynaklı GitHub deposu bağlantısı ve GPL kaynak kodu indirme bağlantısı doğrudan uygulama içinde ve mağaza açıklamasında kullanıcılara açıkça sunulmalıdır.

---

## 2. İngilizce Yazım Denetimi Kelime Listesi (ENABLE1)

* **Kaynak**: [Peter Norvig N-Gram Corpus / ENABLE1](https://www.norvig.com/ngrams/enable1.txt)
* **Özgün Derleyen**: Alan Beale (M. Cooper katkılarıyla) — *Enhanced North American Benchmark Lexicon (ENABLE)*, 1997.
* **Kelime Hacmi**: **172.819** kelime.
* **Lisans Durumu**: **Public Domain (Kamu Malı)**.
* **Kullanım Kapsamı**: İngilizce yazım denetiminde kelime geçerliliğinin doğrulanması ve yazım hataları için düzeltme önerilerinin (Damerau-Levenshtein / Norvig komşulukları) çevrimdışı üretilmesi.
* **Atıf**: 
  > *ENABLE1 (Enhanced North American Benchmark Lexicon) compiled by Alan Beale and M. Cooper (1997). Released into the Public Domain. Reference copy hosted by Peter Norvig.*

---

## 3. Alternatif Kaynak Değerlendirmesi: Kaikki.org / Wiktionary

* **Kaynak**: [https://kaikki.org/dictionary/](https://kaikki.org/dictionary/) (Wiktionary Extractions)
* **Lisans**: **CC BY-SA 3.0** (Creative Commons Attribution-ShareAlike 3.0) ve **GFDL** (GNU Free Documentation License).
* **Değerlendirme ve Karşılaştırma**:
  * Kaikki.org Wiktionary verileri geniş bir dil kapsamına sahip olmakla birlikte, tüm Wiktionary JSONL ham dump dosyaları yüzlerce megabayt boyutundadır.
  * Wiktionary'de İngilizce kelimelerin Türkçe çevirileri madde başı yerine iç içe çok dilli çeviri tablolarında dağınık yer almaktadır.
  * FreeDict `eng-tur` sürümü doğrudan İngilizce–Türkçe çiftine odaklı, 36.589 başlık içeren derli toplu ve yerel masaüstü/mobil mimariye tam uygun formatta olduğu için **FreeDict öncelikli ve nihai kaynak olarak seçilmiştir**.

---

## 4. Dolph Dictionary Deposu İnceleme ve Uygunluk Raporu

* **İncelenen Depo**: [https://github.com/dolph/dictionary](https://github.com/dolph/dictionary)
* **İçerik**: `enable1.txt` (172.823 kelime), `popular.txt` (25.322 kelime), `ospd.txt`, `unix-words`, `filter.py`.
* **Veri Formatı**: Düz metin (`.txt`), satır başına tek bir İngilizce kelime (tek dilli liste).
* **Dil Kapsamı**: Yalnızca İngilizce (Monolingual).
* **İngilizce - Türkçe Anlam & Çeviri Durumu**: **MEVCUT DEĞİL**. Depoda hiçbir Türkçe karşılık, tanım veya sözcük türü bulunmamaktadır.
* **Lisans**: Depo genelinde açık bir `LICENSE` dosyası tanımlanmamıştır (`license: null`).
* **Karar**: Bu depo, **anlam ve çeviri sözlüğü olarak uygun bulunmamış ve uygulamaya çeviri kaynağı olarak eklenmemiştir**.

---

## 5. Mimari Katman Ayrımı (Layer Separation)

LexiNote'ta iki veri katmanı birbirinden **kesin ve bağımsız olarak ayrılmıştır**:

1. **Yazım Denetimi Katmanı (Spellcheck Layer)**:
   * Veri Kaynağı: `ENABLE1` (172.819 kelime, Public Domain).
   * İşlev: Kelimenin yazım doğruluğunu denetler, yanlış yazımlarda (`aborad`) düzeltme önerisi (`abroad`) üretir.
   * Ayar: `spellCheckEnabled` (açık/kapalı) ve `autoCorrectMode` (açık/kapalı) kullanıcı tarafından birbirinden tamamen bağımsız olarak yapılandırılabilir.
2. **Anlam & Çeviri Katmanı (Definition & Translation Layer)**:
   * Veri Kaynağı: `FreeDict eng-tur 0.3` (34.405 tekil madde, 48.294 ters indeks, GPLv2+).
   * İşlev: Kullanıcı bir kelime veya metin seçtiğinde yerel veriden gerçek Türkçe karşılıklarını ve açıklamalarını gösterir.
   * Sıfır Ağ Bağımlılığı: Hiçbir harici API veya internet bağlantısı kullanılmaz; %100 yerel ve çevrimdışı çalışır.
