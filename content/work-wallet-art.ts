import type { WorkTileId } from './work';

/** Wallet cover SVG keyed by case-study slug (injected at page generation). */
export const walletCoverSvg: Record<WorkTileId, string> = {
  orderflow: `<svg class="art" viewBox="0 0 160 96" fill="none" stroke="currentColor" stroke-width="1.4">
              <rect x="6" y="34" width="36" height="28" rx="6"/>
              <rect x="70" y="8" width="10" height="80" rx="5" fill="currentColor" fill-opacity=".18"/>
              <rect x="118" y="10" width="36" height="28" rx="6"/>
              <rect x="118" y="58" width="36" height="28" rx="6"/>
              <path class="flow" d="M42 48H70"/><path class="flow" d="M80 24H118"/><path class="flow" d="M80 72H118"/>
              <text x="24" y="51.5" font-size="8" text-anchor="middle" stroke="none">order</text>
              <text x="136" y="27.5" font-size="8" text-anchor="middle" stroke="none">pay</text>
              <text x="136" y="75.5" font-size="8" text-anchor="middle" stroke="none">stock</text>
              <circle cx="75" cy="30" r="1.6" fill="currentColor" stroke="none"/><circle cx="75" cy="48" r="1.6" fill="currentColor" stroke="none"/><circle cx="75" cy="66" r="1.6" fill="currentColor" stroke="none"/>
            </svg>`,
  focusfleet: `<svg class="art" viewBox="0 0 160 96" fill="none" stroke="currentColor" stroke-width="1.4">
              <path d="M10 22V12a4 4 0 0 1 4-4h10M136 8h10a4 4 0 0 1 4 4v10M150 74v10a4 4 0 0 1-4 4h-10M24 88H14a4 4 0 0 1-4-4V74" stroke-linecap="round"/>
              <ellipse cx="80" cy="42" rx="19" ry="24"/>
              <ellipse class="eye" cx="72" cy="37" rx="4" ry="2.4" fill="currentColor" stroke="none"/>
              <ellipse class="eye" cx="88" cy="37" rx="4" ry="2.4" fill="currentColor" stroke="none"/>
              <path d="M73 53q7 4 14 0" stroke-linecap="round"/>
              <circle class="live" cx="20" cy="18" r="2.4" fill="currentColor" stroke="none"/>
              <text x="26" y="20.5" font-size="7" stroke="none">LIVE</text>
              <rect x="22" y="76" width="116" height="5" rx="2.5" fill="currentColor" fill-opacity=".25" stroke="none"/>
              <rect class="meter" x="22" y="76" width="116" height="5" rx="2.5" fill="currentColor" stroke="none"/>
            </svg>`,
  'fraud-call': `<svg class="art" viewBox="0 0 160 96" fill="currentColor" stroke="none">
              <rect class="bar" style="--d:0ms" x="10.0" y="44.0" width="5" height="20" rx="2.5"/><rect class="bar" style="--d:70ms" x="19.3" y="37.0" width="5" height="34" rx="2.5"/><rect class="bar" style="--d:140ms" x="28.6" y="29.0" width="5" height="50" rx="2.5"/><rect class="bar" style="--d:210ms" x="37.9" y="40.0" width="5" height="28" rx="2.5"/><rect class="bar" style="--d:280ms" x="47.2" y="26.0" width="5" height="56" rx="2.5"/><rect class="bar" style="--d:350ms" x="56.5" y="34.5" width="5" height="39" rx="2.5"/><rect class="bar" style="--d:420ms" x="65.8" y="43.0" width="5" height="22" rx="2.5"/><rect class="bar" style="--d:490ms" x="75.1" y="30.0" width="5" height="48" rx="2.5"/><rect class="bar" style="--d:560ms" x="84.4" y="38.5" width="5" height="31" rx="2.5"/><rect class="bar" style="--d:630ms" x="93.7" y="27.5" width="5" height="53" rx="2.5"/><rect class="bar" style="--d:700ms" x="103.0" y="41.5" width="5" height="25" rx="2.5"/><rect class="bar" style="--d:770ms" x="112.3" y="33.0" width="5" height="42" rx="2.5"/><rect class="bar" style="--d:840ms" x="121.6" y="45.5" width="5" height="17" rx="2.5"/><rect class="bar" style="--d:910ms" x="130.9" y="36.0" width="5" height="36" rx="2.5"/><rect class="bar" style="--d:980ms" x="140.2" y="40.0" width="5" height="28" rx="2.5"/>
              <rect x="104" y="8" width="46" height="18" rx="9" fill-opacity=".22"/>
              <text x="127" y="20.5" font-size="10" font-weight="700" text-anchor="middle">95%</text>
            </svg>`,
  folio: `<svg class="art" viewBox="0 0 160 96" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
              <path d="M36 6h88a4 4 0 0 1 4 4v58l-20 22H36a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill="currentColor" fill-opacity=".08"/>
              <path d="M128 68l-20 22V74a6 6 0 0 1 6-6z" fill="currentColor" fill-opacity=".25"/>
              <path d="M44 20h44M44 29h60M44 38h36" opacity=".35"/>
              <path class="ink" pathLength="1" stroke-width="2" d="M44 66c8-14 14 10 22-4s14-12 22-2 12-6 18-6"/>
            </svg>`,
};