import { LANGUAGES } from '../types';

export class TextDetector {
  static getSelectedText(): string {
    const selection = window.getSelection();
    return selection?.toString().trim() || '';
  }

  static detectLanguage(text: string): string {
    // Simple language detection based on character patterns
    const hasKirillica = /[а-яё]/i.test(text);
    const hasChinese = /[\u4e00-\u9fff]/.test(text);
    const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
    const hasKorean = /[\uac00-\ud7af]/.test(text);
    const hasArabic = /[\u0600-\u06ff]/.test(text);
    const hasHindi = /[\u0900-\u097f]/.test(text);

    if (hasKirillica) return 'ru';
    if (hasChinese) return 'zh';
    if (hasJapanese) return 'ja';
    if (hasKorean) return 'ko';
    if (hasArabic) return 'ar';
    if (hasHindi) return 'hi';

    return 'en'; // Default to English
  }

  static isUrlBlacklisted(url: string, blacklist: string[]): boolean {
    const hostname = new URL(url).hostname;
    return blacklist.some(domain => hostname.includes(domain));
  }

  static truncateText(text: string, limit: number): { text: string; wasTruncated: boolean } {
    if (text.length <= limit) {
      return { text, wasTruncated: false };
    }

    const truncated = text.substring(0, limit);
    return { text: truncated, wasTruncated: true };
  }

  static countCharacters(text: string): number {
    return text.length;
  }
}