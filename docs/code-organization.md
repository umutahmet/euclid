# Code Organization Reference

This document outlines the organization structure following DRY and KISS principles.

## Directory Structure

```
src/
├── types/                    # Type definitions
│   ├── canvas.ts            # Canvas-related types
│   └── index.ts             # Centralized type exports
├── lib/
│   ├── constants/           # Constants and configuration
│   │   └── canvas.ts        # Canvas styling and labels
│   ├── data/                # Static/mock data
│   │   └── canvas-mock.ts   # Sample canvas nodes and links
│   ├── canvas-utils.ts      # Canvas utility functions
│   └── utils.ts             # General utilities (existing)
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── Toolbar.tsx          # Shared components
├── canvas/                  # Canvas feature module
│   ├── CanvasOverview.tsx
│   └── NodeDetailDrawer.tsx
└── journal/                 # Journal feature module
    └── JournalingEditor.tsx
```

## Import Patterns

### Types

```typescript
import type { CanvasNode, CanvasLink, CanvasNodeType } from "@/types/canvas";
// or
import type { CanvasNode } from "@/types/index";
```

### Constants

```typescript
import {
  nodePalette,
  nodeTypeLabels,
  nodeTypeColors,
} from "@/lib/constants/canvas";
```

### Static Data

```typescript
import { sampleNodes, sampleLinks } from "@/lib/data/canvas-mock";
```

### Utilities

```typescript
import {
  createNodeMap,
  getSourceNodes,
  getDerivedNodes,
} from "@/lib/canvas-utils";
```

## Key Principles

### DRY (Don't Repeat Yourself)

- **Types**: All shared types defined once in `src/types/`
- **Constants**: Visual styles and labels in `src/lib/constants/`
- **Data**: Mock/static data in `src/lib/data/`
- **Logic**: Reusable functions in `src/lib/`

### KISS (Keep It Simple, Stupid)

- **Single Responsibility**: Each file has one clear purpose
- **Explicit Imports**: Import exactly what you need
- **Simple Functions**: Small, focused utility functions
- **Clear Naming**: Descriptive names for files and exports

## Benefits

1. **Reusability**: Types and utilities can be used across features
2. **Maintainability**: Change once, affect everywhere
3. **Testability**: Pure utility functions are easy to test
4. **Clarity**: Clear separation of concerns
5. **Scalability**: Easy to add new features following the same pattern
