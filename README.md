# ExplainIt - AI Chrome Extension 🧠✨

![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge&logo=vite)
![Chrome Extension](https://img.shields.io/badge/Manifest_V3-Chrome-green?style=for-the-badge&logo=googlechrome)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge&logo=tailwindcss)

## 🎥 Demo Preview

<p align="center">
  <img src="ExplainIt.gif" alt="ExplainIt Extension Demo" width="800">
</p>

**ExplainIt** is a powerful, local-first browser extension that uses top-tier AI models (OpenAI, Anthropic Claude, Google Gemini) to instantly explain any text you highlight on a web page. It uses a Bring-Your-Own-Key (BYOK) architecture, ensuring your data remains private and you never pay for unnecessary subscriptions.

## 🌟 Key Features

- 🔍 **Instant Explanations:** Highlight any word or phrase on a website, click the floating magnifying glass, and get an immediate AI-generated explanation right on the page (in a beautiful, isolated Tooltip).
- 🔑 **Bring Your Own Key (BYOK):** Full support for standard API keys from OpenAI, Anthropic, and Google AI Studio. 
- 🌐 **Proxy Manager Support:** Works flawlessly with local AI proxies and managers (like Antigravity Manager, OpenRouter) via Custom Base URL configurations.
- 🗣️ **Text-to-Speech:** Click the speaker icon to hear the highlighted text pronounced aloud.
- ⚡ **Quick Actions:** Dive deeper with one-click buttons to get **Synonyms** or **Real-world Examples** of the explained term.
- 💾 **Flashcards & Anki Export:** Save your favorite explanations to the "Bookmarks" tab and export them as a CSV file perfectly formatted for Anki interval training.
- 🌍 **Multi-language Support:** Choose your preferred output language (English, Russian, Spanish, Japanese, etc.) directly in the settings.
- 🛠️ **Custom System Prompts:** Take full control by writing your own behavior rules for the AI (e.g., "Explain this to me as if I am a 5-year-old").

## 🚀 Installation (Developer Mode)

Since this extension requires your own API keys, it is designed to be installed locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/explainit.git
   cd explainit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Load into Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** in the top right corner.
   - Click **Load unpacked** and select the `dist` folder generated inside the project directory.

## ⚙️ Configuration

1. Pin the extension to your Chrome toolbar.
2. Open the extension and navigate to the **Settings** (⚙️) tab.
3. Select your preferred **AI Provider** (OpenAI, Anthropic, or Google).
4. Enter your **API Key** (stored securely in your local browser storage).
5. *(Optional)* Enter a **Custom Base URL** if you are using an API Gateway like Antigravity Manager.
6. Select your **Model** and **Output Language**.

## 🏗️ Technical Architecture

- **Manifest V3:** Adheres to the latest Chrome Extension security standards.
- **Shadow DOM:** The floating button and tooltip are injected using Shadow DOM to prevent CSS conflicts with host websites.
- **Service Workers:** Background tasks are handled efficiently via `background.ts`.
- **Framer Motion:** Smooth UI transitions and animations within the popup.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.