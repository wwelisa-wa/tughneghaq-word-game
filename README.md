# Tughneghaq Word Game

An interactive word-guess puzzle game designed to support and preserve the lexical heritage of the **SLI Yupik (St. Lawrence Island / Siberian Yupik)**. 
Built using standard HTML5, CSS3, JavaScript and compiled into a standalone mobile app for Android using **Apache Cordova**.

---

## 🎮 About the Game
* **The Mission:** Guess the hidden Siberian Yupik words letter by letter.
* **Vocabulary:** Features a curated database of **~130 essential words** including animals, nature, family terms, traditional life. For the sources see below.
* **Features:** Audio feedback, a built-in light/dark theme switch styled.
* **Supported Alphabets:** 
  * `SLI`: Features the Latin-based alphabet variant used primarily on the St. Lawrence Island.
  * `CHP`: Features the Cyrillic-based alphabet variant used on Chukotka.


## 🛠️ Technical Stack & Architecture
* **Frontend:** Vanilla JavaScript (ES6+), semantic HTML5, and responsive CSS.
* **Mobile Compilation:** **Apache Cordova** (Targeting Android SDK 35 with a minimum requirement of Android 7.0 / SDK 24).
* **Data Layer:** Local `data.json` storage parsed on game initialization.

---

## 📚 Data Sources & Copyright Disclaimer

### ⚠️ Intellectual Property Notice
The lexical materials, word definitions, and linguistic representations used in this software belong entirely to their respective authors, compilers, and publishing houses. No copyright infringement is intended. 

The words and translations in this database were carefully compiled from the following authoritative educational and academic sources:
* **SLI/SY Eskimo Dictionary, Vol.1-2** — *Linda W. Badten et al, ANLC UAF 2008* — for **SLI** version.
* **Практикум по лексике ЭЯ** — *Н. Б. Вахтин, Н. М. Емельянова, Ленинград 1988* — for **CHP** version.

### 🤝 Project Nature & Volunteering
This application is non-commercial, open-source, and has been developed purely on a **voluntary basis** to contribute to endangered language revitalization efforts. 

-> 💡 **Developer's Note:** I am a 3d-year BA student, Institute of the Peoples of the North (Russia), a student of minority languages, and an independent developer. While this word game is a public hobby project, the primary development focus is dedicated to my main one, the **Siberian Yupik Suffix Dictionary**, which currently remains in private repo. I am working on the documentation and preservation of this amazing language, sadly critically endangered on the Russian side of the Bering Strait, since the first year of my education, and would love to collaborate on any basis if you are interested in it.
* 📧 You may contact me on `dev.wwelisa@gmail.com`

---

## 📲 How to Install & Play

### For Global Users
1. Go to the **Releases** tab of this repo.
2. Download the latest `.apk` file compiled.
3. Open the file on your device and follow the prompts to install (you may need to allow installation from unknown sources in your browser or file manager settings).

### For Users from Russia (things happen)
1. Go to the RuStore platform. The game is already published there :)
2. Search for `Тунгак` and follow the prompts to install.

## 🛠️ For Developers & Contributors

The repo is split into two versions: **SLI** (St. Lawrence Island, USA) and **CHP** (Chukotka, Russia). Architecturally, these versions are identical and run on the exact same core engine. The **only** differences between them are:
1. **The Dictionary:** Each folder has its own localized `.json` word list.
2. **The Virtual Keyboard:** Customized inside `.js` to support the respective Latin or Cyrillic characters used by each community.
3. **Orthography Nuances:** Standard keyboards (like the default Russian Cyrillic) lack specific characters needed for Siberian Yupik, such as uvular sounds and letters with modified tails/hooks. Therefore the built-in keyboard provides them. Currently the game engine counts every standalone typographic symbol as **one single letter/cell**. But, for example, in the SLI Latin orthography, digraphs/trigraphs like **gh**, **ng**, **ghhw**, or **ngngw** represent a single consonant sound... I initially considered building the virtual keyboard with complex multi-letter buttons (e.g., dedicated keys for **ng**, **gh**, etc.), however, for better gameplay intuition, I settled on a character-by-character approach. While a specialized digraph-based keyboard might be more educational for children learning native phonology, individual letter writing proved to be much more practical for the current cell-based thing.

### 🚷 Educational & Licensing Rules (Strict Requirements)

You are more than welcome to clone this repo, tweak the design, optimize the JS, or expand the vocabulary for your own local community needs! And, since this is a non-profit educational and language revitalization tool, any derivative work or forks **must** adhere to the following conditions:

* **Strictly Non-Commercial:** This project is, and must always remain, **100% free**. You are **NOT allowed to charge money**, sell, or monetize this app, its modifications, or its database in any form. Idk who would even want to do this, but just in case. 😭
* **Attribution Required:** If you reuse this code, build upon it, or host it elsewhere, you must **credit me** and provide a visible link back to this repo.

  *Игамсиӄаюкамкын, ўалынкыӄун! 💙*
