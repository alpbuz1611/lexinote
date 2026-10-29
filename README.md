# 📚 LexiNote — Local-First Intelligent Knowledge & Journaling System (v0.1.0)

[![Live Web App](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen.svg)](https://alpbuz1611.github.io/lexinote/)
[![Download Android APK](https://img.shields.io/badge/Download_APK-Android-success.svg?logo=android)](https://github.com/alpbuz1611/lexinote/actions)
[![Download Windows EXE](https://img.shields.io/badge/Download_EXE-Windows_11-blue.svg?logo=windows)](https://github.com/alpbuz1611/lexinote/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![FreeDict: GPLv2+](https://img.shields.io/badge/FreeDict-GPLv2%2B-orange.svg)](LICENSES.md)
[![ENABLE1: Public Domain](https://img.shields.io/badge/ENABLE1-Public_Domain-lightgrey.svg)](LICENSES.md)
[![Privacy: 100% Offline](https://img.shields.io/badge/Privacy-100%25_Local_&_Offline-success.svg)](https://github.com/alpbuz1611/lexinote)
[![Platforms: Linux | Windows 11 | macOS | Android](https://img.shields.io/badge/Platforms-Linux_|_Windows_11_|_macOS_|_Android-purple.svg)](https://github.com/alpbuz1611/lexinote)

🌐 **Live Web & PWA:** [https://alpbuz1611.github.io/lexinote/](https://alpbuz1611.github.io/lexinote/)  
*Read this document in Turkish: [🇹🇷 Türkçe Dokümantasyon için tıklayınız](README_TR.md)*

---

**LexiNote** is an open-source, privacy-first, zero-telemetry note-taking and personal knowledge management workstation. It uniquely brings together **rich document typography and formatting**, **bidirectional linked notes (Knowledge Graph & Wiki-Links)**, and **100% offline bilingual dictionary lookup and spellchecking engines** under one unified, responsive interface for desktop and mobile devices.

---

## 📑 Table of Contents

- [1. Core Highlights & Features](#1-core-highlights--features)
- [2. Note Architectures & Design Themes](#2-note-architectures--design-themes)
- [3. Deep Space Mind Map & Freeform Studio](#3-deep-space-mind-map--freeform-studio)
- [4. 100% Offline Dictionaries & Spellchecking](#4-100-offline-dictionaries--spellchecking)
- [5. Military-Grade AES-256 GCM Local Vault](#5-military-grade-aes-256-gcm-local-vault)
- [6. Technology Stack & Architecture](#6-technology-stack--architecture)
- [7. Quickstart & Installation](#7-quickstart--installation)
- [8. Windows 11 Desktop Installation (.exe & PWA)](#8-windows-11-desktop-installation-exe--pwa)
- [9. Mobile Installation (Android APK)](#9-mobile-installation-android-apk)
- [10. Release Verification Suite (37/37 Tests)](#10-release-verification-suite-3737-tests)
- [11. Legal Attributions & Licenses](#11-legal-attributions--licenses)

---

## 1. Core Highlights & Features

- **🌐 100% Bilingual Interface & Dynamic Language Switcher (i18n):**
  - Features an intuitive first-launch setup modal prompting the user to choose their preferred language (**English** or **Türkçe**).
  - One-click instant header toggle (`🇬🇧 EN / 🇹🇷 TR`) dynamically localizes menus, tooltips, keyboard shortcuts, and default starter notes.
- **🔒 Local-First & Zero-Telemetry Commitment:**
  - Operates completely offline with zero server pings, zero telemetry, and zero third-party cloud analytics.
  - Every keystroke, character, and encryption key remains strictly isolated on your local machine.
- **📝 Rich Typography & Document Formatting:**
  - Supports Markdown headings (H1, H2, H3), bold, italic, underline, strikethrough, blockquotes, interactive checklists, code blocks, and customizable font sizing.
- **🔗 Bidirectional Linked References (`[[Wiki-Links]]`):**
  - Create networked thoughts by typing `[[Note Title]]` anywhere in the editor.
  - Interactive backlinks drawer reveals all incoming and outgoing connections in real-time.
- **🖤 Sleek Dark Mode & High-Contrast Night Themes:**
  - Handcrafted dark palettes across all note modes, toolbars, and popups.
  - Jet-black selection bubbles with high-contrast white text for effortless reading in low light.
- **🔤 Embedded Offline Fonts:**
  - Packaged with local `.ttf` font binaries for **Noto Sans**, **Noto Serif**, and **DejaVu Mono**, plus web font fallbacks (**Lora**, **Inter**, **Fira Code**) for guaranteed offline rendering.

---

## 2. Note Architectures & Design Themes

LexiNote provides three dedicated note experiences tailored to distinct cognitive workflows:

| Mode | Visual Theme | Built-in Capabilities | Best For |
| :--- | :--- | :--- | :--- |
| **💼 Professional** | Slate Navy (`#243B53`) & Crisp Surface | Task checklists, priority badges (`Low`, `Medium`, `High`, `Urgent`), status tags | Sprint tracking, project plans, meeting minutes, architecture specs |
| **📖 Journal** | Warm Sepia (`#8C6D58`) & Cream Canvas | Mood tracker (😊, 🌿, 🎯, ⚡), weather picker, optional daily contemplation questions, gratitude lists | Evening reflections, personal development, mindfulness journaling |
| **📄 Plain Note** | Minimalist Blank Slate | Zero sidebars, zero widgets, zero distraction — pure distraction-free canvas | Focused creative writing, brain dumps, rapid drafts |

---

## 3. Deep Space Mind Map & Freeform Studio

An interactive, high-performance HTML5 Canvas physics engine running at a smooth 60 FPS:

```
[ Cambridge ] ──► [ Cambridge University ] ──► [ Raspberry Pi ] ──┬──► [ Affordable Computers ($25) ]
                                                                   └──► [ Coding for Kids & STEM ]
```

- **Two Distinct Visual Environments:**
  1. **Cosmic Void:** Dynamic deep-space starfield with 280+ twinkling stars, celestial nebulas, and shooting meteors.
  2. **Onyx Matrix:** Ultra-minimalist OLED pure black (`#050505`) with geometric dot-grids and glowing borders.
- **Hierarchical Node Tree & Branch Adder:**
  - One-click branch generation (`+ Add Branch`) automatically spaces child ideas with smooth bezier wire connections.
  - Two-click wire connection mode (`Connect Wire`) allows arbitrary node-to-node linking.
- **Luminous Color Palette:**
  - Instant visual styling with 6 vibrant neon hues: **Cyan**, **Rose**, **Amber**, **Emerald**, **Violet**, and **Slate**.
  - Dual-gradient pill styling with glowing halos and non-intrusive outer selection brackets.
- **Multi-Tab Workspaces:**
  - Separates structured example templates (`🎓 Cambridge`) from infinite personal mind map canvases (`💡 My Mindset`).

---

## 4. 100% Offline Dictionaries & Spellchecking

LexiNote embeds comprehensive lexical engines directly into the client bundle via efficient code-splitting:

| Lexical Database | Entries & Scale | License | Capabilities |
| :--- | :--- | :--- | :--- |
| **FreeDict (English ➔ Turkish)** | 34,405 Headwords, 68,000+ Senses | GPL-2.0-or-later | Polysemy grouping, CEFR levels, grammar POS tags |
| **FreeDict (Turkish ➔ English)** | 48,294 Reverse Terms | GPL-2.0-or-later | Instant reverse search & cross-linguistic lookup |
| **ENABLE1 (Scrabble/Norvig)** | 172,820 Verified Words | Public Domain | Zero false-positive English spellcheck (`aborad` ➔ `abroad`) |
| **TDK Core Turkish Lexicon** | 15,000+ Words | Open-Source Wordlist | Safe Turkish spellcheck (preserves words like `gurur`) |
| **Custom Vocabulary Vault** | Dynamic | User-Controlled | Star favorite terms and access your personal word vault |

### Double-Click Dictionary Bubble
Highlight any word in the editor to instantly bring up a sleek dark bubble displaying:
- IPA phonetic pronunciations (e.g., `/əˈbrɔːd/`).
- CEFR difficulty tiers (A1 through C2).
- Contextual notices for polysemous words (words with multiple distinct meanings).
- One-click definition copying and note-insertion buttons.

---

## 5. Military-Grade AES-256 GCM Local Vault

Protect sensitive thoughts and corporate credentials with hardware-accelerated Web Crypto APIs:

- **Key Derivation:** PBKDF2 with SHA-256 and **100,000 iterations** for brute-force resistance.
- **Cipher:** AES-GCM 256-bit with unique 96-bit initialization vectors (IV) and cryptographic salts per save.
- **Tamper-Evident:** Any modification to ciphertext or unauthorized PIN attempt immediately fails authentication without leaking plaintext.
- **Zero Cloud Exposure:** Plaintext never touches disk in decrypted state when locked.

---

## 6. Technology Stack & Architecture

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/) with native CSS variables and `@theme` tokens
- **Desktop Packaging:** [Electron](https://www.electronjs.org/) + [Electron Builder](https://www.electron.build/) (.exe Setup & Portable)
- **Canvas Rendering:** HTML5 Canvas 2D Context with custom parallax physics and mathematical Bezier routing
- **Cryptography:** Native browser Web Crypto Subsystem (`crypto.subtle`)
- **Iconography:** [Lucide Icons](https://lucide.dev/)
- **Mobile Packaging:** Progressive Web App (PWA) & [Capacitor](https://capacitorjs.com/) (Android APK)

---

## 7. Quickstart & Installation

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm or yarn

### Setup Commands

```bash
# 1. Clone the repository
git clone https://github.com/alpbuz1611/lexinote.git
cd lexinote

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in your browser
# Navigate to: http://localhost:5252
```

### Production Build

```bash
# Compile and bundle optimized client assets
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Windows 11 Desktop Installation (.exe & PWA)

LexiNote runs natively on Windows 11 as a standalone desktop application:

### Option A: Standalone Windows Installer (.exe)
Download the native Windows setup package directly:

[![Download Windows EXE](https://img.shields.io/badge/⬇️_Download-Windows_EXE_(Setup)-blue?style=for-the-badge&logo=windows)](https://github.com/alpbuz1611/lexinote/actions)

1. Click the **[Download Windows EXE](https://github.com/alpbuz1611/lexinote/actions)** button above (or visit GitHub Actions / Releases).
2. Download **`LexiNote-Windows-Setup-v0.1.0`** (includes both `.exe` installer and portable executable).
3. Run the installer — it creates Start Menu and Desktop shortcuts with custom high-res icons.
4. Enjoy complete zero-telemetry, offline knowledge management in its own dedicated window.

### Option B: Native Progressive Web App (Edge & Chrome)
1. Visit the live web app: **[https://alpbuz1611.github.io/lexinote/](https://alpbuz1611.github.io/lexinote/)** in Edge or Google Chrome.
2. In the right side of the address bar, click the **"Install LexiNote"** icon (or browser menu `...` -> `Apps` -> `Install this site as an app`).
3. LexiNote will be pinned to your Windows 11 Taskbar and Start Menu as a native application with offline persistence.

---

## 9. Mobile Installation (Android APK)

Install the standalone Android APK directly to your mobile device:

[![Download Android APK](https://img.shields.io/badge/⬇️_Download-Android_APK_(v0.1.0)-success?style=for-the-badge&logo=android)](https://github.com/alpbuz1611/lexinote/actions)

1. Click the **[Download Android APK](https://github.com/alpbuz1611/lexinote/actions)** button above (or visit the GitHub Actions / Releases tab).
2. Download the compiled **`lexinote-apk`** (`app-release-unsigned.apk` or signed package) to your Android device.
3. Tap the downloaded file to install and start using LexiNote completely offline on your smartphone or tablet!

---

## 10. Release Verification Suite (37/37 Tests)

LexiNote includes an end-to-end automated verification script covering all core engines:

```bash
node scripts/verify_e2e_release.js
```

### Test Suite Output
```text
================================================================
🚀 LEXINOTE v1.0.0 RELEASE READINESS VERIFICATION SUITE
================================================================

--- 1. FreeDict Dictionary Scope & Headwords ---
  ✅ [PASS] 34k+ English headwords verified (Actual: 34,405)
  ✅ [PASS] 48k+ Turkish reverse index verified (Actual: 48,294)
  ✅ [PASS] "abroad", "computer", "hospital", "mountain", "freedom", etc. verified

--- 2. Polysemy & TEI Sense Groups ---
  ✅ [PASS] "book" correctly categorized as polysemous (13 sense groups)
  ✅ [PASS] "work" correctly categorized as polysemous (33 sense groups)
  ✅ [PASS] "school" correctly categorized as polysemous (12 sense groups)
  ✅ [PASS] "accommodate" correctly categorized as polysemous (5 sense groups)

--- 3. Natural Sentence Syntactic Translation Engine ---
  ✅ [PASS] SVO to SOV rule resolution verified

--- 4. ENABLE1 Spellcheck & Correction ---
  ✅ [PASS] 'aborad' typo detected
  ✅ [PASS] getAutoCorrection('aborad') ➔ 'abroad' suggested
  ✅ [PASS] Correct words preserved with zero false-positives

--- 5. Security: PBKDF2 & AES-256 GCM Cryptography ---
  ✅ [PASS] Encrypted package generated without plaintext leakage
  ✅ [PASS] Correct PIN recovers content and checklist intact
  ✅ [PASS] Wrong PIN rejected via Auth Tag Mismatch

--- 6. Freeform Mindset Studio Hierarchy ---
  ✅ [PASS] Cambridge ➔ Cambridge University ➔ Raspberry Pi ➔ Affordable Computers ($25)

================================================================
📊 RESULT: 37 / 37 TESTS PASSED (100%)
================================================================
```

---

## 11. Legal Attributions & Licenses

- **Application Code:** [MIT License](LICENSE) © 2026 Yigit Alp Buz & LexiNote Contributors.
- **Dictionary Data:** FreeDict English-Turkish and Turkish-English datasets are licensed under the **GNU General Public License v2.0 or later (GPL-2.0-or-later)**. See [LICENSES.md](LICENSES.md) for full legal text and upstream source links.
- **Wordlist:** ENABLE1 English wordlist is in the **Public Domain**.
- **Icons:** [Lucide Icons](https://lucide.dev/) (ISC License).
- **Typography:** Google Noto Fonts (SIL Open Font License 1.1), DejaVu Fonts (Bitstream Vera License).
-**Communication** yigitalpbuz1@gmail.com
