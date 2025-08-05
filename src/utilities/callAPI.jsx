import isKana from 'utilities/isKana.jsx';
import { splitKanaSyllables } from 'utilities/kanaUtils.jsx';

export async function fetchFuriganaFromAPI(text) {
    try {
        const response = await fetch('https://api.mygo.page/api/MarkAccent/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (response.ok && data.status === 200 && Array.isArray(data.result)) {
            return data.result.map(entry => {
                const surface = entry.surface;
                const furigana = isKana(surface)
                    ? splitKanaSyllables(surface).map(() => '\u00A0') // 每個音節用空白填
                    : splitKanaSyllables(entry.furigana); // 漢字的 furigana 也要切音節
                const accent = entry.accent

                return {
                    surface,
                    furigana, // kanji 才帶 furigana
                    accent
                };
            });
        } else {
            console.error('API format error:', data);
            return [];
        }
    } catch (error) {
        console.error('API error:', error);
        return [];
    }
}
