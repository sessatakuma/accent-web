// Type definitions for the accent-marker application

export interface FuriganaItem {
    text: string;
    accent: number;
}

export interface Word {
    surface: string;
    furigana: FuriganaItem[];
    accent: number | number[];
}

export interface APIAccentEntry {
    surface: string;
    furigana: string;
    accent: Array<{
        furigana: string;
        accent_marking_type: number;
    }>;
}

export interface APIResponse {
    status: number;
    result: APIAccentEntry[];
}
