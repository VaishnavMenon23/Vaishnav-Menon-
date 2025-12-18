# SETUP INSTRUCTIONS

## Prerequisites
You need Node.js 16+ and npm installed on your system.

### Check if Node.js is installed:
```powershell
node --version
npm --version
```

### If NOT installed:
Download from: https://nodejs.org/en/ (LTS version recommended)

## Installation Steps

### 1. Install Dependencies
Open Terminal/PowerShell in the project folder and run:
```powershell
npm install
```

This will install:
- React 18
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React Icons
- TypeScript & Vite

### 2. Start Development Server
```powershell
npm run dev
```

The site will open at: `http://localhost:3000`

### 3. Customize Your Portfolio
Edit `src/data/portfolioData.ts` with your content:
- Update hero section (name, title, tagline)
- Modify skills (add/remove categories and proficiencies)
- Add your projects
- Update experience, certifications, education
- Change contact information

### 4. Build for Production
```powershell
npm run build
```

Output will be in the `dist/` folder.

## Deployment Options

### Vercel (Recommended - easiest)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Auto-deploys on every push

### Azure Static Web Apps
1. Create Azure account
2. Deploy from GitHub Actions workflow
3. Connected to your GitHub repo

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in Settings
3. Deploy `dist/` folder

## Features Included

✅ Dark/Light Theme Toggle
✅ Project Search & Filtering
✅ Responsive Mobile Design
✅ Smooth Animations
✅ Microsoft-style Design
✅ Accessible (WCAG AA)
✅ Print-optimized CV view
✅ SEO optimized

## Support

For issues, check:
- README.md for documentation
- src/data/portfolioData.ts for content structure
- tailwind.config.js for color customization

---

**Next**: Install Node.js, then run `npm install` && `npm run dev`
