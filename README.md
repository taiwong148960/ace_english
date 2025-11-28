# AceEnglish - Learn English The IELTS Way

A Chrome extension for IELTS English learning, built with Plasmo, React, Tailwind CSS, and shadcn/ui.

## Features

- 📊 **Dashboard** - Track your learning progress with visual statistics
- 🎯 **Goal Setting** - Set your target IELTS band score
- 📚 **Practice Tasks** - Daily inflection tasks for all IELTS skills
- 📈 **Skills Breakdown** - Monitor your progress across Listening, Reading, Writing, and Speaking
- 🌍 **Internationalization** - Support for English and Chinese languages
- 🎨 **Modern UI** - Clean, professional design following best practices

## Tech Stack

- **Framework:** [Plasmo](https://plasmo.com/) - The Browser Extension Framework
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Internationalization:** i18next + react-i18next
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

The extension will auto-reload when you make changes. Load the extension in Chrome:

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `build/chrome-mv3-dev` folder

### Building for Production

```bash
# Build the extension
npm run build

# Package for distribution
npm run package
```

## Project Structure

```
ace_english/
├── assets/               # Static assets (icons)
├── background.ts         # Service worker for extension events
├── tabs/
│   └── dashboard.tsx     # Main dashboard tab entry point
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── layout/       # Layout components (Sidebar, Header)
│   │   └── dashboard/    # Dashboard-specific components
│   ├── i18n/
│   │   ├── locales/      # Translation files (en.json, zh.json)
│   │   └── index.ts      # i18n configuration
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── pages/
│   │   └── Dashboard.tsx # Dashboard page component
│   ├── services/
│   │   ├── types.ts      # TypeScript type definitions
│   │   ├── mock-data.ts  # Mock data for development
│   │   └── api.ts        # API service layer
│   └── styles/
│       └── globals.css   # Global styles and Tailwind config
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

## Design System

The extension follows a comprehensive design system defined in `tailwind.config.js`:

- **Primary Color:** #0E7569 (Deep Teal)
- **Typography:** Inter font family
- **Border Radius:** 6px (small), 12px (medium), 16px (large)
- **Shadows:** Subtle card shadows for depth

## Architecture

### SOLID Principles

- **Single Responsibility:** Each component handles one specific concern
- **Open/Closed:** Components are extensible through props
- **Liskov Substitution:** UI components follow consistent interfaces
- **Interface Segregation:** API services are split by domain
- **Dependency Inversion:** Services abstract backend implementation

### Mock Data Support

The API layer supports mock data for development:

```typescript
import { configureApi } from '~/services/api'

// Use mock data (default)
configureApi({ useMock: true })

// Use real backend
configureApi({ useMock: false, baseUrl: 'https://api.example.com' })
```

## Internationalization

Supported languages:
- English (en)
- Chinese (zh)

Add new languages by:
1. Create a new JSON file in `src/i18n/locales/`
2. Add the language to `SUPPORTED_LANGUAGES` in `src/i18n/index.ts`

## License

MIT

