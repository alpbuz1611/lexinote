#!/usr/bin/env python3
"""
FreeDict English-Turkish (eng-tur) TEI to JSON Parser
License of Source Data: GNU General Public License v2.0 or later (GPL-2.0-or-later)
FreeDict Edition: 0.3 (36,589 headwords)
Source: FreeDict (https://freedict.org/) & Michael Bunk / Sebastian Humenda
"""

import xml.etree.ElementTree as ET
import json
import re
import os
import sys

TEI_PATH = os.path.join(os.path.dirname(__file__), "../src/data/freedict/eng-tur.tei")
OUT_EN_TR = os.path.join(os.path.dirname(__file__), "../src/data/freedict/freedict_eng_tur.json")
OUT_TR_EN = os.path.join(os.path.dirname(__file__), "../src/data/freedict/freedict_tur_eng.json")
OUT_META = os.path.join(os.path.dirname(__file__), "../src/data/freedict/freedict_metadata.json")

def clean_text(text):
    if not text:
        return ""
    return " ".join(text.split()).strip()

def parse_tei():
    print(f"Reading TEI file: {TEI_PATH}")
    if not os.path.exists(TEI_PATH):
        print(f"Error: TEI file not found at {TEI_PATH}")
        sys.exit(1)

    tree = ET.parse(TEI_PATH)
    root = tree.getroot()
    ns = {"tei": "http://www.tei-c.org/ns/1.0"}

    # Extract metadata
    title_elem = root.find(".//tei:titleStmt/tei:title", ns)
    edition_elem = root.find(".//tei:editionStmt/tei:edition", ns)
    date_elem = root.find(".//tei:publicationStmt/tei:date", ns)
    extent_elem = root.find(".//tei:extent", ns)

    meta = {
        "title": title_elem.text.strip() if title_elem is not None else "English-Turkish FreeDict Dictionary",
        "edition": edition_elem.text.strip() if edition_elem is not None else "0.3",
        "date": date_elem.attrib.get("when", "2017-12-03") if date_elem is not None else "2017-12-03",
        "declaredExtent": extent_elem.text.strip() if extent_elem is not None else "36589 headwords",
        "license": "GNU General Public License v2.0 or later (GPL-2.0-or-later)",
        "sourceUrl": "https://freedict.org/downloads/",
        "projectUrl": "http://freedict.org/",
        "author": "FreeDict Project (Michael Bunk, Sebastian Humenda, Piotr Bański et al.)",
    }

    entries = root.findall(".//tei:entry", ns)
    print(f"Found {len(entries)} <entry> elements in TEI XML.")

    # Group entries by lowercase headword
    words_map = {}
    for entry in entries:
        orth_elem = entry.find(".//tei:orth", ns)
        if orth_elem is None or not orth_elem.text:
            continue
        headword = clean_text(orth_elem.text).lower()

        # Extract quotes inside senses
        entry_senses = []
        for sense in entry.findall(".//tei:sense", ns):
            s_quotes = [clean_text(q.text) for q in sense.findall(".//tei:cit/tei:quote", ns) if q.text]
            if not s_quotes:
                s_quotes = [clean_text(q.text) for q in sense.findall(".//tei:quote", ns) if q.text]
            clean_s_quotes = []
            for sq in s_quotes:
                if sq and sq not in clean_s_quotes:
                    clean_s_quotes.append(sq)
            if clean_s_quotes:
                entry_senses.append(clean_s_quotes)

        if not entry_senses:
            continue

        if headword not in words_map:
            words_map[headword] = []
        words_map[headword].append(entry_senses)

    print(f"Unique headwords found: {len(words_map)}")

    # Sort multiple entries per word (prioritize base nouns/verbs, push affixes to end)
    en_tr_dict = {}
    for headword, blocks in words_map.items():
        if len(blocks) > 1:
            def block_score(block):
                first = block[0][0] if (block and block[0]) else ""
                is_affix = 1 if (first.startswith("(sonek)") or first.startswith("(önek)")) else 0
                is_paren = 1 if first.startswith("(") else 0
                return (is_affix, is_paren, len(first))

            blocks.sort(key=block_score)

        # Merge senses preserving structure and boundaries
        all_senses = []
        for b in blocks:
            for s in b:
                if s not in all_senses:
                    all_senses.append(s)

        en_tr_dict[headword] = all_senses

    # Build reverse index (TR -> EN) for Turkish lookups
    tr_en_dict = {}
    for en_word, senses_list in en_tr_dict.items():
        for sense in senses_list:
            for item in sense:
                # Clean and split into parts
                parts = re.split(r"[,;•\n]+", item)
                for part in parts:
                    clean = re.sub(r"\(.*?\)", "", part).strip().lower()
                    clean = clean.strip(".?!- ")
                    words = clean.split()
                    if 1 <= len(words) <= 2 and not re.search(r"[0-9:/]", clean) and len(clean) >= 2:
                        if clean not in tr_en_dict:
                            tr_en_dict[clean] = []
                        if en_word not in tr_en_dict[clean]:
                            tr_en_dict[clean].append(en_word)

    meta["uniqueHeadwords"] = len(en_tr_dict)
    meta["reverseIndexWords"] = len(tr_en_dict)

    os.makedirs(os.path.dirname(OUT_EN_TR), exist_ok=True)

    print(f"Saving structured EN->TR dictionary to {OUT_EN_TR}...")
    with open(OUT_EN_TR, "w", encoding="utf-8") as f:
        json.dump(en_tr_dict, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Saving TR->EN dictionary to {OUT_TR_EN}...")
    with open(OUT_TR_EN, "w", encoding="utf-8") as f:
        json.dump(tr_en_dict, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Saving metadata to {OUT_META}...")
    with open(OUT_META, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    en_size_mb = os.path.getsize(OUT_EN_TR) / (1024 * 1024)
    tr_size_mb = os.path.getsize(OUT_TR_EN) / (1024 * 1024)
    print(f"Done! EN->TR size: {en_size_mb:.2f} MB ({len(en_tr_dict)} words)")
    print(f"Done! TR->EN size: {tr_size_mb:.2f} MB ({len(tr_en_dict)} words)")

if __name__ == "__main__":
    parse_tei()
