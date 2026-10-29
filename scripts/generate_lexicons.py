import json
import os

# Create comprehensive Oxford/Cambridge B2 Lexicon
# Covering core academic, business, daily, psychology, tech, culture, and communication vocabulary

EN_LEXICON_BASE = {
    # The word requested by the user:
    "international": {
        "tr": "uluslararası / beynelmilel",
        "pos": "adjective (sıfat)",
        "cefr": "B1",
        "ipa": "/ˌɪntəˈnæʃnəl/",
        "source": "Oxford Learner's Dictionary",
        "desc": "Involving more than one country or between different nations.",
        "examples": ["The company is expanding into the international market. → Şirket uluslararası pazara açılıyor."]
    },
    "global": {
        "tr": "küresel / dünya çapında",
        "pos": "adjective (sıfat)",
        "cefr": "B1",
        "ipa": "/ˈɡləʊbl/",
        "source": "Oxford 3000",
        "desc": "Covering or affecting the whole world.",
        "examples": ["Global collaboration creates impactful results. → Küresel iş birliği etkili sonuçlar yaratır."]
    },
    "domestic": {
        "tr": "yurt içi / yerel / evcil",
        "pos": "adjective (sıfat)",
        "cefr": "B2",
        "ipa": "/dəˈmestɪk/",
        "source": "Oxford 3000",
        "desc": "Relating to a person's own country; not foreign or international.",
        "examples": ["Domestic flights were delayed. → Yurt içi uçuşlar gecikti."]
    },
    "pride": {
        "tr": "gurur / kıvanç / iftihar",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/praɪd/",
        "source": "Oxford Learner's Dictionary",
        "desc": "A feeling of deep pleasure or satisfaction derived from one's own achievements.",
        "examples": ["Take pride in your honest work. → Dürüst çalışmanızdan gurur duyun."]
    },
    "peace": {
        "tr": "huzur / barış / sükunet",
        "pos": "noun (isim)",
        "cefr": "A2",
        "ipa": "/piːs/",
        "source": "Oxford 3000",
        "desc": "Freedom from disturbance; tranquility.",
        "examples": ["Finding inner peace amidst a busy schedule. → Yoğun bir programın ortasında iç huzuru bulmak."]
    },
    "sustainable": {
        "tr": "sürdürülebilir",
        "pos": "adjective (sıfat)",
        "cefr": "B2",
        "ipa": "/səˈsteɪnəbl/",
        "source": "Cambridge Academic",
        "desc": "Able to be maintained at a certain rate or level without exhausting natural resources.",
        "examples": ["Sustainable development is vital for the future. → Sürdürülebilir kalkınma gelecek için hayatidir."]
    },
    "development": {
        "tr": "gelişme / kalkınma / ilerleme",
        "pos": "noun (isim)",
        "cefr": "B1",
        "ipa": "/dɪˈveləpmənt/",
        "source": "Oxford 3000",
        "desc": "The process of developing or being developed.",
        "examples": ["Personal development requires consistent effort. → Kişisel gelişim tutarlı bir çaba gerektirir."]
    },
    "perspective": {
        "tr": "bakış açısı / perspektif",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/pəˈspektɪv/",
        "source": "Cambridge Academic",
        "desc": "A particular attitude toward or way of regarding something; a point of view.",
        "examples": ["Reading expands your perspective. → Okumak bakış açınızı genişletir."]
    },
    "negotiation": {
        "tr": "müzakere / görüşme / pazarlık",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/nɪˌɡəʊʃiˈeɪʃn/",
        "source": "Oxford Business English",
        "desc": "Discussion aimed at reaching an agreement.",
        "examples": ["The contract negotiation took several weeks. → Sözleşme müzakeresi birkaç hafta sürdü."]
    },
    "implementation": {
        "tr": "uygulama / hayata geçirme",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/ˌɪmplɪmenˈteɪʃn/",
        "source": "Oxford 3000",
        "desc": "The process of putting a decision or plan into effect; execution.",
        "examples": ["Effective implementation is key to success. → Etkili uygulama başarının anahtarıdır."]
    },
    "comprehensive": {
        "tr": "kapsamlı / etraflı",
        "pos": "adjective (sıfat)",
        "cefr": "B2",
        "ipa": "/ˌkɒmprɪˈhensɪv/",
        "source": "Cambridge Advanced",
        "desc": "Complete and including everything that is necessary.",
        "examples": ["A comprehensive review of the project. → Projenin kapsamlı bir incelemesi."]
    },
    "significant": {
        "tr": "önemli / kayda değer / anlamlı",
        "pos": "adjective (sıfat)",
        "cefr": "B2",
        "ipa": "/sɪɡˈnɪfɪkənt/",
        "source": "Oxford 3000",
        "desc": "Sufficiently great or important to be worthy of attention; noteworthy.",
        "examples": ["A significant increase in productivity. → Üretkenlikte kayda değer bir artış."]
    },
    "potential": {
        "tr": "potansiyel / olası / gizilgüç",
        "pos": "adjective / noun",
        "cefr": "B1",
        "ipa": "/pəˈtenʃl/",
        "source": "Oxford 3000",
        "desc": "Having or showing the capacity to develop into something in the future.",
        "examples": ["Unlock your full potential. → Tam potansiyelinizi açığa çıkarın."]
    },
    "collaboration": {
        "tr": "iş birliği / ortak çalışma",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/kəˌlæbəˈreɪʃn/",
        "source": "Cambridge Business",
        "desc": "The action of working with someone to produce something.",
        "examples": ["Team collaboration sparks great ideas. → Ekip iş birliği harika fikirler kıvılcımlar."]
    },
    "circumstance": {
        "tr": "koşul / durum / hal",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/ˈsɜːkəmstəns/",
        "source": "Oxford 3000",
        "desc": "A fact or condition connected with or relevant to an event or action.",
        "examples": ["Under difficult circumstances. → Zor koşullar altında."]
    },
    "consequence": {
        "tr": "sonuç / netice / vahamet",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/ˈkɒnsɪkwəns/",
        "source": "Oxford 3000",
        "desc": "A result or effect, typically one that is unwelcome or unpleasant.",
        "examples": ["Every decision carries a consequence. → Her karar bir sonuç taşır."]
    },
    "environment": {
        "tr": "çevre / ortam",
        "pos": "noun (isim)",
        "cefr": "B1",
        "ipa": "/ɪnˈvaɪrənmənt/",
        "source": "Oxford 3000",
        "desc": "The surroundings or conditions in which a person, animal, or plant lives or operates.",
        "examples": ["A healthy work environment boosts creativity. → Sağlıklı bir çalışma ortamı yaratıcılığı artırır."]
    },
    "opportunity": {
        "tr": "fırsat / imkan",
        "pos": "noun (isim)",
        "cefr": "B1",
        "ipa": "/ˌɒpəˈtjuːnəti/",
        "source": "Oxford 3000",
        "desc": "A time or set of circumstances that makes it possible to do something.",
        "examples": ["Seize the opportunity to learn. → Öğrenme fırsatını yakalayın."]
    },
    "responsible": {
        "tr": "sorumlu / mesul",
        "pos": "adjective (sıfat)",
        "cefr": "B1",
        "ipa": "/rɪˈspɒnsəbl/",
        "source": "Oxford 3000",
        "desc": "Having an obligation to do something, or having control over or care for someone.",
        "examples": ["Be responsible for your own happiness. → Kendi mutluluğunuzdan sorumlu olun."]
    },
    "achievement": {
        "tr": "başarı / kazanım",
        "pos": "noun (isim)",
        "cefr": "B1",
        "ipa": "/əˈtʃiːvmənt/",
        "source": "Oxford 3000",
        "desc": "A thing done successfully with effort, skill, or courage.",
        "examples": ["Celebrate every small achievement. → Her küçük başarıyı kutlayın."]
    },
    "challenge": {
        "tr": "zorluk / meydan okuma",
        "pos": "noun / verb",
        "cefr": "B1",
        "ipa": "/ˈtʃælɪndʒ/",
        "source": "Oxford 3000",
        "desc": "A call to take part in a contest or competition, or a task that tests someone's abilities.",
        "examples": ["Embrace the challenge with confidence. → Zorluğu özgüvenle karşılayın."]
    },
    "innovation": {
        "tr": "yenilik / inovasyon",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/ˌɪnəˈveɪʃn/",
        "source": "Cambridge Academic",
        "desc": "A new method, idea, product, etc.",
        "examples": ["Innovation drives economic growth. → İnovasyon ekonomik büyümeyi yönlendirir."]
    },
    "efficiency": {
        "tr": "verimlilik / etkinlik",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/ɪˈfɪʃnsi/",
        "source": "Oxford 3000",
        "desc": "The state or quality of being efficient; achieving maximum productivity.",
        "examples": ["Improving workflow efficiency saves time. → İş akışı verimliliğini artırmak zaman kazandırır."]
    },
    "commitment": {
        "tr": "bağlılık / taahhüt / azim",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/kəˈmɪtmənt/",
        "source": "Oxford 3000",
        "desc": "The state or quality of being dedicated to a cause, activity, etc.",
        "examples": ["Success requires unwavering commitment. → Başarı sarsılmaz bir bağlılık gerektirir."]
    },
    "resilience": {
        "tr": "dayanıklılık / psikolojik sağlamlık",
        "pos": "noun (isim)",
        "cefr": "C1",
        "ipa": "/rɪˈzɪliəns/",
        "source": "Oxford Advanced",
        "desc": "The capacity to withstand or to recover quickly from difficulties; toughness.",
        "examples": ["Building resilience helps you overcome setbacks. → Dayanıklılık geliştirmek aksilikleri aşmanıza yardımcı olur."]
    },
    "awareness": {
        "tr": "farkındalık / bilinç",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/əˈweənəs/",
        "source": "Oxford 3000",
        "desc": "Knowledge or perception of a situation or fact.",
        "examples": ["Self-awareness is the foundation of emotional intelligence. → Öz farkındalık duygusal zekanın temelidir."]
    },
    "curiosity": {
        "tr": "merak",
        "pos": "noun (isim)",
        "cefr": "B1",
        "ipa": "/ˌkjʊəriˈɒsəti/",
        "source": "Oxford 3000",
        "desc": "A strong desire to know or learn something.",
        "examples": ["Stay hungry, stay foolish, keep your curiosity alive. → Merakınızı daima canlı tutun."]
    },
    "confidence": {
        "tr": "özgüven / güven",
        "pos": "noun (isim)",
        "cefr": "B1",
        "ipa": "/ˈkɒnfɪdəns/",
        "source": "Oxford 3000",
        "desc": "A feeling of self-assurance arising from one's appreciation of one's own abilities.",
        "examples": ["Confidence grows with continuous preparation. → Özgüven sürekli hazırlıkla büyür."]
    },
    "clarity": {
        "tr": "berraklık / açıklık / netlik",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/ˈklærəti/",
        "source": "Oxford 3000",
        "desc": "The quality of being clear and easy to understand or see.",
        "examples": ["Mental clarity leads to better decisions. → Zihinsel berraklık daha iyi kararlara yol açar."]
    },
    "compassion": {
        "tr": "şefkat / merhamet",
        "pos": "noun (isim)",
        "cefr": "B2",
        "ipa": "/kəmˈpæʃn/",
        "source": "Cambridge English",
        "desc": "Sympathetic pity and concern for the sufferings or misfortunes of others.",
        "examples": ["Practice compassion towards yourself and others. → Kendinize ve başkalarına karşı şefkat gösterin."]
    }
}

# Extensive Turkish TDK Vocabulary including words user specifically needed
TR_LEXICON_BASE = {
    "gurur": {
        "en": "pride / dignity / honor",
        "pos": "isim",
        "tdk": "Övünme, iftihar; kişinin kendi değeri ve başarısıyla duyduğu kıvanç; kibir.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Başarılarınızla gurur duyuyoruz. → We take pride in your achievements."]
    },
    "onur": {
        "en": "honor / dignity / self-respect",
        "pos": "isim",
        "tdk": "İnsanın kendine olan saygısı, özsaygı, haysiyet, izzetinefis.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Onurlu bir duruş sergiledi. → He showed an honorable stance."]
    },
    "huzur": {
        "en": "peace / serenity / tranquility",
        "pos": "isim",
        "tdk": "Dirlik, rahatlık, sakinlik, kafa dinginliği.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Sessiz bir odada iç huzurunu buldu. → He found inner peace in a quiet room."]
    },
    "uluslararası": {
        "en": "international / global / multinational",
        "pos": "sıfat",
        "tdk": "Çeşitli milletler arasında yapılan veya milletlerin katıldığı; beynelmilel.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Uluslararası bir konferans düzenlendi. → An international conference was organized."]
    },
    "küresel": {
        "en": "global / worldwide",
        "pos": "sıfat",
        "tdk": "Dünya ölçüsünde genişleyen, cihanşümul.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Küresel ölçekte yenilikçi çözümler. → Innovative solutions on a global scale."]
    },
    "sürdürülebilir": {
        "en": "sustainable",
        "pos": "sıfat",
        "tdk": "Devam ettirilebilir, geleceğe aktarılabilir.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Sürdürülebilir bir iş modeli kurmalıyız. → We must build a sustainable business model."]
    },
    "özgüven": {
        "en": "self-confidence / confidence",
        "pos": "isim",
        "tdk": "İnsanın kendi yeteneklerine ve gücüne inanması durumu.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Özgüven çalışarak ve deneyimle kazanılır. → Self-confidence is built through work and experience."]
    },
    "farkındalık": {
        "en": "awareness / mindfulness",
        "pos": "isim",
        "tdk": "Olayların, durumların veya duyguların bilincinde olma hali.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Anın farkındalığıyla yaşamak. → Living with mindfulness of the present moment."]
    },
    "verimlilik": {
        "en": "productivity / efficiency",
        "pos": "isim",
        "tdk": "Verimli olma durumu, randıman, prodüktivite.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Ekip verimliliği bu ay zirve yaptı. → Team productivity peaked this month."]
    },
    "iş birliği": {
        "en": "collaboration / cooperation / partnership",
        "pos": "isim",
        "tdk": "Amaç ve çıkarları bir olanların yaptıkları ortak çalışma, mesai birliği.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Güçlü bir iş birliğiyle projeyi tamamladık. → We finished the project with strong collaboration."]
    },
    "bağlılık": {
        "en": "commitment / loyalty / dedication",
        "pos": "isim",
        "tdk": "Birine, bir şeye karşı duyulan ve eylemle gösterilen vefa, sadakat, taahhüt.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Göreve olan bağlılığı takdir topladı. → His commitment to the duty was appreciated."]
    },
    "dayanıklılık": {
        "en": "resilience / endurance / durability",
        "pos": "isim",
        "tdk": "Zorluklara, baskılara karşı direnç gösterebilme gücü.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Zor zamanlarda gösterdiği dayanıklılık ilham vericiydi. → His resilience in tough times was inspiring."]
    },
    "merak": {
        "en": "curiosity / interest",
        "pos": "isim",
        "tdk": "Bir şeyi anlamak, öğrenmek veya görmek için duyulan şiddetli arzu.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Merak bilimin ve öğrenmenin anasıdır. → Curiosity is the mother of science and learning."]
    },
    "şefkat": {
        "en": "compassion / tenderness / affection",
        "pos": "isim",
        "tdk": "Sevecen, karşılıksız ve derin sevgi, esirgeme hissi.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Zor günlerde kendinize şefkat gösterin. → Show compassion to yourself in tough days."]
    }
}

print(f"Base EN entries: {len(EN_LEXICON_BASE)}")
print(f"Base TR entries: {len(TR_LEXICON_BASE)}")
