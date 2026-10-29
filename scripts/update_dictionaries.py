import sys
import os
import json

from compile_vocab import B2_EN_WORDS
from build_full_lexicons import MORE_TR_WORDS

EN_JS_PATH = "/home/yigitalpbuz/.gemini/antigravity/scratch/lexinote/src/data/dictionary_en.js"
TR_JS_PATH = "/home/yigitalpbuz/.gemini/antigravity/scratch/lexinote/src/data/dictionary_tr.js"

# 1. Update English Dictionary
with open(EN_JS_PATH, "r", encoding="utf-8") as f:
    en_content = f.read()

# Build additional entries for EN_TO_TR_LEXICON
en_entries_str = ""
for word, (tr, pos, cefr, ipa, desc, example) in B2_EN_WORDS.items():
    if f'"{word}":' not in en_content and f'{word}:' not in en_content:
        en_entries_str += f"""  "{word}": {{
    tr: "{tr}",
    pos: "{pos}",
    cefr: "{cefr}",
    ipa: "{ipa}",
    source: "Oxford & Cambridge B2",
    desc: "{desc}",
    examples: ["{example}"]
  }},\n"""

# Insert right after `export const EN_TO_TR_LEXICON = {`
en_marker = "export const EN_TO_TR_LEXICON = {"
if en_marker in en_content:
    en_content = en_content.replace(en_marker, en_marker + "\n" + en_entries_str)

# Also ensure all B2 words are in EN_WORD_SET
wordset_marker = "export const EN_WORD_SET = new Set(["
if wordset_marker in en_content:
    b2_words_set_str = ", ".join([f'"{w}"' for w in B2_EN_WORDS.keys()])
    en_content = en_content.replace(wordset_marker, wordset_marker + "\n  " + b2_words_set_str + ",")

with open(EN_JS_PATH, "w", encoding="utf-8") as f:
    f.write(en_content)

print(f"Updated {EN_JS_PATH} with {len(B2_EN_WORDS)} B2 Oxford/Cambridge words.")

# 2. Update Turkish Dictionary
with open(TR_JS_PATH, "r", encoding="utf-8") as f:
    tr_content = f.read()

tr_entries_str = ""
for word, data in MORE_TR_WORDS.items():
    if f'"{word}":' not in tr_content and f'{word}:' not in tr_content:
        examples_str = json.dumps(data["examples"], ensure_ascii=False)
        tr_entries_str += f"""  "{word}": {{
    en: "{data['en']}",
    pos: "{data['pos']}",
    tdk: "{data['tdk']}",
    source: "{data['source']}",
    examples: {examples_str}
  }},\n"""

tr_marker = "export const TR_TO_EN_LEXICON = {"
if tr_marker in tr_content:
    tr_content = tr_content.replace(tr_marker, tr_marker + "\n" + tr_entries_str)

# Add all Turkish words into TR_WORD_SET
tr_wordset_marker = "export const TR_WORD_SET = new Set(["
if tr_wordset_marker in tr_content:
    tr_words_set_str = ", ".join([f'"{w}"' for w in MORE_TR_WORDS.keys()])
    tr_content = tr_content.replace(tr_wordset_marker, tr_wordset_marker + "\n  " + tr_words_set_str + ",")

with open(TR_JS_PATH, "w", encoding="utf-8") as f:
    f.write(tr_content)

print(f"Updated {TR_JS_PATH} with {len(MORE_TR_WORDS)} TDK Turkish words.")
