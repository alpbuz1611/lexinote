import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Share2,
  GitBranch,
  Link as LinkIcon,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Languages,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Keyboard,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { getTranslation } from '../i18n/translations.js';

export default function HelpGuideModal({ isOpen, onClose, appLanguage = 'en' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('mindset'); // 'mindset' | 'editor' | 'dictionary' | 'security' | 'shortcuts'

  const isTr = appLanguage === 'tr';

  const faqData = useMemo(() => [
    // 1. ZİHİN HARİTASI (MINDSET & GALAXY)
    {
      id: 'mindset-connect',
      category: 'mindset',
      keywords: ['bağla', 'bağlama', 'bağlayamıyorum', 'connect', 'wire', 'link', 'ilişki', 'bağlantı'],
      title: isTr ? 'Fikirleri ve Düğümleri Birbirine Nasıl Bağlarım?' : 'How do I connect thoughts and nodes?',
      shortAnswer: isTr
        ? 'Düğüme tıklayıp üzerindeki 🔗 Bağlantı Çek butonuna basın, ardından bağlamak istediğiniz 2. düğüme tıklayın!'
        : 'Click on a node, press the 🔗 Connect Wire button, then click the target node to connect them!',
      steps: isTr ? [
        '1. Yöntem (En Kolay): Bağlamak istediğiniz ilk düğüme tıklayın. Düğümün hemen üzerinde beliren çubuktan 🔗 Bağlantı Çek (Connect Wire) butonuna basın. Ardından hedef düğüme tıklayın; aralarında kıvrımlı parlak bir çizgi oluşur.',
        '2. Yöntem: Düğümün üzerine geldiğinizde sağ kenarında beliren mavi (+) rozetinden basılı tutup hedef düğüme doğru sürükleyip bırakın.',
        'Galaxy Modunda: Not Galaksisi sekmesinde de aynı şekilde bir nota tıklayıp 🔗 Bağlantı Çek diyerek diğer notlara özel bağlantılar çizebilirsiniz.'
      ] : [
        'Method 1 (Easiest): Click the source node. On the floating toolbar above it, click 🔗 Connect Wire. Then simply click the target node—an organic Bezier connector will link them!',
        'Method 2: Hover over the node to reveal the (+) handle on its right edge, then drag and drop the glowing wire onto the target node.',
        'In Galaxy Mode: Select any document sphere and use 🔗 Connect Wire to draw custom links between notes.'
      ]
    },
    {
      id: 'mindset-add-branch',
      category: 'mindset',
      keywords: ['dal', 'dal ekle', 'ekle', 'ekleyemiyorum', 'branch', 'add branch', 'çocuk', 'alt dal'],
      title: isTr ? 'Yeni Dal (Alt Fikir) Nasıl Eklerim?' : 'How do I add a new branch or sub-thought?',
      shortAnswer: isTr
        ? 'Düğüme tıklayın ve ➕ Dal Ekle butonuna basın; sağ tarafa yeni bir çocuk dal eklenir ve hemen yazabilirsiniz!'
        : 'Click on a node and press ➕ Add Branch; a connected child node spawns and is ready for typing!',
      steps: isTr ? [
        '1. Dal çıkarmak istediğiniz ana düğüme (örneğin Raspberry Pi) tıklayın.',
        '2. Üstteki çubukta beliren pembe ➕ Dal Ekle butonuna tıklayın.',
        '3. Yeni dal otomatik olarak sağ tarafa bağlanır, içine odaklanır ve hemen yeni fikrinizi yazabilirsiniz.',
        '4. Yazmayı bitirince klavyeden Enter tuşuna basın veya dışarı tıklayın.'
      ] : [
        '1. Click on the parent node you want to branch from (e.g. Raspberry Pi).',
        '2. Click the ➕ Add Branch button on the floating toolbar.',
        '3. The new branch is automatically placed to the right with an organic Bezier line, focused, and ready to type.',
        '4. Press Enter or click outside to commit your text.'
      ]
    },
    {
      id: 'mindset-edit',
      category: 'mindset',
      keywords: ['düzenle', 'isim', 'değiştir', 'yazı', 'metin', 'edit', 'rename', 'text', 'çift tık'],
      title: isTr ? 'Düğüm İsmini ve Yazısını Nasıl Düzenlerim?' : 'How do I edit or rename a node?',
      shortAnswer: isTr
        ? 'Herhangi bir düğüme çift tıklayın veya üzerindeki ✏️ Düzenle butonuna basın!'
        : 'Double-click any node or click the ✏️ Edit button on its floating toolbar!',
      steps: isTr ? [
        '1. En Hızlı Yol: İstediğiniz düğümün üzerine farenizle ÇİFT TIKLAYIN (Double Click).',
        '2. Düğümün tam üzerinde metin kutusu açılacaktır.',
        '3. Yeni isminizi yazıp Enter tuşuna basın.',
        '4. Alternatif: Düğüme bir kez tıklayıp üzerindeki ✏️ Düzenle butonuna da basabilirsiniz.'
      ] : [
        '1. Quickest Method: Double-click directly on any node on the canvas.',
        '2. An inline text input opens right over the node with text highlighted.',
        '3. Type your new thought and press Enter to save.',
        '4. Alternatively, click the node once and choose ✏️ Edit from the toolbar.'
      ]
    },
    {
      id: 'mindset-independent',
      category: 'mindset',
      keywords: ['bağımsız', 'yeni fikir', 'boşluk', 'yeni zihin', 'independent', 'new thought', 'canvas'],
      title: isTr ? 'Bağımsız Yeni Bir Fikir Nasıl Oluşturulur?' : 'How do I create an independent new thought?',
      shortAnswer: isTr
        ? 'Canvas üzerindeki herhangi bir boşluğa çift tıklayın veya üstteki + Bağımsız Fikir Ekle butonuna basın!'
        : 'Double-click anywhere on empty canvas or click + Add Thought in the header!',
      steps: isTr ? [
        '1. Zihin haritasında boş bir alana ÇİFT TIKLAYIN.',
        '2. Hiçbir yere bağlı olmayan bağımsız bir kök fikir oluşur.',
        '3. Adını yazıp Enter\'a basın. Daha sonra isterseniz bu fikirden dallar çıkarabilir veya diğer ağaçlara bağlayabilirsiniz.',
        '4. Üst barda bulunan + Bağımsız Fikir Ekle butonu da aynı işlemi ekranın ortasında yapar.'
      ] : [
        '1. Double-click on any empty area of the canvas.',
        '2. An unlinked, independent root thought spawns right under your cursor.',
        '3. Type its name and hit Enter. You can later branch out from it or connect it anywhere.',
        '4. You can also click the + Add Thought button in the top HUD.'
      ]
    },
    {
      id: 'mindset-tabs',
      category: 'mindset',
      keywords: ['sekme', 'yeni harita', 'cambridge', 'örnek', 'tab', 'multiple', 'mindsets'],
      title: isTr ? 'Farklı Zihin Haritaları ve Sekmeler Nasıl Kullanılır?' : 'How do I use multiple mind map tabs?',
      shortAnswer: isTr
        ? 'Üstteki sekme çubuğundan Cambridge (Örnek) haritasını inceleyebilir veya ➕ Yeni Harita ile sıfırdan kendi haritanızı açabilirsiniz!'
        : 'Use the tab bar to view the Cambridge (Example) map or click ➕ New Tab to start your own blank canvas!',
      steps: isTr ? [
        '1. Cambridge (Örnek) Sekmesi: Cambridge ➔ Raspberry Pi ➔ Ucuz Bilgisayarlar hiyerarşisini gösteren referans şablondur.',
        '2. ➕ Yeni Harita Sekmesi: Kendi fikirleriniz için tertemiz boş bir tuval açar.',
        '3. Sekme İsimleri: Sekme başlığına tıklayarak veya düzenleyerek sekmelerinize istediğiniz ismi verebilirsiniz.',
        '4. Tüm sekmeleriniz bilgisayarınızda yerel olarak güvenle saklanır.'
      ] : [
        '1. Cambridge (Example) Tab: Reference tree showing Cambridge ➔ Raspberry Pi ➔ Affordable Computers.',
        '2. ➕ New Tab: Opens a completely fresh blank canvas for your own thoughts.',
        '3. Rename Tabs: Click any tab title to rename it to your project name.',
        '4. All tabs persist automatically in your browser storage.'
      ]
    },
    {
      id: 'mindset-colors-delete',
      category: 'mindset',
      keywords: ['renk', 'sil', 'silme', 'çöp kutusu', 'color', 'delete', 'trash', 'palette'],
      title: isTr ? 'Düğüm Rengini Değiştirme ve Silme' : 'Changing Node Colors & Deleting Nodes',
      shortAnswer: isTr
        ? 'Düğüme tıklayın: Renk noktalarından birini seçin veya 🗑️ çöp kutusuna basın!'
        : 'Click on a node: pick any color dot or press the 🗑️ trash button!',
      steps: isTr ? [
        '1. Renk Değiştirme: Düğüme tıklayın. Araç çubuğundaki 6 renk noktasından (Mavi, Pembe, Amber, Yeşil, Mor, Gri) birine tıklayın.',
        '2. Silme: Düğümün üzerindeki 🗑️ simgesine tıklayın. Düğüm ve ona bağlı olan tüm çizgiler temizlenir.'
      ] : [
        '1. Change Color: Click node. Pick one of the 6 color dots in the palette.',
        '2. Delete: Click the 🗑️ trash icon on the node toolbar to instantly remove the node and its connections.'
      ]
    },

    // 2. EDİTÖR & NOTLAR
    {
      id: 'editor-modes',
      category: 'editor',
      keywords: ['mod', 'sayfa türü', 'iş', 'günlük', 'sade', 'mode', 'work', 'journal', 'plain'],
      title: isTr ? '3 Not Türü Arasındaki Fark Nedir?' : 'What are the 3 Note Modes?',
      shortAnswer: isTr
        ? 'Sade Sayfa (özgür yazı), İş & Proje (görev listeleri & öncelikler) ve Günlük (ruh hali & tefekkür)!'
        : 'Plain Page (distraction-free), Work & Project (checklists & priorities), and Journal (mood & gratitude)!',
      steps: isTr ? [
        '📄 Sade Sayfa (Plain): Hiçbir yan panel veya dikkat dağıtıcı öğe içermeyen tertemiz sayfa.',
        '💼 İş & Proje (Work): Görev kontrol listeleri, teslim tarihi, durum ve öncelik rozetleri içerir.',
        '📖 Günlük & Tefekkür (Journal): Ruh hali, hava durumu, günün düşünce sorusu ve şükran kartları içerir.',
        'Notun üstündeki "Sayfa Türü" menüsünden dilediğiniz zaman değiştirebilirsiniz.'
      ] : [
        '📄 Plain Page: Minimalist blank page with zero side panels or distractions.',
        '💼 Work & Project: Actionable checklists, priority badges, status, and deadlines.',
        '📖 Journal & Daily: Daily reflection prompts, mood tracker, weather, and gratitude cards.',
        'Switch between modes anytime from the Mode selector at the top of the editor.'
      ]
    },
    {
      id: 'editor-wikilinks',
      category: 'editor',
      keywords: ['wiki', 'bağlantı', 'not bağlama', '[[', 'link', 'backlink'],
      title: isTr ? 'Notları Birbirine Bağlama ([[Not Adı]] Wiki-Linkleri)' : 'Linking Notes with Wiki-Links ([[Note Title]])',
      shortAnswer: isTr
        ? 'Metninizin içine [[Diğer Notun Başlığı]] yazarak çift yönlü bağlantı kurun!'
        : 'Type [[Other Note Title]] anywhere in your document to establish bidirectional wiki-links!',
      steps: isTr ? [
        '1. Editörde yazarken [[ tuşlarına basın ve bağlamak istediğiniz notun adını yazın (örn: [[Toplantı Notları]]).',
        '2. Sağ alttaki "Bağlantılı Notlar" panelinde bu bağlantı otomatik görünür.',
        '3. Ayrıca Zihin Haritası\'ndaki "Not Galaksisi" sekmesinde bu iki not arasında starlight ışık çizgisi belirir!'
      ] : [
        '1. While typing, write [[ followed by the target note title (e.g. [[Meeting Notes]]).',
        '2. The connection appears in the "Connected Notes" bottom drawer.',
        '3. In the Notes Galaxy mind map, a glowing link line automatically joins the two notes!'
      ]
    },

    // 3. SÖZLÜK & KELİME HAZNESİ
    {
      id: 'dict-freedict',
      category: 'dictionary',
      keywords: ['sözlük', 'kelime', 'ingilizce', 'türkçe', 'freedict', 'dictionary', 'lookup', 'vocabulary'],
      title: isTr ? 'Çevrimdışı FreeDict Sözlük Nasıl Çalışır?' : 'How does the Offline FreeDict Dictionary work?',
      shortAnswer: isTr
        ? 'Metinde herhangi bir kelimeyi fareyle seçin, FreeDict sözlük kutucuğu anında belirsin!'
        : 'Select any English word with your mouse, and the offline definition popup appears instantly!',
      steps: isTr ? [
        '1. Kelime Seçimi: Metindeki herhangi bir İngilizce kelimeyi farenizle seçin; 34,000+ kelimelik FreeDict sözlük anlamları hemen açılır.',
        '2. Kelime Kaydetme: Beğendiğiniz kelimeleri yıldızlayarak "Kelimelerim" haznesine ekleyebilirsiniz.',
        '3. Sözlük Modalı: 34.000+ İngilizce başlık ve 48.000+ Türkçe terim indeksi tamamen çevrimdışı cihazınızda çalışır.',
        '4. Yazım Denetimi: 172,000 kelimelik ENABLE1 veri tabanı hatalı yazımları algılar ve düzeltme önerir.'
      ] : [
        '1. Word Selection: Highlight any word in the editor to see instant FreeDict definitions and senses.',
        '2. Vocabulary Vault: Bookmark words to save them in your personal vocabulary list.',
        '3. Offline Database: 34k+ English headwords and 48k+ Turkish reverse terms run 100% locally on your device.',
        '4. Spellcheck: The 172k ENABLE1 dictionary detects typos and suggests instant auto-fixes.'
      ]
    },

    // 4. GÜVENLİK & ŞİFRELEME
    {
      id: 'security-pin',
      category: 'security',
      keywords: ['şifre', 'pin', 'kilit', 'güvenlik', 'aes', 'lock', 'encrypt', 'privacy'],
      title: isTr ? 'Notlarımı 4 Haneli PIN ile Nasıl Şifrelerim?' : 'How do I encrypt notes with a 4-digit PIN?',
      shortAnswer: isTr
        ? 'Notun sağ üstündeki 🔒 Kilitle butonuna basın, 4 haneli PIN belirleyin. Askeri düzey AES-256 ile şifrelenir!'
        : 'Click the 🔒 Lock button at the top right of the note and set a 4-digit PIN for AES-256 GCM encryption!',
      steps: isTr ? [
        '1. Kilitlemek istediğiniz not açıkken sağ üstteki "Kilitle" (🔒) butonuna basın.',
        '2. 4 haneli güvenli bir PIN girin ve "Kilitle ve Şifrele"ye tıklayın.',
        '3. Notunuz PBKDF2 anahtar türetimi ve AES-256 GCM algoritmasıyla şifrelenir.',
        '4. PIN olmadan metin, kontrol listeleri veya şükran maddeleri kesinlikle okunamaz ve buluta gönderilmez.'
      ] : [
        '1. With the note open, click the "Lock" (🔒) button in the upper toolbar.',
        '2. Enter a 4-digit PIN and confirm.',
        '3. Your note is securely encrypted with PBKDF2 key derivation and AES-256 GCM.',
        '4. Zero cloud leakage: no one can access your content without the exact PIN.'
      ]
    }
  ], [isTr]);

  // Filter FAQ items by search query or category
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return faqData.filter(item => item.category === activeCategory);
    }
    return faqData.filter(item => {
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchAnswer = item.shortAnswer.toLowerCase().includes(q);
      return matchKeywords || matchTitle || matchAnswer;
    });
  }, [faqData, searchQuery, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-2xl text-[var(--text-main)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                {isTr ? 'LexiNote Yardım & Akıllı Kullanım Rehberi' : 'LexiNote Help & Smart Guide'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {isTr ? 'Aklınıza takılan her şeyi arayın veya kategorilerden adım adım inceleyin' : 'Search any question or browse step-by-step guides'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-color)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Smart Search Bar */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="relative">
            <Search className="w-5 h-5 text-sky-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTr ? 'Ne yapmak istiyorsunuz? (örn: bağlama, dal ekleme, düzenleme, şifreleme...)' : 'What do you want to do? (e.g. connect, add branch, edit node, lock...)'}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] focus:border-sky-500 text-sm font-semibold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Query Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
            <span className="text-[11px] font-bold text-[var(--text-muted)] mr-1">
              {isTr ? 'Hızlı Konular:' : 'Quick Topics:'}
            </span>
            {[
              { label: isTr ? '🔗 Fikirleri Bağlama' : '🔗 Connect Nodes', q: isTr ? 'bağla' : 'connect' },
              { label: isTr ? '➕ Dal Ekleme' : '➕ Add Branch', q: isTr ? 'dal' : 'branch' },
              { label: isTr ? '✏️ İsim Düzenleme' : '✏️ Edit Node', q: isTr ? 'düzenle' : 'edit' },
              { label: isTr ? '📑 Sekmeler' : '📑 Tabs', q: isTr ? 'sekme' : 'tab' },
              { label: isTr ? '🔒 PIN Şifreleme' : '🔒 PIN Lock', q: isTr ? 'şifre' : 'lock' },
              { label: isTr ? '📚 Sözlük' : '📚 Dictionary', q: isTr ? 'sözlük' : 'dictionary' }
            ].map(chip => (
              <button
                key={chip.q}
                onClick={() => setSearchQuery(chip.q)}
                className="px-2.5 py-1 rounded-xl bg-[var(--bg-primary)] hover:bg-sky-500 hover:text-white border border-[var(--border-color)] font-medium text-[var(--text-muted)] transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs (Shown when search is empty) */}
        {!searchQuery && (
          <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-x-auto text-xs">
            {[
              { id: 'mindset', label: isTr ? '🧠 Zihin Haritası' : '🧠 Mind Map & Galaxy', icon: Share2 },
              { id: 'editor', label: isTr ? '📝 Not Editörü & Modlar' : '📝 Editor & Modes', icon: FileText },
              { id: 'dictionary', label: isTr ? '📚 Sözlük' : '📚 Dictionary', icon: BookOpen },
              { id: 'security', label: isTr ? '🔒 Güvenlik & PIN' : '🔒 Security & PIN', icon: ShieldCheck }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)]">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-sky-500" />
              <p className="font-bold text-sm">
                {isTr ? 'Aramanızla eşleşen bir yardım konusu bulunamadı.' : 'No matching help topics found.'}
              </p>
              <p className="text-xs mt-1">
                {isTr ? '"bağlama", "dal", "sekme" veya "şifreleme" gibi kelimeleri deneyebilirsiniz.' : 'Try searching for "connect", "branch", "tab" or "lock".'}
              </p>
            </div>
          ) : (
            filteredFaqs.map(faq => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-sky-500/40 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-extrabold text-sm sm:text-base text-[var(--text-main)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                    <span>{faq.title}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 uppercase shrink-0">
                    {faq.category}
                  </span>
                </div>

                <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3 py-2 rounded-xl">
                  💡 {faq.shortAnswer}
                </div>

                <div className="mt-3 space-y-2 border-t border-[var(--border-color)] pt-3 text-xs text-[var(--text-muted)] font-medium">
                  {faq.steps.map((step, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>
            LexiNote v1.0 • {isTr ? 'Gizlilik Odaklı & Yerel' : 'Privacy-First & Offline'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold cursor-pointer transition-all shadow-md shadow-sky-500/20"
          >
            {isTr ? 'Anladım, Kapat' : 'Got it, Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
