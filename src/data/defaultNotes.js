// Default starter notes showcasing multilingual knowledge management,
// connected wiki-links, work & journal modes, and encrypted notes.

export const DEFAULT_NOTES_EN = [
  {
    id: "note-work-1",
    mode: "work",
    title: "Global Expansion & Partnerships (Q4 Strategy)",
    language: "en",
    content: `We are preparing our new international roadmap. Next month, our core business development team is scheduled to travel abroad to meet with strategic partners across Europe.

🔗 Connected Knowledge Links:
- Architecture & Performance: [[Product Architecture & Offline Engines]]
- High-level Security: [[🔒 Encrypted Financial Planning & Vault]]
- Team Retrospective: [[Weekly Engineering & Sprint Retrospective]]

💡 Spellcheck & Autocorrect Test:
Try typing the word "aborad" right here with a space after it — LexiNote will immediately detect the typo against the active dictionary and autocorrect it to "abroad"!

Double-Click Dictionary Lookup:
Double-click on words like "abroad", "hospital", "circumstance", or "accommodate" to open the interactive FreeDict dictionary popup and view definitions immediately.

Key Objectives:
- Expand presence in 3 target overseas markets
- Align product features with regional compliance
- Finalize contract negotiations with enterprise clients`,
    priority: "high",
    status: "in_progress",
    dueDate: "2026-11-15",
    tags: ["Strategy", "Global", "Q4"],
    isPinned: true,
    isLocked: false,
    encryptedData: null,
    todos: [
      { id: "t1", text: "Finalize presentation deck for abroad partners", done: true },
      { id: "t2", text: "Review architecture in [[Product Architecture & Offline Engines]]", done: true },
      { id: "t3", text: "Confirm Q4 budget allocation and legal approval", done: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "note-work-2",
    mode: "work",
    title: "Product Architecture & Offline Engines",
    language: "en",
    content: `LexiNote is engineered as a 100% offline-first application combining three core pillars:
1. FreeDict TEI database (34,405 English headwords + 48,294 Turkish reverse index).
2. ENABLE1 Scrabble & Norvig benchmark wordlist (172,820 words) for zero false-positive spellchecking.
3. Interactive Canvas-based neural Knowledge Graph with Cosmic Void and Onyx Black themes.

Cross-Reference Links:
- Business Roadmap: [[Global Expansion & Partnerships (Q4 Strategy)]]
- Reflection & Mindfulness: [[Personal Reflections & Growth Journal]]
- Minimal Sandbox: [[Deep Focus & Creative Sandbox]]

Zero-Telemetry Commitment:
Every single character, keystroke, and encryption key stays strictly on your local device.`,
    priority: "urgent",
    status: "in_progress",
    dueDate: "2026-11-05",
    tags: ["Architecture", "Engine", "Offline"],
    isPinned: true,
    isLocked: false,
    encryptedData: null,
    todos: [
      { id: "a1", text: "Verify FreeDict offline parser accuracy", done: true },
      { id: "a2", text: "Benchmark canvas physics at 60 FPS", done: true },
      { id: "a3", text: "Integrate bilingual i18n translation strings", done: true }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "note-plain-1",
    mode: "plain",
    title: "Deep Focus & Creative Sandbox",
    language: "en",
    content: `This note is created in "Plain Note / Blank Page" mode.

Here, there are no side panels, no action checklists, no mood widgets, and no distractions.
Just you, your thoughts, and a pristine typing canvas.

You can switch typography anytime from the toolbar:
- Noto Sans (Clean, modern, highly legible)
- Noto Serif (Classic editorial book style)
- DejaVu Mono (Monospace code & typewriter aesthetics)

Referenced in [[Product Architecture & Offline Engines]] and [[Personal Reflections & Growth Journal]].`,
    tags: ["Focus", "Writing"],
    isPinned: false,
    isLocked: false,
    encryptedData: null,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "note-journal-1",
    mode: "journal",
    title: "Personal Reflections & Growth Journal",
    language: "en",
    content: `Sitting by the window on a quiet rainy evening with a warm cup of coffee. After a busy day of deep architectural discussions, this silence helps clarify my thoughts.

Today's greatest takeaway:
True productivity is not just about completing sprint tasks, but also knowing when to slow down and cultivate inner peace.

Connected Thoughts:
- Connected to my writing space: [[Deep Focus & Creative Sandbox]]
- Connected to project vision: [[Global Expansion & Partnerships (Q4 Strategy)]]`,
    mood: "reflective",
    weather: "rainy",
    dailyPrompt: "What was the most valuable lesson I discovered or realized today?",
    gratitude: [
      "A peaceful and serene evening to reflect",
      "Witnessing our offline-first vision come to life",
      "A warm cup of coffee and continuous growth"
    ],
    tags: ["Mindfulness", "Growth", "Life"],
    isPinned: false,
    isLocked: false,
    encryptedData: null,
    todos: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "note-work-3",
    mode: "work",
    title: "Weekly Engineering & Sprint Retrospective",
    language: "en",
    content: `Our engineering team successfully completed all core development milestones for this release cycle.
LexiNote's multilingual dictionary engine, deep space mind map studio, and bidirectional linked references are operating with 100% test coverage.

Connected Documentation:
- Global Strategy: [[Global Expansion & Partnerships (Q4 Strategy)]]
- Architecture Details: [[Product Architecture & Offline Engines]]

Pro Tip:
You can switch the entire application between English and Turkish at any time using the language button in the upper header.`,
    priority: "medium",
    status: "done",
    dueDate: "2026-11-01",
    tags: ["Sprint", "Engineering", "Retrospective"],
    isPinned: false,
    isLocked: false,
    encryptedData: null,
    todos: [
      { id: "e1", text: "Verify mind map node branch and color controls", done: true },
      { id: "e2", text: "Complete 100% English sample notes and docs", done: true },
      { id: "e3", text: "Release GitHub v0.1.0 production build", done: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "note-locked-demo",
    mode: "work",
    title: "🔒 Encrypted Financial Planning & Vault",
    language: "en",
    content: "",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-12-31",
    tags: ["Confidential", "Finance", "Security"],
    isPinned: false,
    isLocked: true,
    encryptedData: {
      ciphertext: "7hVYD5uxGe/enyKszSSNKbxJn1ecBMFQvT3mK2ekYwkz86gg0l6lt1KIwNcasqKyCNtGd6Un7sJ7+zpz5NK30IGBlDhLmWZ9+2a0xdrktO/bhEhhZ5phsFD10Sqpjz0/griQytADWy1pu5iDPZEV7udtxGTeF+C6gSOaxM116j4mZg1cMi1YkRrxR2FQULN6bUG9wFouDxAVsUHD7wdIO4AINKWjjM9sgHJBsudFEzn+tneIkp+132ADaVFbFQWGNj2Uo7J1KZfzlP55KzY8R/xKU+cPjS1eKLhiCdqk0Opg5hpoz7Wg2/OP63CZXx84gGfKECWJQ+4WPj6TUyZOTLFMBCaOelNwh9Px/IxVr3SBFw3W7eTKGB0YWjtGXBJC9Dse31ruvIbMkAtW0YURzRTolLYXjce9VmfFJDZPVb1mYAiFemHBQodBLaA9xF2D27vtVLlrLyaVaLOwPVziqJqj2kAMG5YvfDDfnH5LEHiP5HnQ+gnRSyF2nmtvhtAg/qIkbqEoQDzwINCPEbXf5G4MVXdwbjxvlF3l/Q3CCq7LRPh2fFgxo/KEWxi+OvisS8BbDIOMCHyliqvWjFOCrEgKLd1/YxWn+bmuKkUFSFa6c7uLTK4r5xK79KMtwYnN6hHKeslouEtTMjkMx/3Se4CD4Pelc+JDxRn794SqJxSU5D0G8r2Io/2YNshfr+zCCeZ/dcvO1itMxMDv9BiMCNVqmEf5yPquffR2uBOLaCvodYueFEspSz83Lm/nMd0v74UsgKY0",
      iv: "W5SIEu1LwKYEOteC",
      salt: "Udv+FKXx/QFrybXEUjyXhQ=="
    },
    todos: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const DEFAULT_NOTES_TR = [
  {
    id: "note-work-1",
    mode: "work",
    title: "Küresel Genişleme & Stratejik Ortaklıklar (Q4 Yol Haritası)",
    language: "tr",
    content: `Yeni uluslararası yol haritamızı hazırlıyoruz. Önümüzdeki ay iş geliştirme ekibimiz Avrupa'daki stratejik ortaklarla görüşmek üzere yurt dışına seyahat edecek.

🔗 Bağlantılı Notlar:
- Sistem Mimarisi & Performans: [[Ürün Mimarisi & Çevrimdışı Sistemler]]
- Askeri Düzey Güvenlik: [[🔒 Şifrelenmiş Finansal Planlama Kasası]]
- Ekip Değerlendirmesi: [[Haftalık Mühendislik & Sprint Değerlendirmesi]]

💡 Yazım Denetimi ve Otomatik Düzeltme:
"aborad" kelimesini buraya yazıp bir boşluk bıraktığınızda, sistem imla hatasını anında tespit edip "abroad" önerisini sunar!

Çift Tıklamayla Sözlük:
Metindeki herhangi bir kelimeye çift tıklayarak 34.000+ kelimelik FreeDict sözlüğümüzden anında Türkçe karşılığını görebilirsiniz.

Temel Hedefler:
- Hedeflenen 3 yurt dışı pazarında varlık göstermek
- Ürün özelliklerini bölgesel regülasyonlarla uyumlu kılmak
- Kurumsal müşterilerle sözleşme müzakerelerini tamamlamak`,
    priority: "high",
    status: "in_progress",
    dueDate: "2026-11-15",
    tags: ["Strateji", "Küresel", "Q4"],
    isPinned: true,
    isLocked: false,
    encryptedData: null,
    todos: [
      { id: "t1", text: "Yurt dışı ortaklar için sunum dosyasını hazırla", done: true },
      { id: "t2", text: "[[Ürün Mimarisi & Çevrimdışı Sistemler]] mimarisini incele", done: true },
      { id: "t3", text: "Q4 bütçe tahsisini ve hukuki onayı al", done: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "note-work-2",
    mode: "work",
    title: "Ürün Mimarisi & Çevrimdışı Sistemler",
    language: "tr",
    content: `LexiNote, %100 çevrimdışı öncelikli olarak geliştirilmiş olup üç temel sütun üzerine kuruludur:
1. FreeDict TEI veritabanı (34.405 İngilizce başlık kelimesi + 48.294 Türkçe terim indeksi).
2. ENABLE1 Scrabble & Norvig kıyaslama kelime listesi (172.820 kelime).
3. Uzay Boşluğu ve Obsidiyen temalarına sahip dinamik Zihin Haritası (Knowledge Graph).

Çapraz Bağlantılar:
- İş Yol Haritası: [[Küresel Genişleme & Stratejik Ortaklıklar (Q4 Yol Haritası)]]
- Tefekkür & Gelişim: [[Kişisel Tefekkür & Gelişim Günlüğü]]
- Sade Odaklanma: [[Derin Odaklanma & Yaratıcı Çalışma Alanı]]

Sıfır Telemetri Güvencesi:
Her karakter, her tuş vuruşu ve şifreleme anahtarı yalnızca cihazınızda güvenle saklanır.`,
    priority: "urgent",
    status: "in_progress",
    dueDate: "2026-11-05",
    tags: ["Mimari", "Çevrimdışı", "Sistem"],
    isPinned: true,
    isLocked: false,
    encryptedData: null,
    todos: [
      { id: "a1", text: "FreeDict çevrimdışı sözlük motorunu doğrula", done: true },
      { id: "a2", text: "Canvas grafik performansını 60 FPS'te test et", done: true },
      { id: "a3", text: "İki dilli arayüz dizgilerini tamamla", done: true }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "note-plain-1",
    mode: "plain",
    title: "Derin Odaklanma & Yaratıcı Çalışma Alanı",
    language: "tr",
    content: `Bu not "Sade Sayfa / Boş Not" modunda oluşturulmuştur.

Burada hiçbir yan panel, görev listesi, ruh hali widget'ı veya dikkat dağıtıcı öğe yoktur.
Yalnızca siz, düşünceleriniz ve tertemiz bir yazı alanı.

Yazı tipini araç çubuğundan dilediğiniz zaman değiştirebilirsiniz:
- Noto Sans (Temiz, modern, son derece okunaklı)
- Noto Serif (Klasik edebi kitap tarzı)
- DejaVu Mono (Kod ve daktilo estetiği)

Bağlantılar: [[Ürün Mimarisi & Çevrimdışı Sistemler]] ve [[Kişisel Tefekkür & Gelişim Günlüğü]].`,
    tags: ["Odaklanma", "Yazı"],
    isPinned: false,
    isLocked: false,
    encryptedData: null,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "note-journal-1",
    mode: "journal",
    title: "Kişisel Tefekkür & Gelişim Günlüğü",
    language: "tr",
    content: `Sakin ve yağmurlu bir akşamda pencere kenarında sıcak bir kahve eşliğinde. Yoğun geçen bir geliştirme gününün ardından bu sessizlik düşüncelerimi berraklaştırıyor.

Bugünün en değerli dersi:
Gerçek üretkenlik yalnızca görevleri tamamlamak değil, aynı zamanda ne zaman durup içsel huzuru tazeleyeceğini bilmektir.

Bağlantılı Fikirler:
- Yazı alanıma bağlı: [[Derin Odaklanma & Yaratıcı Çalışma Alanı]]
- Proje vizyonuma bağlı: [[Küresel Genişleme & Stratejik Ortaklıklar (Q4 Yol Haritası)]]`,
    mood: "reflective",
    weather: "rainy",
    dailyPrompt: "Bugün öğrendiğim veya farkına vardığım en değerli ders neydi?",
    gratitude: [
      "Tefekkür edebildiğim huzurlu ve dingin bir akşam",
      "Çevrimdışı öncelikli vizyonumuzun hayata geçtiğini görmek",
      "Sıcak bir fincan kahve ve sürekli öğrenme tutkusu"
    ],
    tags: ["Farkındalık", "Gelişim", "Yaşam"],
    isPinned: false,
    isLocked: false,
    encryptedData: null,
    todos: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "note-work-3",
    mode: "work",
    title: "Haftalık Mühendislik & Sprint Değerlendirmesi",
    language: "tr",
    content: `Ekip olarak bu haftaki geliştirme hedeflerimizi başarıyla tamamladık.
LexiNote'un çok dilli sözlük motoru, uzay boşluğu temalı zihin haritası ve çift yönlü bilgi referansları sorunsuz çalışıyor.

Bağlantılı Notlar:
- Küresel Strateji: [[Küresel Genişleme & Stratejik Ortaklıklar (Q4 Yol Haritası)]]
- Mimari Detaylar: [[Ürün Mimarisi & Çevrimdışı Sistemler]]

İpuçları:
İstediğiniz zaman üst menüden 'EN / TR' butonuna basarak uygulamayı İngilizce ve Türkçe arasında anında değiştirebilirsiniz.`,
    priority: "medium",
    status: "done",
    dueDate: "2026-11-01",
    tags: ["Sprint", "Mühendislik", "Değerlendirme"],
    isPinned: false,
    isLocked: false,
    encryptedData: null,
    todos: [
      { id: "tr1", text: "Zihin haritası dal ve renk kontrollerini test et", done: true },
      { id: "tr2", text: "İngilizce ve Türkçe dil desteğini tamamla", done: true },
      { id: "tr3", text: "GitHub v0.1.0 sürümünü yayınla", done: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "note-locked-demo",
    mode: "work",
    title: "🔒 Şifrelenmiş Finansal Planlama Kasası",
    language: "tr",
    content: "",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-12-31",
    tags: ["Gizli", "Finans", "Güvenlik"],
    isPinned: false,
    isLocked: true,
    encryptedData: {
      ciphertext: "7hVYD5uxGe/enyKszSSNKbxJn1ecBMFQvT3mK2ekYwkz86gg0l6lt1KIwNcasqKyCNtGd6Un7sJ7+zpz5NK30IGBlDhLmWZ9+2a0xdrktO/bhEhhZ5phsFD10Sqpjz0/griQytADWy1pu5iDPZEV7udtxGTeF+C6gSOaxM116j4mZg1cMi1YkRrxR2FQULN6bUG9wFouDxAVsUHD7wdIO4AINKWjjM9sgHJBsudFEzn+tneIkp+132ADaVFbFQWGNj2Uo7J1KZfzlP55KzY8R/xKU+cPjS1eKLhiCdqk0Opg5hpoz7Wg2/OP63CZXx84gGfKECWJQ+4WPj6TUyZOTLFMBCaOelNwh9Px/IxVr3SBFw3W7eTKGB0YWjtGXBJC9Dse31ruvIbMkAtW0YURzRTolLYXjce9VmfFJDZPVb1mYAiFemHBQodBLaA9xF2D27vtVLlrLyaVaLOwPVziqJqj2kAMG5YvfDDfnH5LEHiP5HnQ+gnRSyF2nmtvhtAg/qIkbqEoQDzwINCPEbXf5G4MVXdwbjxvlF3l/Q3CCq7LRPh2fFgxo/KEWxi+OvisS8BbDIOMCHyliqvWjFOCrEgKLd1/YxWn+bmuKkUFSFa6c7uLTK4r5xK79KMtwYnN6hHKeslouEtTMjkMx/3Se4CD4Pelc+JDxRn794SqJxSU5D0G8r2Io/2YNshfr+zCCeZ/dcvO1itMxMDv9BiMCNVqmEf5yPquffR2uBOLaCvodYueFEspSz83Lm/nMd0v74UsgKY0",
      iv: "W5SIEu1LwKYEOteC",
      salt: "Udv+FKXx/QFrybXEUjyXhQ=="
    },
    todos: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const getDefaultNotes = (lang = 'en') => {
  return lang === 'tr' ? DEFAULT_NOTES_TR : DEFAULT_NOTES_EN;
};

export const isDefaultNotesList = (notesList) => {
  if (!Array.isArray(notesList) || notesList.length === 0) return true;
  const defaultIds = new Set([
    'note-work-1',
    'note-work-2',
    'note-plain-1',
    'note-journal-1',
    'note-work-3',
    'note-locked-demo'
  ]);
  return notesList.every(n => defaultIds.has(n.id));
};

export const DEFAULT_NOTES = DEFAULT_NOTES_EN;
