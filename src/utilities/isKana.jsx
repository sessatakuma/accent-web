export default function isKana(str) {
    return /^[ぁ-んァ-ンー　、。・「」『』（）《》【】！？：；—…‥〜]+$/.test(str);
};