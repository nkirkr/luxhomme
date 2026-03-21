# Animation System

## Overview

The project includes a multi-layer animation stack. **Motion is the default** and the only library loaded in production. All other libraries are **opt-in** — their components/hooks are ready to use but not imported until you need them.

| Layer           | Library           | Status       | Purpose                                                            |
| --------------- | ----------------- | ------------ | ------------------------------------------------------------------ |
| Core engine     | **Motion v12**    | **Default**  | Declarative React animations, page transitions, micro-interactions |
| Timeline engine | **GSAP v3.13**    | Opt-in       | Imperative timelines, ScrollTrigger, text splitting                |
| Scroll utility  | **AOS**           | Opt-in       | Data-attribute scroll animations, zero JS required per element     |
| Auto animations | **AutoAnimate**   | Opt-in       | Zero-config list/DOM-change animations                             |
| JSON animations | **Lottie**        | Opt-in       | After Effects / LottieFiles JSON playback                          |
| Copy-paste UI   | **Magic UI**      | Opt-in (CLI) | Animated SaaS/marketing components (CLI)                           |
| Copy-paste UI   | **Aceternity UI** | Opt-in (CLI) | Hero sections, visual effects (shadcn registry)                    |

All animation components respect `prefers-reduced-motion`.

> **Bundle note:** Opt-in libraries (GSAP, AOS, Lottie, AutoAnimate) are tree-shaken out of the bundle until you import their components. Only Motion ships in the default bundle.

---

## Motion v12

### Reusable Variants (`src/lib/animation-variants.ts`)

Pre-defined animation variants:

| Variant            | Effect                             |
| ------------------ | ---------------------------------- |
| `fadeIn`           | Opacity 0 to 1                     |
| `fadeUp`           | Opacity 0 + translate Y 30px to 0  |
| `fadeDown`         | Opacity 0 + translate Y -30px to 0 |
| `scaleIn`          | Opacity 0 + scale 0.9 to 1         |
| `slideInLeft`      | Opacity 0 + translate X -60px to 0 |
| `slideInRight`     | Opacity 0 + translate X 60px to 0  |
| `staggerContainer` | Staggers children with 0.1s delay  |

### `<Animated>` Wrapper (`src/components/animations/animated.tsx`)

Universal scroll-triggered animation wrapper. Wraps any content in a `motion.div` that animates when entering the viewport.

```typescript
import { Animated } from '@/components/animations/animated'
import { fadeUp, staggerContainer } from '@/lib/animation-variants'

// Basic usage
<Animated>
  <h2>This fades up on scroll</h2>
</Animated>

// With custom variant
<Animated variants={slideInLeft} delay={0.2}>
  <p>Slides in from left with delay</p>
</Animated>

// Stagger children
<Animated variants={staggerContainer}>
  <Animated variants={fadeUp}><Card /></Animated>
  <Animated variants={fadeUp}><Card /></Animated>
  <Animated variants={fadeUp}><Card /></Animated>
</Animated>
```

Props:

- `variants` -- Motion variants (default: `fadeUp`)
- `delay` -- Animation delay in seconds
- `once` -- Animate only once (default: true)
- `margin` -- Viewport margin for trigger (default: "-80px")
- `className` -- CSS classes

### Page Transitions (`src/components/animations/page-transition.tsx`)

Wraps page content with fade + slide animation on route change. Used in `src/app/template.tsx` (re-renders on navigation, unlike layout.tsx).

Animation: fade in + 8px Y translation, 250ms ease-in-out, `AnimatePresence` with `mode="wait"`.

---

## GSAP v3.13

### Configuration (`src/lib/gsap-config.ts`)

Registers ScrollTrigger plugin. Import from this file instead of `gsap` directly to ensure plugins are registered:

```typescript
import { gsap, ScrollTrigger } from '@/lib/gsap-config'
```

### `<ScrollReveal>` Wrapper (`src/components/animations/scroll-reveal.tsx`)

GSAP-powered scroll-triggered reveal animation. Uses `useGSAP` hook from `@gsap/react` for automatic cleanup.

```typescript
import { ScrollReveal } from '@/components/animations/scroll-reveal'

// Basic: entire container animates
<ScrollReveal>
  <div>This reveals on scroll</div>
</ScrollReveal>

// Stagger: children with .gsap-reveal class animate sequentially
<ScrollReveal stagger={0.15}>
  <div className="gsap-reveal">Item 1</div>
  <div className="gsap-reveal">Item 2</div>
  <div className="gsap-reveal">Item 3</div>
</ScrollReveal>
```

Props:

- `y` -- Vertical offset in pixels (default: 60)
- `duration` -- Animation duration (default: 0.8)
- `delay` -- Start delay (default: 0)
- `stagger` -- Delay between children (default: 0.1)
- `className` -- CSS classes

---

## AOS (Animate on Scroll) — Opt-in

AOS is **not loaded by default**. To enable it, add the `AOSProvider` to your `AppProviders` in `src/components/providers/app-providers.tsx`:

```tsx
import { AOSProvider } from './aos-provider'

// Wrap children with AOSProvider
;<AOSProvider>{children}</AOSProvider>
```

Once enabled, no per-component imports needed -- just add `data-aos` attributes to any element.

### Usage

```tsx
<div data-aos="fade-up">Appears from below</div>
<div data-aos="fade-right" data-aos-delay="200">Slides from left with delay</div>
<div data-aos="zoom-in" data-aos-duration="1200">Zoom effect</div>
<div data-aos="flip-left">Flip effect</div>
```

### Available Effects

| Category | Effects                                                   |
| -------- | --------------------------------------------------------- |
| Fade     | `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right` |
| Zoom     | `zoom-in`, `zoom-out`, `zoom-in-up`, `zoom-in-down`       |
| Flip     | `flip-left`, `flip-right`, `flip-up`, `flip-down`         |
| Slide    | `slide-up`, `slide-down`, `slide-left`, `slide-right`     |

### Data Attributes

- `data-aos` -- animation name (required)
- `data-aos-delay` -- delay in ms (e.g. `"200"`)
- `data-aos-duration` -- duration in ms (overrides global 800ms)
- `data-aos-easing` -- easing function
- `data-aos-once` -- `"true"` / `"false"` (overrides global)
- `data-aos-offset` -- trigger offset in px

### Global Config

Configured in `aos-provider.tsx`: `duration: 800`, `easing: 'ease-out-cubic'`, `once: true`, `offset: 80`.

---

## AutoAnimate

Zero-config animations for lists, conditional rendering, and DOM changes. One hook call -- animations happen automatically when items are added, removed, or reordered.

### Usage

```typescript
import { useAutoAnimate } from '@/components/animations/auto-animate'

function FilteredList({ items }) {
  const [parent] = useAutoAnimate()

  return (
    <ul ref={parent}>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

Best for: shopping carts, filter results, accordions, todo lists, tabs with dynamic content.

---

## Lottie

Plays JSON animations exported from After Effects or downloaded from [lottiefiles.com](https://lottiefiles.com). Place JSON files in `public/animations/`.

### `<LottieAnimation>` Wrapper (`src/components/animations/lottie-animation.tsx`)

```typescript
import { LottieAnimation } from '@/components/animations/lottie-animation'
import loadingData from '@/public/animations/loading.json'

<LottieAnimation
  animationData={loadingData}
  loop={true}
  width={120}
  height={120}
/>
```

Props:

- `animationData` -- imported JSON animation data (required)
- `loop` -- loop playback (default: true)
- `autoplay` -- auto-start (default: true)
- `width` / `height` -- dimensions (default: 120)
- `className` -- CSS classes
- `style` -- inline styles

Respects `prefers-reduced-motion`: stops on first frame when reduced motion is preferred.

---

## Magic UI

Copy-paste animated components built on React + TypeScript + Tailwind + Motion. Installed via CLI into `src/components/magicui/`.

### Adding Components

```bash
npx magicui-cli add marquee
npx magicui-cli add bento-grid
npx magicui-cli add animated-list
npx magicui-cli add dock
npx magicui-cli add --all
```

Browse components: [magicui.design](https://magicui.design)

---

## Aceternity UI

Copy-paste components for hero sections and visual effects. Uses shadcn registry -- components go to `src/components/ui/`.

### Adding Components

```bash
npx shadcn@latest add @aceternity/aurora-background
npx shadcn@latest add @aceternity/background-beams
npx shadcn@latest add @aceternity/hover-border-gradient
```

Browse components: [ui.aceternity.com](https://ui.aceternity.com)

---

## When to Use What

| Use Case                        | Library                            |
| ------------------------------- | ---------------------------------- |
| Page transitions                | Motion (`AnimatePresence`)         |
| Scroll reveals (React-way)      | Motion `<Animated>`                |
| Scroll reveals (imperative)     | GSAP `<ScrollReveal>`              |
| Quick scroll effects via markup | AOS (`data-aos` attributes)        |
| Micro-interactions (hover, tap) | Motion (`whileHover`, `whileTap`)  |
| Complex timelines               | GSAP (`gsap.timeline()`)           |
| Text splitting animations       | GSAP (SplitText)                   |
| Horizontal scroll galleries     | GSAP (ScrollTrigger + pin)         |
| Layout animations               | Motion (`layout`, `layoutId`)      |
| Scroll progress bar             | Motion (`useScroll` + `useSpring`) |
| List add/remove/reorder         | AutoAnimate (`useAutoAnimate`)     |
| Loaders, illustrations          | Lottie (`<LottieAnimation>`)       |
| SaaS marketing components       | Magic UI (CLI)                     |
| Hero sections, visual effects   | Aceternity UI (shadcn registry)    |

## Reduced Motion

All wrappers check `prefers-reduced-motion`:

- `<Animated>` uses `useReducedMotion()` from Motion -- renders children without animation
- `<ScrollReveal>` checks `window.matchMedia('(prefers-reduced-motion: reduce)')` -- skips GSAP animations
- AOS respects the media query natively
- `<LottieAnimation>` stops on first frame when reduced motion is preferred

All animation components are `'use client'` (required for hooks and browser APIs). Server Components can import and use them by passing server-rendered content as `children`.
