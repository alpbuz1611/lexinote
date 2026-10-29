import { encryptData, decryptData } from '../src/services/cryptoService.js';
import { getFreedictMetadata, lookupEnglishWord, searchFreedict } from '../src/data/freedict/freedictLoader.js';
import { translateOfflinePhraseOrSentence } from '../src/services/sentenceTranslationService.js';
import { checkWord, getAutoCorrection } from '../src/services/spellcheckService.js';
import { GET_DEFAULT_FREEFORM_MINDSET } from '../src/data/defaultMindsets.js';

async function runReleaseVerification() {
  console.log('================================================================');
  console.log('🚀 LEXINOTE v1.0.0 RELEASE READINESS VERIFICATION SUITE');
  console.log('================================================================\n');

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // 1. Dictionary Scope (Beyond just 'abroad')
  console.log('--- 1. FreeDict Sözlük Kapsamı ve Boyutu (abroad ötesi kelimeler) ---');
  const stats = getFreedictMetadata();
  assert(stats.uniqueHeadwords >= 34000, `34k+ İngilizce başlık kelimesi mevcut (Gerçek: ${stats.uniqueHeadwords})`);
  assert(stats.reverseIndexWords >= 48000, `48k+ Türkçe terim indeksi mevcut (Gerçek: ${stats.reverseIndexWords})`);

  const testWords = ['abroad', 'computer', 'hospital', 'mountain', 'freedom', 'weather', 'universe', 'shadow', 'silence'];
  for (const word of testWords) {
    const res = lookupEnglishWord(word);
    assert(res.found && res.senses.length > 0, `"${word}" kelimesi sözlükte bulundu: "${res.translation.slice(0, 30)}..."`);
  }

  // 2. Polysemy & Sense Structure
  console.log('\n--- 2. Çok Anlamlılık (Polysemy) ve TEI Anlam Grupları ---');
  const polysemousWords = ['book', 'work', 'school', 'accommodate'];
  for (const w of polysemousWords) {
    const res = lookupEnglishWord(w);
    assert(res.isPolysemous === true && res.senses.length > 1, `"${w}" çok anlamlı olarak işaretlendi (${res.senses.length} anlam grubu)`);
  }

  // 3. Syntactic Sentence Translation Engine
  console.log('\n--- 3. Doğal Cümle Çeviri Motoru (SOV / Kurallı Türkçe) ---');
  const sent1 = translateOfflinePhraseOrSentence('I went to school yesterday');
  assert(sent1.translation === 'Dün okula gittim.', `"I went to school yesterday" ➔ "${sent1.translation}"`);

  const sent2 = translateOfflinePhraseOrSentence('I am working at home');
  assert(sent2.translation === 'Evde çalışıyorum.', `"I am working at home" ➔ "${sent2.translation}"`);

  const sent3 = translateOfflinePhraseOrSentence('She booked a room');
  assert(sent3.translation === 'O bir oda yer ayırttı.', `"She booked a room" ➔ "${sent3.translation}"`);

  // 4. Spellcheck & Auto-correct
  console.log('\n--- 4. ENABLE1 Yazım Denetimi ve İmla Kuralları ---');
  const aboradCheck = checkWord('aborad', 'en');
  assert(aboradCheck.isValid === false, `'aborad' yanlış yazım olarak algılandı`);
  const aboradCorr = getAutoCorrection('aborad', 'en');
  assert(aboradCorr === 'abroad', `getAutoCorrection('aborad') ➔ 'abroad' önerdi`);

  const abroadCheck = checkWord('abroad', 'en');
  assert(aboradCheck.isValid === false && abroadCheck.isValid === true, `'abroad' doğru yazım olarak algılandı`);
  const abroadCorr = getAutoCorrection('abroad', 'en');
  assert(abroadCorr === null, `Doğru yazılan 'abroad' kelimesine dokunulmadı`);

  const gururCorr = getAutoCorrection('gurur', 'tr');
  assert(gururCorr === null || gururCorr === 'gurur', `'gurur' kelimesi hatalı bir kelimeye (örn. huzur) dönüştürülmedi`);

  // 5. High-Security AES-256 GCM PBKDF2 Local Encryption
  console.log('\n--- 5. Güvenlik: PBKDF2 & AES-256 GCM Yerel Şifreleme ---');
  const testPayload = {
    content: 'Çok gizli şirket finansal raporu ve stratejik patentler.',
    todos: [{ id: 't1', text: 'Patent başvurusunu imzala', done: false }],
    gratitude: ['Güvenli şifreleme altyapısı']
  };

  const encryptedPackage = await encryptData(testPayload, '5678');
  assert(encryptedPackage.ciphertext && encryptedPackage.iv && encryptedPackage.salt, 'AES-256 şifreli paket başarıyla oluşturuldu');
  assert(!JSON.stringify(encryptedPackage).includes('patentler'), 'Şifrelenmiş pakette açık metin sızıntısı YOK');

  const decryptedPayload = await decryptData(encryptedPackage, '5678');
  assert(decryptedPayload.content === testPayload.content, 'Doğru PIN ile içerik eksiksiz çözümlendi');
  assert(decryptedPayload.todos[0].text === 'Patent başvurusunu imzala', 'Todo maddeleri başarıyla kurtarıldı');

  let failedCorrectly = false;
  try {
    await decryptData(encryptedPackage, '0000');
  } catch (err) {
    failedCorrectly = true;
  }
  assert(failedCorrectly, 'Hatalı PIN ile şifre çözme işlemi reddedildi (Auth Tag Mismatch)');

  // 6. Freeform Mindset Studio & Hierarchical Tree Architecture
  console.log('\n--- 6. Zihin Haritası Hiyerarşisi (Cambridge -> Cambridge Üniversitesi -> Raspberry Pi -> Ucuz Bilgisayarlar) ---');
  const trMindset = GET_DEFAULT_FREEFORM_MINDSET('tr');
  const enMindset = GET_DEFAULT_FREEFORM_MINDSET('en');

  // Verify TR Chain
  const trCambridge = trMindset.nodes.find(n => n.id === 'node-cambridge');
  const trUni = trMindset.nodes.find(n => n.id === 'node-uni');
  const trRpi = trMindset.nodes.find(n => n.id === 'node-rpi');
  const trCheap = trMindset.nodes.find(n => n.id === 'node-cheap-pc');

  assert(trCambridge && trCambridge.text === 'Cambridge', 'TR Zihin Haritası kök düğümü: Cambridge');
  assert(trUni && trUni.text === 'Cambridge Üniversitesi', 'TR Zihin Haritası 1. dal: Cambridge Üniversitesi');
  assert(trRpi && trRpi.text === 'Raspberry Pi', 'TR Zihin Haritası 2. dal: Raspberry Pi');
  assert(trCheap && trCheap.text.includes('Ucuz Bilgisayarlar'), 'TR Zihin Haritası 3. dal: Ucuz Bilgisayarlar');

  // Verify Hierarchical Edges
  const trEdge1 = trMindset.edges.find(e => e.sourceId === 'node-cambridge' && e.targetId === 'node-uni');
  const trEdge2 = trMindset.edges.find(e => e.sourceId === 'node-uni' && e.targetId === 'node-rpi');
  const trEdge3 = trMindset.edges.find(e => e.sourceId === 'node-rpi' && e.targetId === 'node-cheap-pc');

  assert(trEdge1 !== undefined, 'Hiyerarşik bağlantı 1: Cambridge ➔ Cambridge Üniversitesi');
  assert(trEdge2 !== undefined, 'Hiyerarşik bağlantı 2: Cambridge Üniversitesi ➔ Raspberry Pi');
  assert(trEdge3 !== undefined, 'Hiyerarşik bağlantı 3: Raspberry Pi ➔ Ucuz Bilgisayarlar');

  // Verify EN Chain
  const enUni = enMindset.nodes.find(n => n.id === 'node-uni');
  const enCheap = enMindset.nodes.find(n => n.id === 'node-cheap-pc');
  assert(enUni && enUni.text === 'Cambridge University', 'EN Mindset branch 1: Cambridge University');
  assert(enCheap && enCheap.text.includes('Affordable Computers'), 'EN Mindset branch 3: Affordable Computers');

  console.log('\n================================================================');
  console.log(`📊 SONUÇ: ${passedTests} / ${totalTests} TEST BAŞARIYLA TAMAMLANDI (%${((passedTests/totalTests)*100).toFixed(0)})`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runReleaseVerification().catch(err => {
  console.error('Doğrulama betiğinde hata:', err);
  process.exit(1);
});
