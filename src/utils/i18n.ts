export const translations = {
  en: {
    // Tabs
    tab_main: 'Analyze',
    tab_favorites: 'Cards',
    tab_history: 'History',
    tab_settings: 'Settings',

    // Main View
    result: 'Result',
    save_card: 'Save Card',
    remove_card: 'Remove from Cards',
    new_request: 'New Request',
    what_to_explain: 'What to explain?',
    paste_text: 'Paste text or select it on a page before opening.',
    enter_text_placeholder: 'Enter text, term or phrase to explain...',
    analyzing: 'Analyzing...',
    explain_btn: 'Explain',
    synonyms: 'Synonyms',
    examples: 'Examples',
    loading: 'Loading...',
    error: 'Error',
    listen: 'Listen',

    // Favorites
    saved_cards: 'Saved Cards',
    search_cards: 'Search cards...',
    no_saved_cards: 'No saved cards',
    no_saved_desc: 'Click the star or bookmark icon when viewing an explanation to save it here for studying.',
    delete: 'Delete',
    download_csv: 'Download CSV for Anki',

    // History
    history_title: 'History',
    history_desc: 'Your last 20 explanations',
    clear_all: 'Clear All',
    search_history: 'Search explanations...',
    all_languages: 'All Languages',
    no_history: 'No History Yet',
    no_history_desc: 'Your explanation history will appear here after you make your first request.',
    chars_used: 'characters used',
    delete_from_history: 'Delete from history',

    // Settings
    ai_settings: 'AI Settings',
    ai_provider: 'AI Provider',
    api_key: 'Your API Key',
    api_key_desc: 'The key is securely stored only in your browser.',
    base_url: 'Custom Base URL (Optional)',
    base_url_desc: 'For proxy managers (Antigravity, OpenRouter, etc.). Leave empty for official API.',
    model: 'Model',
    output_lang: 'Output Language',
    ui_lang: 'Interface Language',
    custom_prompt: 'Custom Prompt (Optional)',
    custom_prompt_placeholder: 'e.g., Explain everything as if I am a Senior Developer...',
    custom_prompt_desc: 'Overrides standard AI behavior instructions.',
    interface_settings: 'Interface',
    show_magnifier: 'Show magnifying glass when text is selected',
    direct_requests_desc: 'Requests are sent directly from your device. No subscriptions or hidden limits from the extension.',

    // Content Script (Tooltip)
    explaining: 'Explaining...',
    system_error: 'System Error: ',
    unknown_error: 'Unknown Error'
  },
  ru: {
    // Tabs
    tab_main: 'Анализ',
    tab_favorites: 'Карточки',
    tab_history: 'История',
    tab_settings: 'Настройки',

    // Main View
    result: 'Результат',
    save_card: 'Сохранить карточку',
    remove_card: 'Удалить из карточек',
    new_request: 'Новый запрос',
    what_to_explain: 'Что объяснить?',
    paste_text: 'Вставьте текст или выделите его на странице перед открытием.',
    enter_text_placeholder: 'Введите текст, термин или фразу для объяснения...',
    analyzing: 'Анализируем...',
    explain_btn: 'Объяснить',
    synonyms: 'Синонимы',
    examples: 'Примеры',
    loading: 'Загрузка...',
    error: 'Ошибка',
    listen: 'Прослушать',

    // Favorites
    saved_cards: 'Сохраненные карточки',
    search_cards: 'Поиск по карточкам...',
    no_saved_cards: 'Нет сохраненных карточек',
    no_saved_desc: 'Нажмите на иконку закладки при просмотре объяснения, чтобы сохранить его сюда для изучения.',
    delete: 'Удалить',
    download_csv: 'Скачать для Anki',

    // History
    history_title: 'История',
    history_desc: 'Ваши последние 20 объяснений',
    clear_all: 'Очистить всё',
    search_history: 'Поиск объяснений...',
    all_languages: 'Все языки',
    no_history: 'Пока нет истории',
    no_history_desc: 'Ваша история объяснений появится здесь после первого запроса.',
    chars_used: 'символов',
    delete_from_history: 'Удалить из истории',

    // Settings
    ai_settings: 'Настройки ИИ',
    ai_provider: 'Провайдер ИИ',
    api_key: 'Ваш API Ключ',
    api_key_desc: 'Ключ надежно хранится только в вашем браузере.',
    base_url: 'Custom Base URL (Опционально)',
    base_url_desc: 'Для прокси-менеджеров (Antigravity, OpenRouter и т.д.). Оставьте пустым для официального API.',
    model: 'Модель',
    output_lang: 'Язык ответа ИИ',
    ui_lang: 'Язык интерфейса',
    custom_prompt: 'Кастомный Промпт (Опционально)',
    custom_prompt_placeholder: 'Например: Объясняй всё как для Senior разработчика...',
    custom_prompt_desc: 'Переопределяет стандартные инструкции поведения ИИ.',
    interface_settings: 'Интерфейс',
    show_magnifier: 'Показывать лупу при выделении текста',
    direct_requests_desc: 'Запросы отправляются напрямую с вашего устройства. Никаких подписок или скрытых лимитов со стороны расширения.',

    // Content Script (Tooltip)
    explaining: 'Объясняем...',
    system_error: 'Системная ошибка: ',
    unknown_error: 'Неизвестная ошибка'
  }
};

export type Language = 'en' | 'ru';

export function t(key: string, lang: string = 'ru'): string {
  const dictionary = translations[lang as Language] || translations.ru;
  return (dictionary as any)[key] || key;
}
