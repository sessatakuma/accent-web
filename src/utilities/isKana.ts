export default function isKana(str: string): boolean {
    return /^[ぁ-んァ-ンー\u3000、。・「」『』（）《》【】！？：；—…‥〜A-Za-z]+$/.test(str);
}
