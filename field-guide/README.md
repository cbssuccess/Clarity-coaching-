# The Field Guide

Application shell for The Field Guide, an editorial research tool. The shell
(routing, theming, toasts, tooltips, error handling) stays intentionally
quiet so the editorial content is the focus.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- [wouter](https://github.com/molefrog/wouter) for routing
- shadcn/ui-style components (`sonner` toaster, Radix tooltip)

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint      # run oxlint
```

## Structure

- `src/App.tsx` — application shell: error boundary, theme provider, tooltip
  provider, toaster, and router
- `src/pages/` — routed pages (`Home`, `NotFound`)
- `src/contexts/ThemeContext.tsx` — light/dark/system theme state
- `src/components/ErrorBoundary.tsx` — top-level error boundary
- `src/components/ui/` — shared UI primitives
