function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return map[character] ?? character;
  });
}

/**
 * Studio plate used when no image model is configured, or when the model call fails.
 * It keeps the forge flow working end to end.
 */
export function studioPlate(prompt: string) {
  const line = escapeXml(prompt.trim().slice(0, 140));
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="48%">
      <stop offset="0%" stop-color="#f3f3f1" stop-opacity="0.4"/>
      <stop offset="42%" stop-color="#9a9a94" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f7f6f2"/>
      <stop offset="45%" stop-color="#c8c6bf"/>
      <stop offset="100%" stop-color="#6b6b66"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="#050505"/>
  <g opacity="0.55" stroke="#f3f3f1" fill="none">
    <path d="M40 760 C 220 700, 360 820, 540 760 S 860 690, 1000 760" stroke-width="1.2"/>
    <path d="M20 810 C 240 760, 400 860, 620 800 S 900 740, 1020 820" stroke-width="0.8"/>
  </g>
  <circle cx="512" cy="430" r="250" fill="url(#glow)"/>
  <circle cx="512" cy="448" r="188" fill="none" stroke="#f3f3f1" stroke-width="1.2" opacity="0.85"/>
  <circle cx="512" cy="448" r="214" fill="none" stroke="#f3f3f1" stroke-width="0.6" opacity="0.4"/>
  <g fill="url(#metal)">
    <circle cx="512" cy="392" r="36"/>
    <rect x="496" y="392" width="32" height="4" fill="#f3f3f1"/>
    <path d="M470 470 h84 l18 70 h-120 z"/>
    <rect x="452" y="486" width="22" height="78" rx="10"/>
    <rect x="550" y="486" width="22" height="78" rx="10"/>
    <rect x="486" y="540" width="18" height="92" rx="8"/>
    <rect x="520" y="540" width="18" height="92" rx="8"/>
  </g>
  <g fill="none" stroke="#f3f3f1" stroke-width="1" opacity="0.55">
    <polygon points="180,250 210,300 150,300"/>
    <rect x="790" y="220" width="46" height="46" transform="rotate(18 813 243)"/>
    <polygon points="860,520 900,560 820,575"/>
  </g>
  <text x="72" y="92" fill="#f3f3f1" font-family="Georgia, serif" font-size="28" letter-spacing="8">SUPER AI</text>
  <text x="72" y="124" fill="#9a9a94" font-family="Georgia, serif" font-size="14" letter-spacing="6">STUDIO PLATE</text>
  <text x="72" y="900" fill="#f3f3f1" font-family="Georgia, serif" font-size="26" font-style="italic">${line}</text>
</svg>`;

  return new TextEncoder().encode(svg);
}
