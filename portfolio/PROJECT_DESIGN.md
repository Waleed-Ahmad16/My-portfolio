# Portfolio Project Design

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── [dynamic]/                # Dynamic routes
│
├── components/                   # Reusable React components
│   ├── common/                   # Global, reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Loader.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   │
│   └── sections/                 # Page section components
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Projects.tsx
│       ├── Experience.tsx
│       ├── Skills.tsx
│       └── Contact.tsx
│
├── pages/                        # Custom page components (if needed)
│
├── styles/                       # Global styles
│   ├── globals.css              # Global CSS
│   ├── variables.css            # CSS variables
│   └── mixins.css               # Reusable CSS mixins
│
├── lib/                          # Utility functions and helpers
│   ├── utils/                    # Helper functions
│   │   ├── cn.ts                # Class name utility
│   │   ├── formatters.ts        # Data formatting
│   │   └── validators.ts        # Form validation
│   │
│   └── constants/               # Application constants
│       ├── navigation.ts        # Navigation config
│       ├── projects.ts          # Projects data
│       └── social.ts            # Social links
│
├── types/                        # TypeScript type definitions
│   ├── project.ts
│   ├── experience.ts
│   └── index.ts
│
├── hooks/                        # Custom React hooks
│   ├── useScrollPosition.ts
│   ├── useMediaQuery.ts
│   └── useFetch.ts
│
└── config/                       # Configuration files
    ├── site.config.ts           # Site metadata
    └── theme.config.ts          # Theme configuration
```

## File Organization Principles

### 1. **Atomic Components** (common/)
- Small, focused, single-responsibility components
- Highly reusable across the application
- Examples: Button, Card, Badge, Loader

### 2. **Layout Components** (layout/)
- Page structure and navigation components
- Header, Footer, Sidebar, Navigation
- Typically used in root layout

### 3. **Section Components** (sections/)
- Domain-specific page sections
- Hero, About, Projects, Experience, Skills, Contact
- Can contain multiple common components

### 4. **Utilities & Constants**
- Pure functions for common operations
- Configuration and constant data
- Type-safe and reusable

### 5. **Custom Hooks** (hooks/)
- Encapsulate stateful logic
- Share behavior across components
- Examples: scroll tracking, media queries

## Naming Conventions

- **Components**: PascalCase (e.g., `Header.tsx`, `ProjectCard.tsx`)
- **Files**: PascalCase for components, camelCase for utils/hooks
- **Types**: PascalCase with descriptive names (e.g., `Project`, `Experience`)
- **CSS Classes**: kebab-case (e.g., `hero-section`, `project-card`)

## Best Practices

✅ **Do**
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use TypeScript for type safety
- Organize by feature/domain, not by file type
- Keep styling close to components (CSS Modules or Tailwind)

❌ **Don't**
- Create deeply nested folder structures
- Mix concerns in a single component
- Use inline styles for complex styling
- Create files you're not using

## Quick Reference

| Directory | Purpose | File Types |
|-----------|---------|-----------|
| `components/common` | Reusable UI atoms | `.tsx` |
| `components/layout` | Page layout | `.tsx` |
| `components/sections` | Page sections | `.tsx` |
| `lib/utils` | Helper functions | `.ts` |
| `lib/constants` | App data & config | `.ts` |
| `types` | TypeScript definitions | `.ts` |
| `hooks` | Custom React hooks | `.ts` |
| `styles` | Global styles | `.css` |
| `config` | App configuration | `.ts` |

