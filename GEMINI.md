# ExplainIt — AI-Powered Chrome Extension

ExplainIt is a smart text explanation extension that provides definitions and context using AI. It features a React-based frontend, a secure Node.js proxy for API calls, and deep integration with Chrome via Manifest V3.

## Project Overview

- **Purpose:** Provide instant, AI-powered explanations for selected text on any webpage.
- **Core Technologies:**
  - **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
  - **Extension:** Manifest V3, `@crxjs/vite-plugin`.
  - **Backend Proxy:** Node.js (Express), Axios, OpenAI API (GPT-4o-mini).
  - **Authentication:** Google OAuth2 (`chrome.identity`).

## Architecture

- **`src/background/`**: Service worker (`background.ts`) managing OAuth2, message routing, and communication with the backend proxy.
- **`src/content/`**: Content script (`content.ts`) that monitors text selection and displays a floating action button.
- **`src/popup/`**: The main extension UI triggered by the toolbar icon.
- **`src/sidepanel/`**: A persistent sidebar for more detailed interaction and history.
- **`src/components/`**: Reusable UI components (AnswerCard, Header, Layout, TextInput).
- **`src/utils/`**: Utility classes for API communication (`api.ts`) and Chrome storage management (`storage.ts`).
- **`gpt-proxy/`**: A separate Node.js server to securely handle OpenAI API keys and proxy requests from the extension.

## Building and Running

### Frontend (Extension)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
   The build output will be in the `dist` directory.

### Backend Proxy
1. Navigate to the proxy directory:
   ```bash
   cd gpt-proxy
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   OPENAI_API_KEY=your_openai_api_key
   PORT=3000
   MODEL=gpt-4o-mini
   DEBUG=true
   ```
4. Start the server:
   ```bash
   node server.cjs
   ```

## Development Conventions

- **Component Structure:** Components are located in `src/components` and use functional React with TypeScript.
- **State Management:** Uses React hooks and Chrome's `storage.local`/`storage.session` via `StorageManager`.
- **Styling:** Tailwind CSS is used for all UI components. Inject styles into content scripts via `chrome.runtime.getURL`.
- **Communication:** Content scripts and popups communicate with the background script using `chrome.runtime.sendMessage`.
- **API Security:** Never include API keys in the frontend. All AI requests must go through the `gpt-proxy`.
- **Manifest:** `manifest.json` is the source of truth for permissions and extension structure, integrated via `@crxjs/vite-plugin`.

## Key Commands & Workflows

- **Context Menu:** Selected text can be sent for explanation via a right-click context menu.
- **Keyboard Shortcut:** `Ctrl+Shift+E` (default) triggers an explanation for the current selection.
- **Floating Button:** An optional button that appears near selected text (configurable in settings).
- **Templates:** Supports multiple explanation styles: `school`, `science`, `simple`, and `kid5`.
