import isKana from 'utilities/isKana.jsx';

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
                const furigana = entry.furigana;
                const accent = entry.accent

                return {
                    surface,
                    furigana: isKana(surface) ? [...surface].map(() => '\u00A0') : furigana, // kanji 才帶 furigana
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
