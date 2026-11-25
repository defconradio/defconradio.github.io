# Personal Static Site

A minimalist, high-performance static personal page scaffolded for GitHub Pages. Inspired by [max.gp](https://max.gp/) with an adaptive 1-item-at-a-time carousel architecture.

The previous repository state has been safely preserved in the `archive-old` branch.

## Features

- **1-Item Carousel Architecture**: Renders one complete page card at a time with smooth horizontal transitions, touch swiping for phones, keyboard shortcuts (`←` / `→`), and header tab navigation.
- **Dark Grey & White Cream Palette**: Warm, low-strain charcoal background (`#151719`) with paper-cream typography (`#eae5db`) and muted metadata tones.
- **Mobile-First Responsive Design**: Uses `100dvh` viewport height, card-level internal scrolling, and fluid sizing with `clamp()` for phones, tablets, and desktop displays.
- **Zero Dependencies**: Pure HTML5, modern vanilla CSS, and lightweight JS.
- **Decentralized & Identity-Ready**: Preserves `.well-known/nostr.json` support for Nostr NIP-05 verification.

## Customization

- Edit content in `index.html`.
- Modify colors or fonts in `style.css` via `:root` variables.
- Add or remove `<article class="carousel-item">` blocks in `index.html` — the carousel navigation and indicators automatically adapt.

