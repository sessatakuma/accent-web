// utilities/kanaUtils.jsx
export function splitKanaSyllables(kana) {
    const smallKana = 'ゃゅょァィゥェォャュョヮぁぃぅぇぉっッ';
    const result = [];

    for (let i = 0; i < kana.length; i++) {
        const char = kana[i];
        const next = kana[i + 1];

        if (next && smallKana.includes(next)) {
            result.push(char + next); // 合併音節
            i++; // skip next
        } else {
            result.push(char);
        }
    }

    return result;
}
