import json

# Read base data from compile_vocab
from compile_vocab import B2_EN_WORDS
from generate_lexicons import TR_LEXICON_BASE

# Expanded Turkish words to include in TR_TO_EN_LEXICON
MORE_TR_WORDS = {
    "uluslararası": {
        "en": "international / global / multinational",
        "pos": "sıfat",
        "tdk": "Çeşitli milletler arasında yapılan veya milletlerin katıldığı; beynelmilel.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Uluslararası bir anlaşma imzalandı. → An international agreement was signed."]
    },
    "gurur": {
        "en": "pride / honor / dignity",
        "pos": "isim",
        "tdk": "Övünme, iftihar; kişinin kendi değeri ve başarısıyla duyduğu kıvanç.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Ailesine büyük bir gurur yaşattı. → He brought great pride to his family."]
    },
    "onur": {
        "en": "honor / self-respect / dignity",
        "pos": "isim",
        "tdk": "İnsanın kendine olan saygısı, özsaygı, haysiyet.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Onurlu bir yaşam sürdü. → He led an honorable life."]
    },
    "huzur": {
        "en": "peace / serenity / tranquility",
        "pos": "isim",
        "tdk": "Dirlik, rahatlık, sakinlik, kafa dinginliği.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Doğada derin bir huzur buldu. → He found deep peace in nature."]
    },
    "kıvanç": {
        "en": "joy / pride / gratification",
        "pos": "isim",
        "tdk": "Övünç, iftihar, sevinç.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Büyük bir kıvanç duyduk. → We felt great gratification."]
    },
    "erdem": {
        "en": "virtue / merit / excellence",
        "pos": "isim",
        "tdk": "Ahlakın övdüğü iyi olma, alçak gönüllülük, doğruluk gibi niteliklerin genel adı, fazilet.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Sabır en yüce erdemdir. → Patience is the highest virtue."]
    },
    "çaba": {
        "en": "effort / endeavor / struggle",
        "pos": "isim",
        "tdk": "Herhangi bir işi başarmak için harcanan güç, gayret.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Gösterdiği çaba takdire şayandı. → The effort he showed was admirable."]
    },
    "gayret": {
        "en": "endeavor / diligence / effort",
        "pos": "isim",
        "tdk": "Çalışma, çabalama, zorlu çalışma isteği.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Büyük bir gayretle projeyi tamamladı. → He completed the project with great diligence."]
    },
    "özveri": {
        "en": "self-sacrifice / devotion / dedication",
        "pos": "isim",
        "tdk": "Bir amaç uğruna veya bir başkası yararına kendi çıkarlarından vazgeçme, fedakarlık.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Ekibin özverisi başarıyı getirdi. → The team's devotion brought success."]
    },
    "tutku": {
        "en": "passion / fervor / enthusiasm",
        "pos": "isim",
        "tdk": "İrade ve yargıları aşan güçlü coşku, ihtiras.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Yazmak onun için bir tutkuydu. → Writing was a passion for him."]
    },
    "azim": {
        "en": "determination / perseverance / grit",
        "pos": "isim",
        "tdk": "Bir işteki engelleri yenme kararlılığı.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Azim ve inanç her engeli aşar. → Determination and belief overcome every obstacle."]
    },
    "sebat": {
        "en": "persistence / constancy / stamina",
        "pos": "isim",
        "tdk": "Sözünden veya kararlılığından dönmeme, bir işi sonuna kadar götürme.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Sebatla çalışmaya devam etti. → He continued to work with persistence."]
    },
    "samimiyet": {
        "en": "sincerity / warmth / candor",
        "pos": "isim",
        "tdk": "İçtenlik, candan olma durumu, içten davranış.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Sözlerindeki samimiyet kalpleri fethetti. → The sincerity in his words won hearts."]
    },
    "bağımsızlık": {
        "en": "independence / sovereignty / autonomy",
        "pos": "isim",
        "tdk": "Kendi başına hareket edebilme, istiklal.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Düşünce bağımsızlığı en kıymetli hazinedir. → Independence of thought is the most precious treasure."]
    },
    "özgürlük": {
        "en": "freedom / liberty",
        "pos": "isim",
        "tdk": "Herhangi bir kısıtlamaya veya zorlamaya bağlı olmaksızın davranabilme durumu, hürriyet.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Fikir özgürlüğü gelişimin temelidir. → Freedom of thought is the basis of progress."]
    },
    "adalet": {
        "en": "justice / fairness / equity",
        "pos": "isim",
        "tdk": "Hak ve hukuka uygunluk, hakkı gözetme, türe.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Adalet mülkün temelidir. → Justice is the foundation of the state."]
    },
    "hoşgörü": {
        "en": "tolerance / forbearance",
        "pos": "isim",
        "tdk": "Kendisininkine uymayan her durumu anlayışla karşılama, tolerans, müsamaha.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Farklı fikirlere hoşgörü gösterdi. → He showed tolerance to different opinions."]
    },
    "alçakgönüllülük": {
        "en": "humility / modesty",
        "pos": "isim",
        "tdk": "Kendi değerini olduğundan aşağı gösteren, büyüklenmeyen, tevazu.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Büyük başarılara rağmen alçakgönüllülüğünü korudu. → Despite great successes, he maintained his humility."]
    },
    "özen": {
        "en": "care / diligence / attention",
        "pos": "isim",
        "tdk": "Bir işin iyi, eksiksiz olması için gösterilen dikkat ve titizlik, ihtimam.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Yazılarını büyük bir özenle yazardı. → He wrote his essays with great care."]
    },
    "titizlik": {
        "en": "meticulousness / precision / thoroughness",
        "pos": "isim",
        "tdk": "Gereğinden çok dikkatli ve özenli olma hali.",
        "source": "TDK Güncel Türkçe Sözlük",
        "examples": ["Araştırmadaki titizlik takdir edildi. → The meticulousness in the research was appreciated."]
    }
}

print(f"More TR words count: {len(MORE_TR_WORDS)}")
