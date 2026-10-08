# PARZIO Atelier Design System & Luxury UI Specification

## 1. Brand Essence & Vision
PARZIO is a high-end luxury demi-fine jewelry brand (18K Gold Plated Anti-Tarnish & Waterproof Jewellery, Mumbai Atelier). The entire digital experience — from customer storefront to the internal Admin Operations Panel — must exude calm elegance, precision craftsmanship, and consistent visual harmony.

---

## 2. Core Color Palette Tokens

### Primary Luxury Palette
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Atelier Onyx** | `#141414` | Primary active background, primary high-contrast buttons, deep text |
| **Artisan Gold** | `#8c7138` | Primary brand accent, selected icon borders, luxury highlights |
| **Champagne Gold** | `#fed488` | Active header text accents, glowing indicators, high-contrast gold text |
| **Warm Ivory Base** | `#fbf9f6` | Application main workspace background, drawer canvas |
| **Warm Linen Card** | `#ffffff` / `#faf8f5` | Card surfaces, modal surfaces, table headers |
| **Subtle Warm Border** | `#eae5dc` | Global card borders, divider rules, subtle separators |
| **Gold Tint Border** | `#ebd7be` | Accent badge borders, highlighted container strokes |
| **Warm Gold Pill Bg** | `#faf6ef` | Standard neutral badge pill background |

### Status Tokens (Strictly Semantic)
| State | Background | Text | Border | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Live / Active / OK** | `bg-emerald-50` | `text-emerald-800` | `border-emerald-200/80` | Online, Connected, COD Safety On, Verified |
| **Pending / Action Required** | `bg-amber-50` | `text-amber-800` | `border-amber-200/80` | Abandoned leads pending, Return requests |
| **Emergency / Destructive** | `bg-rose-50` | `text-rose-700` | `border-rose-200` | Emergency pause, Delete order, Cancelled |
| **In Transit / BlueDart** | `bg-blue-50` | `text-blue-800` | `border-blue-200` | Courier tracking, In Transit status |

---

## 3. Standardized Badge & Pill System

All badges across the Admin Panel and Drawer must follow these standard classes:

### 1. Default Count / Info Pill (Neutral Luxury)
Used for counts of items, categories, vouchers, and general attributes.
```tsx
className="px-2.5 py-0.5 rounded-full bg-[#faf6ef] text-[#8c7138] border border-[#ebd7be] text-[10px] font-mono font-bold"
```

### 2. Active Selection Pill
Used when an item or card is currently selected or focused.
```tsx
className="px-2 py-0.5 rounded-full bg-[#8c7138] text-white text-[9px] font-bold uppercase tracking-wider"
```

### 3. System Live / Online Pill
Used strictly for system connectivity or operational status.
```tsx
className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-mono font-bold flex items-center gap-1.5"
```

### 4. Action Alert / Pending Pill
Used strictly when action is pending by an administrator.
```tsx
className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-mono font-bold"
```

---

## 4. Typography Scale & Standards

- **Display Headings**: `font-display tracking-tight text-[#141414]` (Playfair / Cormorant / Luxury Serif font)
- **Body & Captions**: `font-sans antialiased text-[#141414]` (Inter / Outfit / SF Pro)
- **Telemetry & Numbers (AWB, SKU, Counts)**: `font-mono tracking-tight font-bold`

---

## 5. UI Components Guidelines

### Buttons
- **Primary Action (Onyx)**: `bg-[#141414] hover:bg-[#8c7138] text-white rounded-full px-4 py-2 text-xs font-bold transition-all shadow-xs active:scale-95`
- **Secondary Neutral (Warm Ivory)**: `bg-[#faf8f5] hover:bg-[#eae5dc] text-[#141414] border border-[#eae5dc] rounded-full px-3.5 py-2 text-xs font-bold transition-colors`
- **Destructive (Rose)**: `bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full px-3.5 py-2 text-xs font-bold`

### Cards & Containers
- **Main Container**: `bg-white rounded-3xl border border-[#eae5dc] p-5 shadow-xs`
- **Hoverable Interactive Row**: `hover:bg-[#faf8f5] transition-colors border-b border-[#eae5dc]/60`

### Floating Snackbars (Toasts)
- Position: Floating bottom center (`fixed bottom-8 sm:bottom-6 left-1/2 -translate-x-1/2 z-50`)
- Style: `bg-[#141414]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-[#8c7138]/50 shadow-2xl text-xs font-semibold`
