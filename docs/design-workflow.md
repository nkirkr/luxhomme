# Design Workflow

## Overview

The project supports two design workflows:

1. **Figma Import** -- receive a Figma URL, use MCP tools to inspect the design, implement with exact fidelity
2. **Reference/Prompt Generation** -- generate designs from reference images or text prompts using AI skills

## Cursor Rules

Two `.cursor/rules/` files guide the AI agent during design implementation:

### `design-system.mdc`

Maps Figma design tokens to Tailwind CSS:

| Figma Token | Tailwind Class |
|-------------|---------------|
| Primary colors | `bg-primary`, `text-primary` |
| Background | `bg-background`, `bg-card`, `bg-muted` |
| Text | `text-foreground`, `text-muted-foreground` |
| Borders | `border`, `border-input` |
| Radius | `rounded-sm`, `rounded-md`, `rounded-lg` |
| Shadows | `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg` |

Also maps Figma UI components to shadcn/ui equivalents (Button, Input, Dialog, Card, etc.).

### `figma-import.mdc`

Defines conventions for importing Figma designs:
- File naming: `kebab-case.tsx`
- Component naming: `PascalCase`
- Every component must accept `className` prop
- Every component must be responsive (320px to 1440px+)
- Every component must support dark mode
- Use CVA for variant-based styling

## Component Organization

```
src/components/
├── ui/          # shadcn/ui primitives (auto-generated, do not edit)
├── custom/      # Components from Figma UI kit or generated designs
├── layout/      # Header, Footer, MobileNav, ThemeToggle
├── animations/  # Animation wrappers
├── seo/         # JSON-LD, Breadcrumbs
├── chat/        # Chat widget
├── shop/        # E-commerce components
└── providers/   # Context providers
```

### When to Use shadcn/ui vs Custom

1. Check if shadcn/ui has the component (Button, Input, Card, Dialog, Select, Tabs, etc.)
2. If yes, use shadcn/ui and customize via `className` prop
3. If no, create in `src/components/custom/` following shadcn conventions

### Custom Component Template

```typescript
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  className?: string
  title: string
  subtitle: string
}

export function HeroSection({ className, title, subtitle }: HeroSectionProps) {
  return (
    <section className={cn('py-20 text-center', className)}>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
    </section>
  )
}
```

## Available AI Skills

| Skill | Trigger | Purpose |
|-------|---------|---------|
| implement-design | Figma URL provided | Translates Figma to code with 1:1 fidelity |
| design-iterator | "iterate on design" | Cycles of screenshot -> analyze -> improve |
| create-design-system-rules | "create design rules" | Generates project-specific rules from Figma |
| code-connect-components | "code connect" | Maps Figma components to React components |
| frontend-design | Building UI from scratch | Creates polished, non-generic interfaces |
| gemini-imagegen | "generate image" | Creates images from text prompts |

## Responsive Design Rules

- **Mobile-first**: write base styles for mobile, add `sm:`, `md:`, `lg:` for larger screens
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- **Navigation**: desktop uses inline nav links, mobile uses Sheet-based drawer (`mobile-nav.tsx`)
- **Grid layouts**: `grid-cols-1` on mobile, `sm:grid-cols-2`, `lg:grid-cols-3` or `lg:grid-cols-4`
- **Typography**: scale down headings on mobile (e.g., `text-3xl lg:text-5xl`)
- **Images**: always include `sizes` prop with breakpoints

## Dark Mode

- All colors use CSS variables defined in `src/styles/globals.css`
- Light mode: `:root { ... }`, Dark mode: `.dark { ... }`
- Toggle: `components/layout/theme-toggle.tsx` using `next-themes`
- Never use hardcoded colors (e.g., `bg-white`). Always use semantic classes (`bg-background`).
