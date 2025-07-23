export default function(el, relative = false) {
    if (!el.current) return 0;
    const rect = el.current.getBoundingClientRect();
    return relative ? rect : {
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        width: rect.width,
        height: rect.height
    };
}