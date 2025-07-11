# Abis Portfolio Website

Welcome! This is the codebase for the personal portfolio website of Syed Muhammad Abis, a game developer and creative technologist. This README will help you (or anyone in the future) understand, use, and extend this project—even if you're new to web development.

---

## 🚀 Live Demo
**View the live website:** [https://syedmuhammadabis.github.io/abis-portfolio/](https://syedmuhammadabis.github.io/abis-portfolio/)

---

## Table of Contents
1. [What is this project?](#what-is-this-project)
2. [Live Demo](#live-demo)
3. [Main Features](#main-features)
4. [Functionality Breakdown](#functionality-breakdown)
5. [How the Website is Structured](#how-the-website-is-structured)
6. [How to Add or Change Content](#how-to-add-or-change-content)
7. [How to Build, Deploy, or Host](#how-to-build-deploy-or-host)
8. [How to Optimize or Extend](#how-to-optimize-or-extend)
9. [Credits & Contact](#credits--contact)

---

## What is this project?
This is a modern, interactive portfolio website. It's designed to:
- Show off your projects, skills, and experience
- Look beautiful and work smoothly on both desktop and mobile
- Be easy to update, extend, and maintain

You can use it as a template for your own portfolio, or as a learning resource for modern web design.

---

## Functionality Breakdown

### Navigation
- **What it does:** Fixed navigation bar at the top with smooth scrolling to sections.
- **How it works:**
  - All nav links use anchor tags (`<a href="#section">`).
  - Smooth scroll is handled in `js/script.js` with an event listener on all anchor tags.
  - The navigation is responsive and collapses into a mobile menu on small screens.
- **How to customize:** Add or remove links in `index.html` under the `<nav>` section.

### Custom Cursor
- **What it does:** Replaces the default mouse cursor with a custom animated one (and a follower effect).
- **How it works:**
  - Implemented in `js/script.js` in the `initCustomCursor` function.
  - Uses two divs (`.cursor` and `.cursor-follower`) styled in CSS.
- **How to customize:** Change the style in `styles.css` or update the JS for different effects.

### Text Scramble Effect
- **What it does:** Animates your name and section titles with a "scrambling" text effect.
- **How it works:**
  - The `TextScramble` class in `js/script.js` handles the animation.
  - Phrases are set in the JS (e.g., your name, "Game Developer", etc.).
- **How to customize:** Edit the phrases in `js/script.js` where `TextScramble` is used.

### 3D Background (Desktop Only)
- **What it does:** Subtle, animated 3D models float in the background on desktop.
- **How it works:**
  - Uses Three.js, loaded in `js/script.js` (`initThreeBackground` function).
  - Models are in `assets/models/`.
  - Disabled on mobile for performance.
  - Uses dynamic path resolution for GitHub Pages compatibility (works both locally and when deployed).
- **How to customize:** Add or replace models in `assets/models/` and update the config in `js/script.js`.

### Particle Background
- **What it does:** Animated particles float in the background (always enabled, but fewer on mobile).
- **How it works:**
  - Implemented in `js/script.js` (`initParticleAnimation` function).
  - Uses a `<canvas>` element for rendering.
- **How to customize:** Change the number, color, or speed of particles in the JS.

### Modals (Projects & Skills)
- **What it does:** Clicking a project or skill card opens a modal with more info.
- **How it works:**
  - Project modals: See `initializeModals` in `js/script.js`.
  - Skill modals: See `initializeSkillPopups` in `js/script.js`.
  - Modal HTML is in `index.html` (look for `#project-modal` and `#skill-modal`).
  - Background scroll is prevented when modals are open for better UX.
- **How to customize:** Update the modal content in the JS data objects, or change the modal layout in the HTML.

### Volume Slider
- **What it does:** Lets users adjust the background music volume. Appears on hover/click.
- **How it works:**
  - The slider is in the nav bar (`index.html`), styled in `styles.css`.
  - JS logic in `js/script.js` shows/hides the slider and updates the audio volume.
- **How to customize:** Change the style in CSS, or adjust the show/hide logic in JS.

### Image Gallery (in Project Modals)
- **What it does:** Lets users view multiple screenshots for each project.
- **How it works:**
  - Images are listed in the `projectData` object in `js/script.js`.
  - The gallery uses WebP images if available, with fallback to JPEG/PNG.
  - Navigation arrows let users cycle through images.
- **How to customize:** Add more images to the `images` array for each project in the JS.

### Sound Effects
- **What it does:** Plays sounds for button clicks, navigation, and other actions.
- **How it works:**
  - The `playAudio` function in `js/script.js` handles all sound playback.
  - Audio files are in `assets/audio/`.
- **How to customize:** Add new audio files and call `playAudio('your_sound')` in the JS.

### Consent Overlay (for Music)
- **What it does:** Shows an overlay asking for permission to play background music (required by browsers).
- **How it works:**
  - The overlay is in `index.html` (`#audio-consent-overlay`).
  - Logic is in `js/script.js` (shows on page load, hides on consent).
- **How to customize:** Change the overlay text or style in HTML/CSS.

### Accessibility
- **What it does:** Ensures the site is usable by everyone, including keyboard and screen reader users.
- **How it works:**
  - All images have `alt` text.
  - Modals can be closed with the keyboard.
  - Buttons and links have clear focus states.
- **How to customize:** Add ARIA roles or further improve focus/keyboard handling in HTML/JS.

### Easter Eggs
- **What it does:** Typing certain codes (like "vapour" or "retro") changes the site's theme.
- **How it works:**
  - Logic is in `js/script.js` (look for the keydown event and theme change code).
- **How to customize:** Add more codes or effects in the JS.

### Performance
- **What it does:** Ensures the site loads fast and works well on all devices.
- **How it works:**
  - Images are optimized and use WebP where possible.
  - Audio is compressed for fast loading.
  - 3D and heavy animations are disabled on mobile.
- **How to customize:** Further compress images/audio, or tweak which features are enabled on mobile.

---

## Live Demo
**Live Website:** [https://syedmuhammadabis.github.io/abis-portfolio/](https://syedmuhammadabis.github.io/abis-portfolio/)

You can also deploy this site to [GitHub Pages](https://pages.github.com/) or any static web host. Just upload the files and you're live!

---

## Main Features

### 1. **Modern, Animated UI**
- Custom cursor, animated text, and smooth transitions
- 3D background models (on desktop only, for performance)
- Particle background for subtle movement

### 2. **Mobile-First, Responsive Design**
- The site looks and works great on phones, tablets, and desktops
- On mobile, heavy 3D backgrounds and animations are disabled for speed
- All buttons and links are easy to tap

### 3. **Projects Section**
- Each project is a card with a thumbnail and short description
- Click a card to open a modal with:
  - A longer description
  - An image gallery (uses WebP for speed, with fallback to JPEG/PNG)
  - A GIF demo (if available)
  - An embedded YouTube video (plays in the modal)
  - A "Watch on YouTube" button that opens the video in a new tab and plays a sound effect
- **Project Organization:** Each project has its own folder in `assets/projects/` containing all related images, GIFs, and assets

### 4. **Skills Section**
- All your skills are shown as cards with icons
- Click a skill to see a modal with a detailed description

### 5. **Audio**
- Background music (with user consent overlay, so it never autoplays without permission)
- Sound effects for button clicks and navigation
- A modern, glassy volume slider (easy to use on desktop and mobile)
- All audio files are optimized for fast loading (128kbps mono, originals preserved)

### 6. **Blog Section**
- Static cards for blog posts (add your own posts easily)

### 7. **Contact & Social Links**
- Easy-to-update links for email, GitHub, Fiverr, LinkedIn, YouTube, and more

### 8. **Accessibility & Feedback**
- All interactive elements (modals, buttons, sliders) are designed for accessibility
- Sound and visual feedback for user actions
- Keyboard navigation works for modals and navigation

### 9. **Easter Eggs**
- Type certain codes (like "vapour" or "retro") to unlock fun theme changes

---

## How the Website is Structured

### **Main Files**
- `index.html` — The main HTML file. This is the structure of your site.
- `styles.css` — All the CSS styles for the site. Includes custom scrollbars, glassy sliders, and responsive design.
- `js/script.js` — All the JavaScript for:
  - UI logic (modals, navigation, etc.)
  - Audio (music, sound effects, volume slider)
  - 3D backgrounds (Three.js, desktop only)
  - Image gallery and modal logic
  - Easter eggs and more

### **Assets**
- `assets/audio/` — All sound files (both original and optimized)
- `assets/projects/` — Individual project folders containing all related images, GIFs, and WebP versions
- `assets/models/` — 3D models for the animated background (desktop only)

### **Documentation**
- `README.md` — This file! Explains everything in detail.
- `folder-structure.txt` — A tree view of all files and folders in the project.

---

## How to Add or Change Content

### **Add a New Project**
1. Create a new folder in `assets/projects/` for your project (e.g., `assets/projects/my-new-project/`).
2. Add your images (JPG/PNG and WebP) and a GIF to the project folder.
3. In `js/script.js`, find the `projectData` object. Add a new entry for your project:
   ```js
   'my-new-project': {
     title: 'My New Project',
     description: 'A detailed description here...',
     images: [
       './assets/projects/my-new-project/my_new_project_gallery1.jpg',
       './assets/projects/my-new-project/my_new_project_screenshot1.jpg',
     ],
     gifUrl: './assets/projects/my-new-project/my_new_project_demo.gif',
     videoUrl: 'https://www.youtube.com/embed/your_video_id',
     youtubeUrl: 'https://youtu.be/your_video_id'
   }
   ```
4. Add a new project card in `index.html` (copy an existing one and update the `data-project-id` and image paths).

### **Add a New Skill**
1. In `js/script.js`, find the `skillData` object. Add a new entry:
   ```js
   myskill: {
     title: 'My Skill',
     description: 'What you do with this skill.'
   }
   ```
2. Add a new skill card in `index.html` (copy an existing one and update the `data-skill-id`).

### **Add a Blog Post**
- In `index.html`, copy a blog card and update the title, summary, and link.

### **Update Social Links**
- In `index.html`, find the "Contact" section and update the links as needed.

---

## How to Build, Deploy, or Host

### **For Development**
- You can open `index.html` directly in your browser to test locally.
- For best results (especially with audio and WebP), use a local server (like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VSCode, or `python -m http.server`).

### **For Deployment (e.g., GitHub Pages)**
- Push all your files to your GitHub repository.
- Enable GitHub Pages in your repo settings (set the source to the root or `/docs` folder).
- Your site will be live at `https://yourusername.github.io/your-repo/`.

---

## How to Optimize or Extend

### **Images**
- Use WebP for best performance. Keep JPEG/PNG as fallback.
- Use `loading="lazy"` for all images.

### **Audio**
- Use the provided optimized files for fast loading.
- If you add new sounds, optimize them with ffmpeg (128kbps mono is a good default).

### **3D Backgrounds**
- Only enabled on desktop for performance. To add new models, put them in `assets/models/` and update the Three.js config in `js/script.js`.

### **Accessibility**
- All images have `alt` text.
- All modals and buttons are keyboard accessible.
- Sound and visual feedback for all major actions.

### **Customizing Styles**
- All styles are in `styles.css`. Use CSS variables for colors and themes.
- Custom scrollbars and sliders are styled for a modern, glassy look.

### **Easter Eggs**
- You can add more keyboard codes in `js/script.js` for fun theme changes or surprises.

---

## Credits & Contact
- Designed and developed by Syed Muhammad Abis.
- 3D models, images, and audio are either original or credited in their respective folders.
- For questions, contact: [blacknwhite482@gmail.com](mailto:blacknwhite482@gmail.com)

---

## For Future Developers or AI
- This README and `folder-structure.txt` will help you quickly understand the project's layout and logic.
- All major features and customizations are handled in `js/script.js` and `styles.css`.
- For any new features, follow the modular and clean style already present in the codebase.
- If you're ever lost, just read through this README and the comments in the code! 