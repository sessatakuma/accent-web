import isKana from 'utilities/isKana.jsx';
import { splitKanaSyllables } from 'utilities/kanaUtils.jsx';
import { placeholder } from 'utilities/placeholder.jsx';

export async function fetchFuriganaFromAPI(text) {
    const apiKey = process.env.X_API_KEY;
    try {
        const response = await fetch('https://api.sessatakuma.dev/api/MarkAccent/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'X-API-KEY': apiKey
            },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();

        if (response.ok && data.status === 200 && Array.isArray(data.result)) {
            // TODO: add placeholder for foreign words
            return data.result.map(entry => {
                let furigana = entry.furigana;
                if (isKana(entry.surface)) 
                    furigana = '';
                else 
                    furigana = splitKanaSyllables(furigana);
                return {
                    surface: entry.surface,
                    furigana,
                    accent: entry.accent,
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
