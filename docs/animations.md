# Animation System

## Overview

The project uses two animation libraries:
- **Motion v12** (formerly Framer Motion) -- declarative React animations, page transitions, micro-interactions
- **GSAP v3.13** -- imperative timeline animations, ScrollTrigger, text splitting

Both respect `prefers-reduced-motion` and disable animations when the user requests it.

## Motion v12

### Reusable Variants (`src/lib/animation-variants.ts`)

Pre-defined animation variants:

| Variant | Effect |
|---------|--------|
| `fadeIn` | Opacity 0 to 1 |
| `fadeUp` | Opacity 0 + translate Y 30px to 0 |
| `fadeDown` | Opacity 0 + translate Y -30px to 0 |
| `scaleIn` | Opacity 0 + scale 0.9 to 1 |
| `slideInLeft` | Opacity 0 + translate X -60px to 0 |
| `slideInRight` | Opacity 0 + translate X 60px to 0 |
| `staggerContainer` | Staggers children with 0.1s delay |

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

## When to Use Motion vs GSAP

| Use Case | Library |
|----------|---------|
| Page transitions | Motion (`AnimatePresence`) |
| Scroll-triggered reveals | Either (Motion `<Animated>` or GSAP `<ScrollReveal>`) |
| Micro-interactions (hover, tap) | Motion (`whileHover`, `whileTap`) |
| Complex timelines | GSAP (`gsap.timeline()`) |
| Text splitting animations | GSAP (SplitText) |
| Horizontal scroll galleries | GSAP (ScrollTrigger + pin) |
| Layout animations | Motion (`layout`, `layoutId`) |
| Scroll progress bar | Motion (`useScroll` + `useSpring`) |

## Reduced Motion

Both wrappers check `prefers-reduced-motion`:
- `<Animated>` uses `useReducedMotion()` from Motion -- renders children without animation
- `<ScrollReveal>` checks `window.matchMedia('(prefers-reduced-motion: reduce)')` -- skips GSAP animations

All animation components are `'use client'` (required for hooks and browser APIs). Server Components can import and use them by passing server-rendered content as `children`.
