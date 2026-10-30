// LexiNote English Lexicon & Typo Database
// Primary Offline Dictionary: FreeDict English-Turkish (eng-tur 0.3) - GPLv2+
// Spellcheck: ENABLE1 (172,819 words) - Public Domain

export const DICTIONARY_SOURCE_INFO = {
  en: {
    name: "FreeDict English-Turkish Dictionary (v0.3)",
    standard: "FreeDict TEI P5 XML / 34.405 Başlık Kaydı",
    phonetics: "IPA ve Fonetik Gösterimler",
    provider: "FreeDict Project (GPLv2+)"
  },
  spellcheck: {
    name: "ENABLE1 Spellcheck Wordlist",
    standard: "172.819 Doğrulanmış İngilizce Kelime Listesi",
    provider: "Alan Beale / Peter Norvig (Public Domain)"
  },
  tr: {
    name: "TDK İmla Kılavuzu & Türkçe Söz Dağarcığı",
    standard: "Yerleşik Türkçe İmla Kuralları & Ters Sözlük İndeksi",
    phonetics: "Türkçe Sesletim & Köken Bilgisi",
    provider: "Yerel İmla ve Sözlük Altyapısı"
  }
};

export const EN_TYPO_MAP = {
  aborad: "abroad",
  abrod: "abroad",
  abroud: "abroad",
  definately: "definitely",
  definatly: "definitely",
  definetly: "definitely",
  seperate: "separate",
  separete: "separate",
  untill: "until",
  recieved: "received",
  recieve: "receive",
  calender: "calendar",
  buisness: "business",
  bussiness: "business",
  tommorrow: "tomorrow",
  tomorow: "tomorrow",
  wich: "which",
  becuase: "because",
  beacuse: "because",
  enviroment: "environment",
  goverment: "government",
  succesful: "successful",
  acheive: "achieve",
  accomodate: "accommodate",
  beleive: "believe",
  collegue: "colleague",
  concious: "conscious",
  occured: "occurred",
  opertunity: "opportunity",
  oppurtunity: "opportunity",
  reccomend: "recommend",
  responsability: "responsibility",
  truely: "truly",
  wierd: "weird",
  writting: "writing",
  neccessary: "necessary",
  necesary: "necessary",
  mispell: "misspell",
  noticable: "noticeable",
  publically: "publicly",
  refered: "referred",
  religous: "religious",
  remeber: "remember",
  secratary: "secretary",
  tendancy: "tendency",
  threshhold: "threshold",
  unforseen: "unforeseen",
  usefull: "useful",
  vehical: "vehicle",
  yeild: "yield",
  beleif: "belief",
  embarass: "embarrass",
  existance: "existence",
  foriegn: "foreign",
  guarentee: "guarantee",
  harrass: "harass",
  heigth: "height",
  heirarchy: "hierarchy",
  humourous: "humorous",
  independant: "independent",
  inteligence: "intelligence",
  liason: "liaison",
  millenium: "millennium",
  morgage: "mortgage",
  ocassion: "occasion",
  persistant: "persistent",
  posession: "possession",
  priviledge: "privilege",
  rythm: "rhythm",
  schedual: "schedule",
  skilfull: "skillful",
  suprise: "surprise",
  tecnology: "technology",
  temperture: "temperature",
  thier: "their",
  thourt: "thought",
  unfortunatly: "unfortunately",
  wether: "whether",
  whitch: "which",
  agend: "agenda",
  stratagy: "strategy",
  stratigi: "strategy"
};

// Oxford 3000 / Cambridge Aligned Lexicon with CEFR level & IPA
export const EN_TO_TR_LEXICON = {

  "international": {
    tr: "uluslararası / küresel",
    pos: "adjective",
    cefr: "B1",
    ipa: "/ˌɪntəˈnæʃnəl/",
    source: "Oxford & Cambridge B2",
    desc: "Involving more than one country.",
    examples: ["An international conference in Istanbul."]
  },
  "global": {
    tr: "küresel / dünya çapında",
    pos: "adjective",
    cefr: "B1",
    ipa: "/ˈɡləʊbl/",
    source: "Oxford & Cambridge B2",
    desc: "Covering or affecting the whole world.",
    examples: ["Global trade and economic collaboration."]
  },
  "domestic": {
    tr: "yurt içi / evcil / aile içi",
    pos: "adjective",
    cefr: "B2",
    ipa: "/dəˈmestɪk/",
    source: "Oxford & Cambridge B2",
    desc: "Relating to a person's own country.",
    examples: ["Domestic production increased."]
  },
  "sustainable": {
    tr: "sürdürülebilir",
    pos: "adjective",
    cefr: "B2",
    ipa: "/səˈsteɪnəbl/",
    source: "Oxford & Cambridge B2",
    desc: "Able to be maintained over time.",
    examples: ["Building sustainable habits."]
  },
  "development": {
    tr: "gelişme / kalkınma",
    pos: "noun",
    cefr: "B1",
    ipa: "/dɪˈveləpmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The process of developing.",
    examples: ["Software development roadmap."]
  },
  "perspective": {
    tr: "bakış açısı / perspektif",
    pos: "noun",
    cefr: "B2",
    ipa: "/pəˈspektɪv/",
    source: "Oxford & Cambridge B2",
    desc: "A particular way of regarding something.",
    examples: ["Looking from a fresh perspective."]
  },
  "negotiation": {
    tr: "müzakere / görüşme",
    pos: "noun",
    cefr: "B2",
    ipa: "/nɪˌɡəʊʃiˈeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Discussion aimed at reaching an agreement.",
    examples: ["Successful contract negotiation."]
  },
  "implementation": {
    tr: "uygulama / hayata geçirme",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌɪmplɪmenˈteɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Putting a plan into effect.",
    examples: ["Implementation of new features."]
  },
  "comprehensive": {
    tr: "kapsamlı / etraflı",
    pos: "adjective",
    cefr: "B2",
    ipa: "/ˌkɒmprɪˈhensɪv/",
    source: "Oxford & Cambridge B2",
    desc: "Complete and including everything.",
    examples: ["A comprehensive dictionary guide."]
  },
  "significant": {
    tr: "önemli / kayda değer",
    pos: "adjective",
    cefr: "B2",
    ipa: "/sɪɡˈnɪfɪkənt/",
    source: "Oxford & Cambridge B2",
    desc: "Important and worthy of attention.",
    examples: ["A significant improvement."]
  },
  "potential": {
    tr: "potansiyel / gizilgüç",
    pos: "noun/adj",
    cefr: "B1",
    ipa: "/pəˈtenʃl/",
    source: "Oxford & Cambridge B2",
    desc: "Capacity to develop into something.",
    examples: ["Unlocking your full potential."]
  },
  "collaboration": {
    tr: "iş birliği / ortak çalışma",
    pos: "noun",
    cefr: "B2",
    ipa: "/kəˌlæbəˈreɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Working together to achieve a goal.",
    examples: ["Close collaboration between teams."]
  },
  "circumstance": {
    tr: "koşul / durum",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈsɜːkəmstəns/",
    source: "Oxford & Cambridge B2",
    desc: "A condition connected to an event.",
    examples: ["Under changing circumstances."]
  },
  "computer": {
    tr: "bilgisayar",
    pos: "noun",
    cefr: "A1",
    ipa: "/kəmˈpjuːtər/",
    source: "Oxford & Cambridge A1",
    desc: "An electronic device for storing and processing data.",
    examples: ["I use my computer for software development every day. → Her gün yazılım geliştirme için bilgisayarımı kullanıyorum."]
  },
  "consequence": {
    tr: "sonuç / netice",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈkɒnsɪkwəns/",
    source: "Oxford & Cambridge B2",
    desc: "A result or effect of an action.",
    examples: ["Understanding the consequences."]
  },
  "environment": {
    tr: "çevre / ortam",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪnˈvaɪrənmənt/",
    source: "Oxford & Cambridge B2",
    desc: "Surroundings in which one operates.",
    examples: ["A productive work environment."]
  },
  "opportunity": {
    tr: "fırsat / imkan",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌɒpəˈtjuːnəti/",
    source: "Oxford & Cambridge B2",
    desc: "Circumstances making something possible.",
    examples: ["Seize the learning opportunity."]
  },
  "responsible": {
    tr: "sorumlu / mesul",
    pos: "adjective",
    cefr: "B1",
    ipa: "/rɪˈspɒnsəbl/",
    source: "Oxford & Cambridge B2",
    desc: "Having an obligation to do something.",
    examples: ["Responsible for quality delivery."]
  },
  "achievement": {
    tr: "başarı / kazanım",
    pos: "noun",
    cefr: "B1",
    ipa: "/əˈtʃiːvmənt/",
    source: "Oxford & Cambridge B2",
    desc: "Something done successfully with effort.",
    examples: ["Celebrating our team's achievement."]
  },
  "challenge": {
    tr: "zorluk / meydan okuma",
    pos: "noun/verb",
    cefr: "B1",
    ipa: "/ˈtʃælɪndʒ/",
    source: "Oxford & Cambridge B2",
    desc: "A difficult task that tests ability.",
    examples: ["Embrace every new challenge."]
  },
  "innovation": {
    tr: "yenilik / inovasyon",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌɪnəˈveɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A new method, idea, or product.",
    examples: ["Constant innovation in software."]
  },
  "efficiency": {
    tr: "verimlilik / randıman",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪˈfɪʃnsi/",
    source: "Oxford & Cambridge B2",
    desc: "Achieving maximum productivity.",
    examples: ["Optimizing system efficiency."]
  },
  "commitment": {
    tr: "bağlılık / taahhüt",
    pos: "noun",
    cefr: "B2",
    ipa: "/kəˈmɪtmənt/",
    source: "Oxford & Cambridge B2",
    desc: "Dedication to a cause or activity.",
    examples: ["High commitment to excellence."]
  },
  "resilience": {
    tr: "dayanıklılık / esneklik",
    pos: "noun",
    cefr: "C1",
    ipa: "/rɪˈzɪliəns/",
    source: "Oxford & Cambridge B2",
    desc: "Capacity to recover quickly from hardship.",
    examples: ["Mental resilience under stress."]
  },
  "awareness": {
    tr: "farkındalık / bilinç",
    pos: "noun",
    cefr: "B2",
    ipa: "/əˈweənəs/",
    source: "Oxford & Cambridge B2",
    desc: "Knowledge or perception of a situation.",
    examples: ["Building self-awareness daily."]
  },
  "curiosity": {
    tr: "merak / ilginçlik",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌkjʊəriˈɒsəti/",
    source: "Oxford & Cambridge B2",
    desc: "A strong desire to know or learn.",
    examples: ["Intellectual curiosity drives growth."]
  },
  "confidence": {
    tr: "özgüven / itimat",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈkɒnfɪdəns/",
    source: "Oxford & Cambridge B2",
    desc: "Self-assurance in one's own abilities.",
    examples: ["Speaking with confidence."]
  },
  "clarity": {
    tr: "berraklık / açıklık",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈklærəti/",
    source: "Oxford & Cambridge B2",
    desc: "Quality of being clear and easy to understand.",
    examples: ["Writing with focus and clarity."]
  },
  "compassion": {
    tr: "şefkat / merhamet",
    pos: "noun",
    cefr: "B2",
    ipa: "/kəmˈpæʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Sympathy and concern for others.",
    examples: ["Treating yourself with compassion."]
  },
  "pride": {
    tr: "gurur / kıvanç",
    pos: "noun",
    cefr: "B2",
    ipa: "/praɪd/",
    source: "Oxford & Cambridge B2",
    desc: "Satisfaction derived from achievements.",
    examples: ["Take pride in your honest effort."]
  },
  "peace": {
    tr: "huzur / barış",
    pos: "noun",
    cefr: "A2",
    ipa: "/piːs/",
    source: "Oxford & Cambridge B2",
    desc: "Freedom from disturbance; tranquility.",
    examples: ["Inner peace in a quiet evening."]
  },
  "freedom": {
    tr: "özgürlük / hürriyet",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈfriːdəm/",
    source: "Oxford & Cambridge B2",
    desc: "The power or right to act and speak.",
    examples: ["Creative freedom in journaling."]
  },
  "integrity": {
    tr: "dürüstlük / bütünlük",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪnˈteɡrəti/",
    source: "Oxford & Cambridge B2",
    desc: "The quality of being honest and moral.",
    examples: ["Professional integrity is paramount."]
  },
  "capability": {
    tr: "kabiliyet / yetenek / kapasite",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌkeɪpəˈbɪləti/",
    source: "Oxford & Cambridge B2",
    desc: "The power or ability to do something.",
    examples: ["Expanding technical capabilities."]
  },
  "adaptation": {
    tr: "uyum sağlama / adaptasyon",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌædæpˈteɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The process of changing to suit conditions.",
    examples: ["Rapid adaptation to market changes."]
  },
  "assessment": {
    tr: "değerlendirme / ölçüm",
    pos: "noun",
    cefr: "B2",
    ipa: "/əˈsesmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The evaluation or estimate of quality.",
    examples: ["Quarterly performance assessment."]
  },
  "assumption": {
    tr: "varsayım / kabul",
    pos: "noun",
    cefr: "B2",
    ipa: "/əˈsʌmpʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A thing that is accepted as true without proof.",
    examples: ["Challenging initial assumptions."]
  },
  "attitude": {
    tr: "tutum / tavır",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈætɪtjuːd/",
    source: "Oxford & Cambridge B2",
    desc: "A settled way of thinking or feeling.",
    examples: ["A positive mental attitude."]
  },
  "authority": {
    tr: "yetki / otorite",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɔːˈθɒrəti/",
    source: "Oxford & Cambridge B2",
    desc: "The power or right to give orders.",
    examples: ["Delegating authority to leads."]
  },
  "benefit": {
    tr: "fayda / yarar",
    pos: "noun/verb",
    cefr: "A2",
    ipa: "/ˈbenɪfɪt/",
    source: "Oxford & Cambridge B2",
    desc: "An advantage or profit gained.",
    examples: ["Mutual benefits for both sides."]
  },
  "campaign": {
    tr: "kampanya / seferberlik",
    pos: "noun",
    cefr: "B1",
    ipa: "/kæmˈpeɪn/",
    source: "Oxford & Cambridge B2",
    desc: "A series of planned actions for a goal.",
    examples: ["Product marketing campaign."]
  },
  "capacity": {
    tr: "kapasite / hacim",
    pos: "noun",
    cefr: "B1",
    ipa: "/kəˈpæsəti/",
    source: "Oxford & Cambridge B2",
    desc: "The maximum amount that something can contain.",
    examples: ["Operating at full capacity."]
  },
  "category": {
    tr: "kategori / sınıf",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈkætəɡəri/",
    source: "Oxford & Cambridge B2",
    desc: "A class or division of people or things.",
    examples: ["Organizing notes by category."]
  },
  "community": {
    tr: "topluluk / camia",
    pos: "noun",
    cefr: "A2",
    ipa: "/kəˈmjuːnəti/",
    source: "Oxford & Cambridge B2",
    desc: "A group of people living or interacting together.",
    examples: ["An active developer community."]
  },
  "concept": {
    tr: "kavram / konsept",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈkɒnsept/",
    source: "Oxford & Cambridge B2",
    desc: "An abstract idea; a general notion.",
    examples: ["Explaining the core concept."]
  },
  "conclusion": {
    tr: "sonuç / vargı",
    pos: "noun",
    cefr: "B1",
    ipa: "/kənˈkluːʒn/",
    source: "Oxford & Cambridge B2",
    desc: "The end or finish of an event or process.",
    examples: ["Drawing a solid conclusion."]
  },
  "condition": {
    tr: "koşul / şart / durum",
    pos: "noun",
    cefr: "A2",
    ipa: "/kənˈdɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The state of something with regard to its appearance.",
    examples: ["Optimal working conditions."]
  },
  "connection": {
    tr: "bağlantı / bağ",
    pos: "noun",
    cefr: "A2",
    ipa: "/kəˈnekʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A relationship in which a person or thing is linked.",
    examples: ["Deep human connection."]
  },
  "contribution": {
    tr: "katkı / yardım",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌkɒntrɪˈbjuːʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A gift or payment to a common fund or cause.",
    examples: ["Valuable contribution to the codebase."]
  },
  "corporation": {
    tr: "şirket / kurum",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌkɔːpəˈreɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A large company or group of companies.",
    examples: ["Enterprise corporate clients."]
  },
  "creativity": {
    tr: "yaratıcılık",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌkriːeɪˈtɪvəti/",
    source: "Oxford & Cambridge B2",
    desc: "The use of imagination or original ideas.",
    examples: ["Unleashing creative flow in writing."]
  },
  "criterion": {
    tr: "kriter / ölçüt",
    pos: "noun",
    cefr: "B2",
    ipa: "/kraɪˈtɪəriən/",
    source: "Oxford & Cambridge B2",
    desc: "A principle or standard by which something is judged.",
    examples: ["Meeting all project criteria."]
  },
  "criticism": {
    tr: "eleştiri / tenkit",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈkrɪtɪsɪzəm/",
    source: "Oxford & Cambridge B2",
    desc: "The expression of disapproval based on faults.",
    examples: ["Constructive criticism is welcomed."]
  },
  "culture": {
    tr: "kültür",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˈkʌltʃə/",
    source: "Oxford & Cambridge B2",
    desc: "The ideas, customs, and social behavior of people.",
    examples: ["Fostering an open team culture."]
  },
  "definition": {
    tr: "tanım / tarif",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌdefɪˈnɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A statement of the exact meaning of a word.",
    examples: ["Clear dictionary definition."]
  },
  "demonstration": {
    tr: "gösterim / kanıtlama",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌdemənˈstreɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "An act of showing or explaining how something works.",
    examples: ["Live product demonstration."]
  },
  "description": {
    tr: "açıklama / betimleme",
    pos: "noun",
    cefr: "A2",
    ipa: "/dɪˈskrɪpʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A spoken or written representation of a person/thing.",
    examples: ["Detailed note description."]
  },
  "difference": {
    tr: "fark / ayrım",
    pos: "noun",
    cefr: "A1",
    ipa: "/ˈdɪfrəns/",
    source: "Oxford & Cambridge B2",
    desc: "A point or way in which people or things are not same.",
    examples: ["Making a positive difference."]
  },
  "difficulty": {
    tr: "güçlük / zorluk",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈdɪfɪkəlti/",
    source: "Oxford & Cambridge B2",
    desc: "The state or condition of being difficult.",
    examples: ["Overcoming technical difficulty."]
  },
  "direction": {
    tr: "yön / istikamet / talimat",
    pos: "noun",
    cefr: "A2",
    ipa: "/dəˈrekʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A course along which someone or something moves.",
    examples: ["Setting the strategic direction."]
  },
  "discovery": {
    tr: "keşif / buluş",
    pos: "noun",
    cefr: "B1",
    ipa: "/dɪˈskʌvəri/",
    source: "Oxford & Cambridge B2",
    desc: "The act or process of discovering.",
    examples: ["Exciting discovery of new insights."]
  },
  "discussion": {
    tr: "tartışma / müzakere",
    pos: "noun",
    cefr: "A2",
    ipa: "/dɪˈskʌʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action or process of talking about something.",
    examples: ["Engaging in fruitful discussion."]
  },
  "distribution": {
    tr: "dağıtım / paylaşım",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌdɪstrɪˈbjuːʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action of sharing something out among a number.",
    examples: ["Global software distribution."]
  },
  "diversity": {
    tr: "çeşitlilik / farklılık",
    pos: "noun",
    cefr: "B2",
    ipa: "/daɪˈvɜːsəti/",
    source: "Oxford & Cambridge B2",
    desc: "The state of having variety or multiformity.",
    examples: ["Embracing cultural diversity."]
  },
  "document": {
    tr: "belge / doküman",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˈdɒkjumənt/",
    source: "Oxford & Cambridge B2",
    desc: "A piece of written, printed, or electronic matter.",
    examples: ["Encrypting sensitive documents."]
  },
  "economy": {
    tr: "ekonomi / iktisat",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪˈkɒnəmi/",
    source: "Oxford & Cambridge B2",
    desc: "The wealth and resources of a country or region.",
    examples: ["Global economic trends."]
  },
  "education": {
    tr: "eğitim / öğretim",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˌedʒuˈkeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The process of receiving or giving systematic instruction.",
    examples: ["Lifelong education matters."]
  },
  "emphasis": {
    tr: "vurgu / önem",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈemfəsɪs/",
    source: "Oxford & Cambridge B2",
    desc: "Special importance, value, or prominence given.",
    examples: ["Placing emphasis on privacy."]
  },
  "employee": {
    tr: "çalışan / işçi",
    pos: "noun",
    cefr: "A2",
    ipa: "/ɪmˈplɔɪiː/",
    source: "Oxford & Cambridge B2",
    desc: "A person employed for wages or salary.",
    examples: ["Valuing every single employee."]
  },
  "employer": {
    tr: "işveren",
    pos: "noun",
    cefr: "A2",
    ipa: "/ɪmˈplɔɪə/",
    source: "Oxford & Cambridge B2",
    desc: "A person or organization that employs people.",
    examples: ["A supportive and fair employer."]
  },
  "engineering": {
    tr: "mühendislik",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌendʒɪˈnɪərɪŋ/",
    source: "Oxford & Cambridge B2",
    desc: "The branch of science and technology with design.",
    examples: ["Excellence in software engineering."]
  },
  "enterprise": {
    tr: "girişim / işletme / teşebbüs",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈentəpraɪz/",
    source: "Oxford & Cambridge B2",
    desc: "A business or company, especially a large one.",
    examples: ["Enterprise-grade security."]
  },
  "enthusiasm": {
    tr: "coşku / şevk / heves",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪnˈθjuːziæzəm/",
    source: "Oxford & Cambridge B2",
    desc: "Intense and eager enjoyment, interest, or approval.",
    examples: ["Writing notes with enthusiasm."]
  },
  "equality": {
    tr: "eşitlik",
    pos: "noun",
    cefr: "B2",
    ipa: "/iˈkwɒləti/",
    source: "Oxford & Cambridge B2",
    desc: "The state of being equal, especially in rights.",
    examples: ["Striving for fairness and equality."]
  },
  "equipment": {
    tr: "ekipman / donanım",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪˈkwɪpmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The necessary items for a particular purpose.",
    examples: ["Upgrading office equipment."]
  },
  "essential": {
    tr: "temel / zorunlu / elzem",
    pos: "adjective",
    cefr: "B1",
    ipa: "/ɪˈsenʃl/",
    source: "Oxford & Cambridge B2",
    desc: "Absolutely necessary; extremely important.",
    examples: ["Essential daily reflection."]
  },
  "establishment": {
    tr: "kuruluş / müessese",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪˈstæblɪʃmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The action of establishing something.",
    examples: ["Celebrating our company establishment."]
  },
  "estimate": {
    tr: "tahmin / kestirim",
    pos: "noun/verb",
    cefr: "B1",
    ipa: "/ˈestɪmət/",
    source: "Oxford & Cambridge B2",
    desc: "Roughly calculate or judge the value/number.",
    examples: ["A realistic budget estimate."]
  },
  "evaluation": {
    tr: "değerlendirme / ölçümleme",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪˌvæljuˈeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The making of a judgment about value.",
    examples: ["Comprehensive evaluation of results."]
  },
  "evidence": {
    tr: "kanıt / delil",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈevɪdəns/",
    source: "Oxford & Cambridge B2",
    desc: "The available body of facts or information.",
    examples: ["Solid evidence supporting our claim."]
  },
  "evolution": {
    tr: "evrim / gelişim",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌiːvəˈluːʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The gradual development of something.",
    examples: ["The evolution of writing tools."]
  },
  "exception": {
    tr: "istisna",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪkˈsepʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A person or thing that is excluded from a general rule.",
    examples: ["Every rule has an exception."]
  },
  "executive": {
    tr: "yönetici / icra kurulu üyesi",
    pos: "noun/adj",
    cefr: "B2",
    ipa: "/ɪɡˈzekjətɪv/",
    source: "Oxford & Cambridge B2",
    desc: "Having the power to put plans into effect.",
    examples: ["Chief Executive Officer updates."]
  },
  "expectation": {
    tr: "beklenti / umut",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌekspekˈteɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A strong belief that something will happen.",
    examples: ["Exceeding customer expectations."]
  },
  "experience": {
    tr: "deneyim / tecrübe",
    pos: "noun",
    cefr: "A2",
    ipa: "/ɪkˈspɪəriəns/",
    source: "Oxford & Cambridge B2",
    desc: "Practical contact with and observation of facts.",
    examples: ["Years of hands-on experience."]
  },
  "experiment": {
    tr: "deney / deneme",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪkˈsperɪmənt/",
    source: "Oxford & Cambridge B2",
    desc: "A scientific procedure undertaken to make a discovery.",
    examples: ["A successful UX experiment."]
  },
  "explanation": {
    tr: "açıklama / izahat",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˌekspləˈneɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A statement or account that makes something clear.",
    examples: ["Clear and concise explanation."]
  },
  "expression": {
    tr: "ifade / anlatım",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪkˈspreʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action of making known one's thoughts/feelings.",
    examples: ["Freedom of creative expression."]
  },
  "extension": {
    tr: "uzantı / genişletme",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪkˈstenʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A part that is added to something to enlarge it.",
    examples: ["Requesting a project deadline extension."]
  },
  "foundation": {
    tr: "temel / vakıf / dayanak",
    pos: "noun",
    cefr: "B2",
    ipa: "/faʊnˈdeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The basis or groundwork of anything.",
    examples: ["Laying a solid software foundation."]
  },
  "frequency": {
    tr: "sıklık / frekans",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈfriːkwənsi/",
    source: "Oxford & Cambridge B2",
    desc: "The rate at which something occurs over time.",
    examples: ["Checking notes with regular frequency."]
  },
  "generation": {
    tr: "nesil / jenerasyon / üretim",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌdʒenəˈreɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "All of the people born around the same time.",
    examples: ["Inspiring the next generation."]
  },
  "government": {
    tr: "hükümet / yönetim",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˈɡʌvənmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The governing body of a nation or state.",
    examples: ["Compliance with government regulations."]
  },
  "guideline": {
    tr: "kılavuz / yönerge",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈɡaɪdlaɪn/",
    source: "Oxford & Cambridge B2",
    desc: "A general rule, principle, or piece of advice.",
    examples: ["Clear design and code guidelines."]
  },
  "hierarchy": {
    tr: "hiyerarşi / aşamalanma",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈhaɪərɑːki/",
    source: "Oxford & Cambridge B2",
    desc: "A system in which members are ranked.",
    examples: ["A flat organizational hierarchy."]
  },
  "hypothesis": {
    tr: "hipotez / varsayım",
    pos: "noun",
    cefr: "B2",
    ipa: "/haɪˈpɒθəsɪs/",
    source: "Oxford & Cambridge B2",
    desc: "A proposed explanation made on limited evidence.",
    examples: ["Testing the scientific hypothesis."]
  },
  "identification": {
    tr: "kimlik tespiti / teşhis",
    pos: "noun",
    cefr: "B2",
    ipa: "/aɪˌdentɪfɪˈkeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action or process of identifying someone.",
    examples: ["Secure user identification."]
  },
  "illustration": {
    tr: "örnekleme / resimleme",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌɪləˈstreɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A picture illustrating a book or article.",
    examples: ["A vivid visual illustration."]
  },
  "importance": {
    tr: "önem / ehemmiyet",
    pos: "noun",
    cefr: "A2",
    ipa: "/ɪmˈpɔːtns/",
    source: "Oxford & Cambridge B2",
    desc: "The state or fact of being of great significance.",
    examples: ["Emphasizing the importance of rest."]
  },
  "improvement": {
    tr: "iyileştirme / gelişme",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪmˈpruːvmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The action of improving or being improved.",
    examples: ["Continuous improvement each sprint."]
  },
  "incident": {
    tr: "olay / hadise / vaka",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈɪnsɪdənt/",
    source: "Oxford & Cambridge B2",
    desc: "An event or occurrence, especially one that is unusual.",
    examples: ["Zero security incidents reported."]
  },
  "indication": {
    tr: "belirti / işaret / gösterge",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌɪndɪˈkeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A sign or piece of information that indicates.",
    examples: ["Early indications of market success."]
  },
  "industry": {
    tr: "sanayi / endüstri / sektör",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˈɪndəstri/",
    source: "Oxford & Cambridge B2",
    desc: "Economic activity concerned with goods.",
    examples: ["The modern technology industry."]
  },
  "influence": {
    tr: "etki / nüfuz",
    pos: "noun/verb",
    cefr: "B1",
    ipa: "/ˈɪnfluəns/",
    source: "Oxford & Cambridge B2",
    desc: "The capacity to have an effect on character/behavior.",
    examples: ["A positive influence on colleagues."]
  },
  "information": {
    tr: "bilgi / enformasyon",
    pos: "noun",
    cefr: "A1",
    ipa: "/ˌɪnfəˈmeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Facts provided or learned about something.",
    examples: ["Protecting confidential information."]
  },
  "initiative": {
    tr: "girişim / inisiyatif",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪˈnɪʃətɪv/",
    source: "Oxford & Cambridge B2",
    desc: "The ability to assess and initiate things independently.",
    examples: ["Taking initiative on new ideas."]
  },
  "insight": {
    tr: "içgörü / anlayış / sezgi",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈɪnsaɪt/",
    source: "Oxford & Cambridge B2",
    desc: "An accurate and deep understanding of someone/thing.",
    examples: ["Valuable customer insights."]
  },
  "inspection": {
    tr: "denetim / muayene / teftiş",
    pos: "noun",
    cefr: "B2",
    ipa: "/ɪnˈspekʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Careful examination or scrutiny.",
    examples: ["Spellcheck inspection of the draft."]
  },
  "institution": {
    tr: "kurum / kuruluş",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌɪnstɪˈtjuːʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A society or organization founded for a purpose.",
    examples: ["Educational and academic institutions."]
  },
  "instruction": {
    tr: "talimat / yönerge / öğretim",
    pos: "noun",
    cefr: "A2",
    ipa: "/ɪnˈstrʌkʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A direction or order.",
    examples: ["Following safety instructions."]
  },
  "interaction": {
    tr: "etkileşim",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌɪntərˈækʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Reciprocal action or influence.",
    examples: ["Smooth user interaction."]
  },
  "investment": {
    tr: "yatırım",
    pos: "noun",
    cefr: "B1",
    ipa: "/ɪnˈvestmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The action or process of investing money for profit.",
    examples: ["Strategic investment in research."]
  },
  "invitation": {
    tr: "davet / davetiye",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˌɪnvɪˈteɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A written or spoken request to attend.",
    examples: ["Sending the calendar invitation."]
  },
  "journalism": {
    tr: "gazetecilik / habercilik",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈdʒɜːnəlɪzəm/",
    source: "Oxford & Cambridge B2",
    desc: "The activity of writing for newspapers or news sites.",
    examples: ["Ethical investigative journalism."]
  },
  "judgment": {
    tr: "yargı / muhakeme / hüküm",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈdʒʌdʒmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The ability to make considered decisions or come to conclusions.",
    examples: ["Exercising sound judgment."]
  },
  "jurisdiction": {
    tr: "yargı yetkisi / hüküm alanı",
    pos: "noun",
    cefr: "C1",
    ipa: "/ˌdʒʊərɪsˈdɪkʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The official power to make legal decisions.",
    examples: ["Operating under regional jurisdiction."]
  },
  "knowledge": {
    tr: "bilgi / vukuf",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˈnɒlɪdʒ/",
    source: "Oxford & Cambridge B2",
    desc: "Facts, information, and skills acquired.",
    examples: ["Knowledge is power when shared."]
  },
  "laboratory": {
    tr: "laboratuvar",
    pos: "noun",
    cefr: "B1",
    ipa: "/ləˈbɒrətri/",
    source: "Oxford & Cambridge B2",
    desc: "A room or building equipped for scientific experiments.",
    examples: ["Research in our AI laboratory."]
  },
  "leadership": {
    tr: "liderlik / önderlik",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈliːdəʃɪp/",
    source: "Oxford & Cambridge B2",
    desc: "The action of leading a group or organization.",
    examples: ["Empathetic and visionary leadership."]
  },
  "legislation": {
    tr: "mevzuat / yasa koyma",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌledʒɪsˈleɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Laws, considered collectively.",
    examples: ["Adhering to strict privacy legislation."]
  },
  "limitation": {
    tr: "kısıtlama / sınır",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌlɪmɪˈteɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A limiting rule or circumstance; a restriction.",
    examples: ["Working within memory limitations."]
  },
  "maintenance": {
    tr: "bakım / idame",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈmeɪntənəns/",
    source: "Oxford & Cambridge B2",
    desc: "The process of preserving a condition or situation.",
    examples: ["Routine system maintenance."]
  },
  "management": {
    tr: "yönetim / idare",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˈmænɪdʒmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The process of dealing with or controlling things.",
    examples: ["Efficient project management."]
  },
  "measurement": {
    tr: "ölçüm / boyut",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈmeʒəmənt/",
    source: "Oxford & Cambridge B2",
    desc: "The action of measuring something.",
    examples: ["Accurate KPI measurement."]
  },
  "mechanism": {
    tr: "mekanizma / düzenek",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈmekənɪzəm/",
    source: "Oxford & Cambridge B2",
    desc: "A system of parts working together.",
    examples: ["Encryption and key storage mechanism."]
  },
  "membership": {
    tr: "üyelik / mensubiyet",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈmembəʃɪp/",
    source: "Oxford & Cambridge B2",
    desc: "The state of being a member of a group.",
    examples: ["Renewing annual membership."]
  },
  "motivation": {
    tr: "motivasyon / isteklendirme",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌməʊtɪˈveɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The reason or reasons one has for acting.",
    examples: ["Finding intrinsic motivation to write."]
  },
  "negotiate": {
    tr: "müzakere etmek / uzlaşmak",
    pos: "verb",
    cefr: "B2",
    ipa: "/nɪˈɡəʊʃieɪt/",
    source: "Oxford & Cambridge B2",
    desc: "Try to reach an agreement or compromise.",
    examples: ["Negotiate fair terms."]
  },
  "observation": {
    tr: "gözlem / müşahede",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌɒbzəˈveɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action or process of closely observing.",
    examples: ["Recording daily observations in journal."]
  },
  "occupation": {
    tr: "meslek / iş / işgal",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌɒkjuˈpeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A job or profession.",
    examples: ["Listing your current occupation."]
  },
  "operation": {
    tr: "operasyon / ameliyat / harekat",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌɒpəˈreɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "An active process or functioning.",
    examples: ["Scaling operations globally."]
  },
  "organization": {
    tr: "organizasyon / örgüt / kuruluş",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˌɔːɡənaɪˈzeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "An organized body of people with a purpose.",
    examples: ["A non-profit organization."]
  },
  "participation": {
    tr: "katılım / iştirak",
    pos: "noun",
    cefr: "B2",
    ipa: "/pɑːˌtɪsɪˈpeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action of taking part in something.",
    examples: ["Active community participation."]
  },
  "partnership": {
    tr: "ortaklık / paydaşlık",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˈpɑːtnəʃɪp/",
    source: "Oxford & Cambridge B2",
    desc: "An association of two or more people as partners.",
    examples: ["A strategic international partnership."]
  },
  "performance": {
    tr: "performans / icra / başarım",
    pos: "noun",
    cefr: "B1",
    ipa: "/pəˈfɔːməns/",
    source: "Oxford & Cambridge B2",
    desc: "How well someone or something executes.",
    examples: ["Peak performance under pressure."]
  },
  "philosophy": {
    tr: "felsefe / hayat görüşü",
    pos: "noun",
    cefr: "B2",
    ipa: "/fəˈlɒsəfi/",
    source: "Oxford & Cambridge B2",
    desc: "The study of the fundamental nature of knowledge.",
    examples: ["A philosophy of mindful living."]
  },
  "population": {
    tr: "nüfus / popülasyon",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˌpɒpjuˈleɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "All the inhabitants of a particular place.",
    examples: ["Serving a diverse population."]
  },
  "possibility": {
    tr: "olasılık / ihtimal",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌpɒsəˈbɪləti/",
    source: "Oxford & Cambridge B2",
    desc: "A thing that may happen or be the case.",
    examples: ["Exploring every possibility."]
  },
  "preference": {
    tr: "tercih / yeğleme",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˈprefrəns/",
    source: "Oxford & Cambridge B2",
    desc: "A greater liking for one alternative over another.",
    examples: ["Setting your theme preference."]
  },
  "preparation": {
    tr: "hazırlık / tedarik",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌprepəˈreɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action or process of preparing.",
    examples: ["Thorough preparation prevents stress."]
  },
  "presentation": {
    tr: "sunum / takdim",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌpreznˈteɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The delivery of an address or topic.",
    examples: ["Giving an engaging presentation."]
  },
  "preservation": {
    tr: "koruma / muhafaza",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌprezəˈveɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action of preserving something.",
    examples: ["Preservation of privacy and user trust."]
  },
  "productivity": {
    tr: "üretkenlik / verimlilik",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌprɒdʌkˈtɪvəti/",
    source: "Oxford & Cambridge B2",
    desc: "The effectiveness of productive effort.",
    examples: ["Boosting daily writing productivity."]
  },
  "profession": {
    tr: "meslek / uzmanlık",
    pos: "noun",
    cefr: "B1",
    ipa: "/prəˈfeʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A paid occupation involving training.",
    examples: ["Dedication to the medical profession."]
  },
  "protection": {
    tr: "koruma / muhafaza",
    pos: "noun",
    cefr: "B1",
    ipa: "/prəˈtekʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The action of protecting, or state of being protected.",
    examples: ["AES-256 data protection."]
  },
  "psychology": {
    tr: "psikoloji / ruh bilimi",
    pos: "noun",
    cefr: "B2",
    ipa: "/saɪˈkɒlədʒi/",
    source: "Oxford & Cambridge B2",
    desc: "The scientific study of the human mind.",
    examples: ["The psychology of positive journaling."]
  },
  "publication": {
    tr: "yayın / neşriyat",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌpʌblɪˈkeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The preparation and issuing of written work.",
    examples: ["A peer-reviewed scientific publication."]
  },
  "qualification": {
    tr: "nitelik / vasıf / ehliyet",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌkwɒlɪfɪˈkeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A quality or accomplishment that makes one suitable.",
    examples: ["Professional engineering qualifications."]
  },
  "recommendation": {
    tr: "tavsiye / öneri",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌrekəmenˈdeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A suggestion or proposal as to the best course.",
    examples: ["Helpful book recommendations."]
  },
  "recognition": {
    tr: "tanınma / takdir / teşhis",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌrekəɡˈnɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Identification of someone/thing; appreciation.",
    examples: ["Deserved recognition for hard work."]
  },
  "relationship": {
    tr: "ilişki / münasebet",
    pos: "noun",
    cefr: "A2",
    ipa: "/rɪˈleɪʃnʃɪp/",
    source: "Oxford & Cambridge B2",
    desc: "The way in which two or more people are connected.",
    examples: ["Nurturing honest relationships."]
  },
  "reputation": {
    tr: "itibar / şöhret / unvan",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌrepjuˈteɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "The beliefs or opinions held about someone.",
    examples: ["Building an untarnished reputation."]
  },
  "requirement": {
    tr: "gereksinim / ihtiyaç / şart",
    pos: "noun",
    cefr: "B1",
    ipa: "/rɪˈkwaɪəmənt/",
    source: "Oxford & Cambridge B2",
    desc: "A thing that is needed or wanted.",
    examples: ["Fulfilling all user requirements."]
  },
  "satisfaction": {
    tr: "memnuniyet / tatmin",
    pos: "noun",
    cefr: "B1",
    ipa: "/ˌsætɪsˈfækʃn/",
    source: "Oxford & Cambridge B2",
    desc: "Fulfillment of one's wishes or expectations.",
    examples: ["High customer satisfaction."]
  },
  "significance": {
    tr: "önem / anlam / ehemmiyet",
    pos: "noun",
    cefr: "B2",
    ipa: "/sɪɡˈnɪfɪkəns/",
    source: "Oxford & Cambridge B2",
    desc: "The quality of being worthy of attention.",
    examples: ["Historical and cultural significance."]
  },
  "transformation": {
    tr: "dönüşüm / başkalaşım",
    pos: "noun",
    cefr: "B2",
    ipa: "/ˌtrænsfəˈmeɪʃn/",
    source: "Oxford & Cambridge B2",
    desc: "A thorough or dramatic change.",
    examples: ["Digital transformation of workflow."]
  },
  "understanding": {
    tr: "anlayış / kavrayış / mutabakat",
    pos: "noun",
    cefr: "A2",
    ipa: "/ˌʌndəˈstændɪŋ/",
    source: "Oxford & Cambridge B2",
    desc: "The ability to understand something; comprehension.",
    examples: ["Mutual understanding and empathy."]
  },
  "vulnerability": {
    tr: "savunmasızlık / zafiyet",
    pos: "noun",
    cefr: "C1",
    ipa: "/ˌvʌlnərəˈbɪləti/",
    source: "Oxford & Cambridge B2",
    desc: "The quality or state of being exposed.",
    examples: ["Zero vulnerabilities detected in build."]
  },

  hello: {
    tr: "merhaba / selam",
    pos: "interjection (ünlem)",
    cefr: "A1",
    ipa: "/həˈləʊ/",
    source: "Oxford Learner's Dictionary",
    desc: "Used as a greeting when meeting someone or answering the phone.",
    examples: ["Hello, how are you today? → Merhaba, bugün nasılsın?"]
  },
  abroad: {
    tr: "yurt dışı / yurt dışında",
    pos: "adverb (zarf)",
    cefr: "B1",
    ipa: "/əˈbrɔːd/",
    source: "Cambridge Academic Dictionary",
    desc: "In or to a foreign country or countries.",
    examples: ["She is currently studying abroad. → O şu anda yurt dışında okuyor."]
  },
  meeting: {
    tr: "toplantı / görüşme",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/ˈmiːtɪŋ/",
    source: "Oxford 3000",
    desc: "An occasion when people come together to discuss things.",
    examples: ["We have an urgent strategic meeting at 2 PM. → Saat 14:00'te acil bir strateji toplantımız var."]
  },
  agenda: {
    tr: "gündem / toplantı gündemi",
    pos: "noun (isim)",
    cefr: "B2",
    ipa: "/əˈdʒendə/",
    source: "Cambridge Business English",
    desc: "A list of items to be discussed at a formal meeting.",
    examples: ["Let's review today's meeting agenda. → Bugünkü toplantı gündemini inceleyelim."]
  },
  deadline: {
    tr: "teslim tarihi / son gün",
    pos: "noun (isim)",
    cefr: "B1",
    ipa: "/ˈdedlaɪn/",
    source: "Oxford Business English",
    desc: "A point in time by which something must be done.",
    examples: ["The project deadline is this Friday. → Projenin teslim tarihi bu cuma."]
  },
  task: {
    tr: "görev / vazife",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/tɑːsk/",
    source: "Oxford 3000",
    desc: "A piece of work that needs to be done, especially one that is difficult.",
    examples: ["Please complete the priority task first. → Lütfen önce öncelikli görevi tamamlayın."]
  },
  project: {
    tr: "proje / plan",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/ˈprɒdʒekt/",
    source: "Cambridge Dictionary",
    desc: "A planned piece of work that is designed to produce something new.",
    examples: ["Our new project launched successfully. → Yeni projemiz başarıyla başlatıldı."]
  },
  journal: {
    tr: "günlük / anı defteri / dergi",
    pos: "noun (isim)",
    cefr: "B1",
    ipa: "/ˈdʒɜːnl/",
    source: "Oxford Learner's Dictionary",
    desc: "A written record of the things you do, think, and feel each day.",
    examples: ["Writing in my journal relaxes my mind. → Günlüğüme yazmak zihnimi rahatlatıyor."]
  },
  work: {
    tr: "iş / çalışmak",
    pos: "noun / verb",
    cefr: "A1",
    ipa: "/wɜːk/",
    source: "Oxford 3000",
    desc: "An activity, such as a job, that a person uses physical or mental effort to do.",
    examples: ["Hard work always pays off. → Sıkı çalışma her zaman karşılığını verir."]
  },
  strategy: {
    tr: "strateji / eylem planı",
    pos: "noun (isim)",
    cefr: "B2",
    ipa: "/ˈstrætədʒi/",
    source: "Cambridge Academic",
    desc: "A detailed plan for achieving success in situations such as war, politics, or business.",
    examples: ["Our Q4 growth strategy is ambitious. → 4. çeyrek büyüme stratejimiz iddialı."]
  },
  note: {
    tr: "not / kısa kayıt",
    pos: "noun / verb",
    cefr: "A1",
    ipa: "/nəʊt/",
    source: "Oxford 3000",
    desc: "A short piece of writing to help you remember something.",
    examples: ["Take a quick note of this idea. → Bu fikri hızlıca not al."]
  },
  password: {
    tr: "parola / şifre",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/ˈpɑːswɜːd/",
    source: "Cambridge Dictionary",
    desc: "A secret word or combination of letters that allows access to a computer system.",
    examples: ["Keep your encryption password secure. → Şifreleme parolanızı güvende tutun."]
  },
  encrypt: {
    tr: "şifrelemek / kriptolamak",
    pos: "verb (fiil)",
    cefr: "C1",
    ipa: "/ɪnˈkrɪpt/",
    source: "Cambridge Advanced Learner's",
    desc: "To change information into a secret code so that only certain people can read it.",
    examples: ["This note is encrypted with AES-256. → Bu not AES-256 ile şifrelenmiştir."]
  },
  lock: {
    tr: "kilitlemek / kilit",
    pos: "verb / noun",
    cefr: "A2",
    ipa: "/lɒk/",
    source: "Oxford 3000",
    desc: "To secure or restrict access to something with a key or passcode.",
    examples: ["Lock your confidential notes. → Gizli notlarınızı kilitleyin."]
  },
  gratitude: {
    tr: "şükran / minnettarlık",
    pos: "noun (isim)",
    cefr: "C1",
    ipa: "/ˈɡrætɪtjuːd/",
    source: "Oxford Advanced",
    desc: "The feeling or quality of being grateful.",
    examples: ["Practicing daily gratitude improves wellbeing. → Günlük şükran pratiği esenliği artırır."]
  },
  calm: {
    tr: "sakin / dingin / huzurlu",
    pos: "adjective (sıfat)",
    cefr: "B1",
    ipa: "/kɑːm/",
    source: "Cambridge English",
    desc: "Peaceful, quiet, and without worry.",
    examples: ["Stay calm under pressure. → Baskı altında sakin kal."]
  },
  happy: {
    tr: "mutlu / sevinçli",
    pos: "adjective (sıfat)",
    cefr: "A1",
    ipa: "/ˈhæpi/",
    source: "Oxford 3000",
    desc: "Feeling, showing, or causing pleasure or satisfaction.",
    examples: ["I feel genuinely happy today. → Bugün gerçekten mutlu hissediyorum."]
  },
  business: {
    tr: "iş / ticaret / işletme",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/ˈbɪznəs/",
    source: "Oxford 3000",
    desc: "The activity of buying and selling goods and services.",
    examples: ["Let's talk business. → İş konuşalım."]
  },
  focus: {
    tr: "odak / odaklanmak",
    pos: "verb / noun",
    cefr: "B1",
    ipa: "/ˈfəʊkəs/",
    source: "Oxford 3000",
    desc: "To give your full attention to what you are doing.",
    examples: ["Deep focus produces great results. → Derin odaklanma harika sonuçlar üretir."]
  },
  reflection: {
    tr: "iç gözlem / tefekkür / yansıma",
    pos: "noun (isim)",
    cefr: "C1",
    ipa: "/rɪˈflekʃn/",
    source: "Cambridge Advanced",
    desc: "Careful, deep thought about something over a period of time.",
    examples: ["Night is the best time for self-reflection. → Gece, kendiyle baş başa kalıp düşünmek için en iyi zamandır."]
  },
  habit: {
    tr: "alışkanlık",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/ˈhæbɪt/",
    source: "Oxford 3000",
    desc: "Something that you do often and almost without thinking, especially something hard to stop.",
    examples: ["Writing daily is a powerful habit. → Her gün yazmak güçlü bir alışkanlıktır."]
  },
  goal: {
    tr: "hedef / amaç",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/ɡəʊl/",
    source: "Oxford 3000",
    desc: "An aim or purpose that you want to achieve.",
    examples: ["Set clear and achievable goals. → Net ve ulaşılabilir hedefler belirleyin."]
  },
  success: {
    tr: "başarı",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/səkˈses/",
    source: "Oxford 3000",
    desc: "The achieving of the results you wanted or hoped for.",
    examples: ["Success comes with perseverance. → Başarı azimle gelir."]
  },
  summary: {
    tr: "özet",
    pos: "noun (isim)",
    cefr: "B1",
    ipa: "/ˈsʌməri/",
    source: "Oxford 3000",
    desc: "A short clear description that gives the main facts or ideas about something.",
    examples: ["Here is a brief summary of the report. → İşte raporun kısa bir özeti."]
  },
  feedback: {
    tr: "geri bildirim / dönüt",
    pos: "noun (isim)",
    cefr: "B2",
    ipa: "/ˈfiːdbæk/",
    source: "Cambridge Business English",
    desc: "Information about something such as a new product or work performance.",
    examples: ["Constructive feedback helps us grow. → Yapıcı geri bildirim gelişmemize yardımcı olur."]
  },
  budget: {
    tr: "bütçe",
    pos: "noun (isim)",
    cefr: "B1",
    ipa: "/ˈbʌdʒɪt/",
    source: "Oxford 3000",
    desc: "A plan to show how much money a person or organization will earn and spend.",
    examples: ["We stayed within the quarterly budget. → Üç aylık bütçe dahilinde kaldık."]
  },
  priority: {
    tr: "öncelik",
    pos: "noun (isim)",
    cefr: "B2",
    ipa: "/praɪˈɒrəti/",
    source: "Oxford 3000",
    desc: "Something that is very important and must be dealt with before other things.",
    examples: ["Security is our top priority. → Güvenlik en yüksek önceliğimizdir."]
  },
  schedule: {
    tr: "zaman çizelgesi / program",
    pos: "noun / verb",
    cefr: "B1",
    ipa: "/ˈʃedjuːl/",
    source: "Oxford 3000",
    desc: "A list of planned activities or things to be done showing the times or dates.",
    examples: ["The schedule has been updated. → Program güncellendi."]
  },
  learning: {
    tr: "öğrenme / bilgi edinme",
    pos: "noun (isim)",
    cefr: "A2",
    ipa: "/ˈlɜːnɪŋ/",
    source: "Cambridge English",
    desc: "The activity of obtaining knowledge or skills.",
    examples: ["Continuous learning keeps your mind sharp. → Sürekli öğrenme zihni keskin tutar."]
  },
  coffee: {
    tr: "kahve",
    pos: "noun (isim)",
    cefr: "A1",
    ipa: "/ˈkɒfi/",
    source: "Oxford 3000",
    desc: "A dark, slightly bitter drink made from roasted coffee beans.",
    examples: ["A cup of morning coffee to kickstart the day. → Güne başlamak için bir fincan sabah kahvesi."]
  },
  book: {
    tr: "kitap",
    pos: "noun (isim)",
    cefr: "A1",
    ipa: "/bʊk/",
    source: "Oxford 3000",
    desc: "A written text that can be published in printed or electronic form.",
    examples: ["I read 20 pages of my book today. → Bugün kitabımdan 20 sayfa okudum."]
  },
  peaceful: {
    tr: "huzurlu / sakin",
    pos: "adjective (sıfat)",
    cefr: "B1",
    ipa: "/ˈpiːsfl/",
    source: "Cambridge English",
    desc: "Quiet and calm, without any worry or excitement.",
    examples: ["It was a peaceful walk in the woods. → Ormanda huzurlu bir yürüyüştü."]
  },
  trust: {
    tr: "güven / itimat",
    pos: "noun / verb",
    cefr: "B1",
    ipa: "/trʌst/",
    source: "Oxford 3000",
    desc: "To believe that someone is good and honest and will not harm you.",
    examples: ["Trust is the foundation of any great team. → Güven, her harika ekibin temelidir."]
  },
  discipline: {
    tr: "disiplin / özdenetim",
    pos: "noun (isim)",
    cefr: "B2",
    ipa: "/ˈdɪsəplɪn/",
    source: "Cambridge Academic",
    desc: "The ability to control your own behavior and make yourself work hard.",
    examples: ["Discipline beats motivation over the long run. → Uzun vadede disiplin motivasyonu geride bırakır."]
  },
  patience: {
    tr: "sabır",
    pos: "noun (isim)",
    cefr: "B2",
    ipa: "/ˈpeɪʃns/",
    source: "Oxford 3000",
    desc: "The ability to wait, or to continue doing something despite difficulties.",
    examples: ["Patience and persistence always triumph. → Sabır ve sebat her zaman galip gelir."]
  }
};

export const EN_WORD_SET = new Set([
  "international", "global", "domestic", "sustainable", "development", "perspective", "negotiation", "implementation", "comprehensive", "significant", "potential", "collaboration", "circumstance", "consequence", "environment", "opportunity", "responsible", "achievement", "challenge", "innovation", "efficiency", "commitment", "resilience", "awareness", "curiosity", "confidence", "clarity", "compassion", "pride", "peace", "freedom", "integrity", "capability", "adaptation", "assessment", "assumption", "attitude", "authority", "benefit", "campaign", "capacity", "category", "community", "concept", "conclusion", "condition", "connection", "contribution", "corporation", "creativity", "criterion", "criticism", "culture", "definition", "demonstration", "description", "difference", "difficulty", "direction", "discovery", "discussion", "distribution", "diversity", "document", "economy", "education", "emphasis", "employee", "employer", "engineering", "enterprise", "enthusiasm", "equality", "equipment", "essential", "establishment", "estimate", "evaluation", "evidence", "evolution", "exception", "executive", "expectation", "experience", "experiment", "explanation", "expression", "extension", "foundation", "frequency", "generation", "government", "guideline", "hierarchy", "hypothesis", "identification", "illustration", "importance", "improvement", "incident", "indication", "industry", "influence", "information", "initiative", "insight", "inspection", "institution", "instruction", "interaction", "investment", "invitation", "journalism", "judgment", "jurisdiction", "knowledge", "laboratory", "leadership", "legislation", "limitation", "maintenance", "management", "measurement", "mechanism", "membership", "motivation", "negotiate", "observation", "occupation", "operation", "organization", "participation", "partnership", "performance", "philosophy", "population", "possibility", "preference", "preparation", "presentation", "preservation", "productivity", "profession", "protection", "psychology", "publication", "qualification", "recommendation", "recognition", "relationship", "reputation", "requirement", "satisfaction", "significance", "transformation", "understanding", "vulnerability",
  "international", "global", "domestic", "sustainable", "development", "perspective", "negotiation", "implementation", "comprehensive", "significant", "potential", "collaboration", "circumstance", "consequence", "environment", "opportunity", "responsible", "achievement", "challenge", "innovation", "efficiency", "commitment", "resilience", "awareness", "curiosity", "confidence", "clarity", "compassion", "pride", "peace", "freedom", "integrity", "capability", "adaptation", "assessment", "assumption", "attitude", "authority", "benefit", "campaign", "capacity", "category", "community", "concept", "conclusion", "condition", "connection", "contribution", "corporation", "creativity", "criterion", "criticism", "culture", "definition", "demonstration", "description", "difference", "difficulty", "direction", "discovery", "discussion", "distribution", "diversity", "document", "economy", "education", "emphasis", "employee", "employer", "engineering", "enterprise", "enthusiasm", "equality", "equipment", "essential", "establishment", "estimate", "evaluation", "evidence", "evolution", "exception", "executive", "expectation", "experience", "experiment", "explanation", "expression", "extension", "foundation", "frequency", "generation", "government", "guideline", "hierarchy", "hypothesis", "identification", "illustration", "importance", "improvement", "incident", "indication", "industry", "influence", "information", "initiative", "insight", "inspection", "institution", "instruction", "interaction", "investment", "invitation", "journalism", "judgment", "jurisdiction", "knowledge", "laboratory", "leadership", "legislation", "limitation", "maintenance", "management", "measurement", "mechanism", "membership", "motivation", "negotiate", "observation", "occupation", "operation", "organization", "participation", "partnership", "performance", "philosophy", "population", "possibility", "preference", "preparation", "presentation", "preservation", "productivity", "profession", "protection", "psychology", "publication", "qualification", "recommendation", "recognition", "relationship", "reputation", "requirement", "satisfaction", "significance", "transformation", "understanding", "vulnerability",
  ...Object.keys(EN_TO_TR_LEXICON),
  ...Object.values(EN_TYPO_MAP),
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there",
  "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no",
  "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
  "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first",
  "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "great", "small", "large", "start",
  "finish", "develop", "plan", "team", "growth", "build", "strategy", "review", "agenda", "meeting", "abroad", "foreign", "travel",
  "document", "file", "folder", "security", "privacy", "secure", "lock", "unlocked", "pin", "code", "system", "daily", "journal",
  "reflection", "gratitude", "calm", "focus", "organized", "corporate", "professional", "minimal", "report", "analysis", "insight"
]);
