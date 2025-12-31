export default function isKana(str) {
    return /^[ぁ-んァ-ンー\u3000、。・「」『』（）《》【】！？：；—…‥〜A-Za-z]+$/.test(str);
}
