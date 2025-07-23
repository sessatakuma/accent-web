const isKana = str => /^[ぁ-んァ-ンー。、.　]+$/.test(str); 

export async function fetchFuriganaFromAPI(text) {
    try {
        const response = await fetch('https://fastapi-wd1i.onrender.com/api/MarkAccent/', {
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
                    furigana: isKana(surface) ? '' : furigana, // kanji 才帶 furigana
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
