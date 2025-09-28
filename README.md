# CodeCoach - Programming Learning Platform

A beautiful, dark-first coding learning platform built with React, TypeScript, and Tailwind CSS. Features interactive playgrounds for Python, SQL, C/C++, and Java with a polished UI inspired by Codewars.

## Features

- 🌙 **Dark-first design** with excellent light mode support
- 🏃‍♂️ **Interactive playgrounds** for 4 programming languages
- 📚 **Learning paths** with structured curricula
- 🎯 **Practice exercises** with difficulty filtering
- 👥 **Community features** with discussions and leaderboards
- 📊 **Progress tracking** with achievements and analytics
- 📖 **Comprehensive documentation** and tutorials

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:8080`

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** components for consistent UI
- **React Router** for client-side routing
- **Lucide React** for icons

## Design System

The app uses a comprehensive design system with:
- HSL color tokens for consistent theming
- Custom button variants (hero, pill, success, warning)
- Difficulty badges with semantic colors
- Gradient backgrounds and smooth transitions
- Professional typography and spacing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── navigation/     # Navigation components
│   └── ...
├── pages/              # Route components
│   ├── playground/     # Language playground pages
│   └── ...
└── lib/                # Utilities and helpers
```

## License

MIT