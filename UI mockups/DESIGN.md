---
name: Apex Arena
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#272a32'
  surface-container-highest: '#32353d'
  on-surface: '#e1e2ec'
  on-surface-variant: '#b9cbbd'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2d3038'
  outline: '#849588'
  outline-variant: '#3b4a3f'
  surface-tint: '#00e38f'
  primary: '#cdffdc'
  on-primary: '#003920'
  primary-container: '#00f59b'
  on-primary-container: '#006b41'
  inverse-primary: '#006d42'
  secondary: '#ffb2ba'
  on-secondary: '#670020'
  secondary-container: '#d4004b'
  on-secondary-container: '#ffe6e8'
  tertiary: '#e3f6ff'
  on-tertiary: '#003543'
  tertiary-container: '#90e2ff'
  on-tertiary-container: '#00667d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#53ffab'
  primary-fixed-dim: '#00e38f'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#005231'
  secondary-fixed: '#ffd9dc'
  secondary-fixed-dim: '#ffb2ba'
  on-secondary-fixed: '#400011'
  on-secondary-fixed-variant: '#910030'
  tertiary-fixed: '#b6ebff'
  tertiary-fixed-dim: '#47d6ff'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e60'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353d'
typography:
  headline-xl:
    fontFamily: Barlow Condensed
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Barlow Condensed
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system fuses the electric urgency of live competitive sports with the precision telemetry of financial market trading. Designed for competitive sports fans, day traders, and next-generation prediction market participants, the interface elicits peak adrenaline, tactical focus, and institutional clarity.

The visual style is **High-Contrast Dark Athletic Glassmorphism**. The foundation is built upon deep obsidian surfaces layered with stadium floodlight translucency, high-voltage semantic accents, and sharp neon edge-lit cards. Tactile, rapid-execution mobile interactions simulate physical sportsbook hardware dials, haptic trading pads, and real-time live match telemetry displays.

## Colors

The palette is engineered specifically for dark-mode data density, high split-second readability, and rapid sentiment distinction:

- **Deep Midnight Obsidian (`#0A0D14`)**: Grounding base canvas providing maximum contrast for vibrant signal states.
- **Surface Elevation Layers**:
  - `surface-base`: `#0A0D14` (Canvas)
  - `surface-card`: `#121722` at 85% opacity with 16px backdrop blur
  - `surface-elevated`: `#1A2232` (Interactive cards, active slip states)
  - `surface-overlay`: `#232D42` (Modals, bottom sheets)
- **Electric Volt Neon Green (`#00F59B`)**: Primary semantic tone representing "Yes" prediction contracts, bullish order flow, executed gains, and positive liquidity states.
- **Laser Crimson (`#FF3366`)**: Secondary semantic tone signaling "No" prediction contracts, short positions, losses, liquidated positions, and stop-loss states.
- **Electric Cyan (`#00D2FF`)**: Tertiary interactive accent dedicated to live telemetry indicators, secondary buttons, filters, market charts, and verified badges.
- **Trophy Gold (`#FFD027`)**: Accent reserved strictly for win streaks, jackpot multipliers, XP rank progress, and tier badges.
- **Data & Text Contrast**:
  - `text-primary`: `#FFFFFF`
  - `text-secondary`: `#8E9CAE`
  - `text-muted`: `#505D70`
  - `border-subtle`: `rgba(255, 255, 255, 0.08)`
  - `border-glow-bull`: `rgba(0, 245, 155, 0.35)`
  - `border-glow-bear`: `rgba(255, 51, 102, 0.35)`

## Typography

Typography prioritizes fast-twitch scanning under active match conditions:

- **Display & Headlines (`Barlow Condensed`)**: Condensed, uppercase-forward athletic type structure that packs maximum punch in constrained vertical space. Always used for match titles, scoreboard headers, contract question prompts, and primary values.
- **Body & Structural Copy (`Space Grotesk`)**: Geometric, technical, clean sans-serif ensuring effortless readability for market descriptions, resolution criteria, and rulebooks.
- **Financial Data & Telemetry (`JetBrains Mono`)**: Strict tabular lining figures for contract pricing (e.g., `42¢`, `88¢`), probabilities (`74%`), live match clock tickers (`4Q 02:14`), order books, and payout calculations. Eliminates horizontal layout jitter during live market updates.

## Layout & Spacing

This design system uses a mobile-first, 4-column layout model with dynamic vertical rhythm:

- **Mobile Canvas**: 4 columns with `12px` gutters (`0.75rem`) and `16px` outer screen margins (`1rem`).
- **Tablet / Responsive Slate**: 8 columns with `16px` gutters and `24px` margins for split view (Order Book / Odds Grid on the left; Trading Execution Slip pinned to the right).
- **Component Geometry**: Internal padding adheres strictly to `space-xs` (4px), `space-sm` (8px), `space-md` (12px), `space-lg` (16px), and `space-xl` (24px).
- **Execution Zone**: The mobile view reserves a fixed 72px safe-zone bar at the viewport bottom for quick-fire Yes/No triggers and real-time portfolio balance readouts.

## Elevation & Depth

Visual hierarchy uses **Translucent Glassmorphism & Edge Neon Radiance**:

- **Ground Level (Level 0)**: Flat `#0A0D14` stadium canvas. No blur or shadows.
- **Market Card Level (Level 1)**: `#121722` at 85% opacity with `backdrop-filter: blur(16px)` and a crisp `1px` border of `rgba(255, 255, 255, 0.07)`.
- **Active Market / Live Play (Level 2)**: Level 1 properties supplemented by an ambient aura: `box-shadow: 0 4px 20px -2px rgba(0, 245, 155, 0.15)`. For bearish-leaning contracts, the aura shifts to `rgba(255, 51, 102, 0.15)`.
- **Trading Slip / Bottom Sheet (Level 3)**: `#1A2232` at 95% opacity with `backdrop-filter: blur(24px)`, bounded by a top neon highlight line (`border-top: 1px solid rgba(0, 210, 255, 0.4)`), cast against a soft backdrop scrim (`rgba(10, 13, 20, 0.75)`).
- **Haptic Press State**: Active interactive surfaces depress with a subtle scale transformation (`scale(0.98)`) and high-luminance stroke highlight (`rgba(255, 255, 255, 0.2)`).

## Shapes

The design system employs **Level 2 (Rounded)** curvature with specialized geometric variants:

- **Standard Containers & Cards**: `rounded-lg` (16px) balance structural grid precision with ergonomic thumb navigation.
- **Interactive Action Buttons & Outcome Pills**: Completely pill-shaped (`rounded-full` / 9999px) to establish tactile target affordances for high-speed betting decisions.
- **Contract Badges & Telemetry Ticks**: `rounded-md` (8px) for tabular numbers and percentage change tags.
- **Trading Input Sliders & Thumb Trackers**: Rounded pill handles with high-contrast inner thumb pins to ensure accurate positioning during tactile wager adjustments.

## Components

### Buttons & Quick-Buy Triggers
- **Primary Binary Triggers (YES / NO)**:
  - **YES Button**: Pill-shaped, gradient-infused green background (`#00F59B` to `#00D285`), text in `#0A0D14` (Barlow Condensed 800), displaying the contract outcome and current price (e.g., `YES 48¢`). Ambient green glow on hover/active.
  - **NO Button**: Pill-shaped, laser crimson gradient (`#FF3366` to `#E01E50`), text in `#FFFFFF` (Barlow Condensed 800), displaying outcome and price (e.g., `NO 52¢`). Ambient crimson glow on hover/active.
- **Secondary Actions**: Translucent surface (`rgba(255, 255, 255, 0.06)`), 1px border (`rgba(255, 255, 255, 0.12)`), text in `#00D2FF`.

### Market Cards
- Encased in Level 1 glass. Header features live match telemetry (teams, league pill, game clock in JetBrains Mono).
- Central zone hosts the proposition headline (e.g., "CHIEFS TO SCORE NEXT TOUCHDOWN?") alongside a mini depth line or live probability bar graph.
- Card footer contains split YES / NO pill buttons for instant one-tap order routing.

### Trading Slip (Drawer / Bottom Sheet)
- Slides up from the viewport base with haptic response.
- Contains a tactile contract amount slider with quick-stake increments (`+$10`, `+$25`, `+$100`, `MAX`), expected return payout calculations in tabular mono, and an electric swipe-to-confirm rail.

### Chips & Status Filters
- Filter chips for sports categories (NFL, NBA, UFC, Premier League, Esports) feature a compact pill silhouette (`rounded-full`, 32px height) with mono icons.
- Unselected chips: Subdued background (`rgba(255, 255, 255, 0.04)`) with muted labels.
- Selected chips: Solid `#00D2FF` accent border, glowing indicator pip, and bold white typography.

### Streak, XP, & Leaderboard Modules
- Highlighted with Trophy Gold (`#FFD027`).
- Win streak banners incorporate high-contrast gold badge icons with JetBrains Mono counter (e.g., `🔥 7 STREAK (3.2x MULTIPLIER)`).
- Leaderboard rows display position numbers with top-3 users receiving metallic gold, cyan, and volt rank indicators.

### Live Ticker & Match Badges
- Pulsing red/green live status indicator (`8px` dot with ping animation) accompanied by real-time timecode (`JetBrains Mono`).
- Odds transition animations: Flash green (`#00F59B`) for contract upward tick, flash red (`#FF3366`) for downward tick.