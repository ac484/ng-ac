# TECHNICAL CONTEXT

## Technology Stack Analysis

### Frontend Framework
- **Next.js 15:** Latest version with app router
- **React:** Modern React with hooks and functional components
- **TypeScript:** Full TypeScript implementation

### Backend & Services
- **Firebase:** Complete Firebase integration
  - Firestore for database
  - Authentication
  - Storage
  - Hosting
- **Vercel:** Deployment platform

### UI & Styling
- **Tailwind CSS:** Utility-first CSS framework
- **PostCSS:** CSS processing
- **shadcn/ui:** Component library
- **Custom Components:** Extensive custom component library

### Build & Development Tools
- **Webpack:** Custom webpack configuration
- **Vite:** Alternative build tool
- **ESLint:** Code quality
- **Prettier:** Code formatting
- **Husky:** Git hooks

### Package Management
- **Yarn:** Primary package manager (as per user rules)
- **pnpm:** Alternative lock file present

## Architecture Patterns

### File Structure
```
src/
├── app/           # Next.js app router
├── components/    # Reusable UI components
├── features/      # Business logic modules
├── lib/          # Utilities and configurations
├── types/        # TypeScript definitions
└── hooks/        # Custom React hooks
```

### Feature-Based Architecture
Each business module is self-contained with:
- Components
- Hooks
- Services
- Types
- Index exports

### Component Architecture
- Atomic design principles
- Reusable UI components
- Theme-aware components
- Responsive design

## Development Environment

### Platform Specifics
- **OS:** Windows 11
- **Shell:** PowerShell
- **Path Separator:** Backslash (\)
- **Package Manager:** Yarn

### Build Configuration
- Next.js configuration with TypeScript
- Custom webpack setup
- Environment variable management
- Firebase configuration

## Dependencies & Versions

### Core Dependencies
- Next.js 15
- React 18+
- TypeScript 5+
- Firebase SDK

### Development Dependencies
- ESLint
- Prettier
- Husky
- PostCSS
- Tailwind CSS

## Configuration Files
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `webpack.config.js` - Custom webpack setup
- `firebase.json` - Firebase configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier configuration