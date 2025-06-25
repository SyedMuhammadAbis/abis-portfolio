# Abis Portfolio

This is a modern, interactive portfolio website for Syed Muhammad Abis, a game developer and creative technologist. The site showcases projects, skills, blog posts, and more, with a focus on animation, interactivity, and a clean, professional design.

## Features
- **Animated, modern UI** with custom cursor, text scramble, and 3D background models (Three.js, desktop only)
- **Mobile optimized:**
  - 3D backgrounds and heavy desktop-only animations are disabled on mobile for performance
  - Only lightweight particle animation runs on mobile
  - Fully responsive layout and touch-friendly controls
- **Projects section** with modal popups for each project, including:
  - Rich descriptions
  - Image gallery (WebP with fallback)
  - GIF and YouTube video showcase (embedded and with external link)
- **Skills section** with compact cards and modal popups for detailed skill descriptions
- **Audio**: Background music with user consent overlay, sound effects, and a modern volume slider
- **Audio optimized:** All audio files are available in 128kbps mono for fast loading (originals preserved)
- **Custom volume slider**: Glassy, accent-colored, and easy to use
- **Responsive design**: Works on desktop and mobile
- **Static blog section**: Cards for each post (not dynamic)
- **Easter eggs**: Fun theme changes via keyboard codes
- **Social/contact links**: Modern, accessible, and easy to update

## Folder Structure
See `folder-structure.txt` for a detailed breakdown of all files and folders.

## How to Use/Extend
- **Main files:**
  - `index.html`: Main HTML structure
  - `styles.css`: All site styles (including custom scrollbars and sliders)
  - `js/script.js`: All JavaScript (UI logic, modals, audio, 3D, etc.)
- **Assets:**
  - `assets/audio/`: All sound files (optimized and original)
  - `assets/images/projects/`: Project images and GIFs (WebP + fallback)
  - `assets/models/`: 3D models for background animation (desktop only)
- **Modals:**
  - Project and skill modals are populated from JS data objects. To add or update content, edit the relevant objects in `js/script.js`.
- **Volume Slider:**
  - Fully custom, glassy, and accent-colored. Controlled via JS for smooth UX.
- **3D Background:**
  - Uses Three.js to render subtle, animated models in the background (desktop only).
  - Disabled on mobile for performance.

## Development
- Uses Node.js tooling (see `package-lock.json` and `node_modules/`), mainly for CSS processing (Tailwind, PostCSS, etc.).
- For deployment, only the static files (`index.html`, `styles.css`, `js/script.js`, and `assets/`) are needed.

## Customization
- **To add a new project:**
  1. Add images and a GIF to `assets/images/projects/` (convert to WebP for best performance).
  2. Update the `projectData` object in `js/script.js` with the new project info, images, GIF, and video link.
- **To add a new skill:**
  1. Update the `skillData` object in `js/script.js`.
- **To change background models:**
  1. Add or replace models in `assets/models/` and update the Three.js config in `js/script.js`.

## Credits
- Designed and developed by Syed Muhammad Abis.
- 3D models, images, and audio are either original or credited in their respective folders.

---

**For future developers or AI:**
- This README and `folder-structure.txt` will help you quickly understand the project's layout and logic.
- All major features and customizations are handled in `js/script.js` and `styles.css`.
- For any new features, follow the modular and clean style already present in the codebase. 