export default function isKana(str) {
    return /^[ぁ-んァ-ンー　、。・「」『』（）《》【】！？：；—…‥〜A-Za-z]+$/.test(str);
};