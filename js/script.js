/*
    Syed Muhammad Abis - Game Developer Portfolio
    Refactored JavaScript
    Date: 2024-07-08
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Global State & Initial Setup ---
const state = {
        theme: localStorage.getItem('theme') || 'dark',
    isMusicPlaying: false,
        isMobile: /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768,
    };

    const audioCache = {};

    function setupInitialTheme() {
        document.body.setAttribute('data-theme', state.theme);
    }

    // --- Audio Handling ---
    function playAudio(soundName, volume = 0.5) {
        if (!audioCache[soundName]) {
            const audio = new Audio(`./assets/audio/${soundName}.mp3`);
        audio.volume = volume;
            audioCache[soundName] = audio;
        }
        audioCache[soundName].currentTime = 0;
        audioCache[soundName].play().catch(err => {
            console.error(`Could not play audio "${soundName}":`, err);
        });
    }
    
    // --- Core Initializations ---
    setupInitialTheme();
    
    // --- Event Listeners ---
    
    // 1. Audio Consent Overlay
    const audioOverlay = document.getElementById('audio-consent-overlay');
    const enterButton = document.getElementById('enter-site-btn');
    const bgMusic = new Audio('./assets/audio/bg_music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3; // Start with a lower volume

    if (audioOverlay && enterButton) {
        enterButton.addEventListener('click', () => {
            bgMusic.play().catch(err => console.error("Autoplay failed:", err));
            state.isMusicPlaying = true;
            
            const musicToggle = document.getElementById('music-toggle');
            if (musicToggle) musicToggle.setAttribute('data-playing', 'true');

            audioOverlay.classList.add('hidden');
        });
    }

    // 2. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
            document.body.setAttribute('data-theme', state.theme);
            playAudio('button_click');
        });
    }

    // 3. Music Toggle
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
                if (state.isMusicPlaying) {
                    bgMusic.pause();
                } else {
                bgMusic.play().catch(err => console.error("BG music failed:", err));
            }
                state.isMusicPlaying = !state.isMusicPlaying;
            musicToggle.setAttribute('data-playing', state.isMusicPlaying);
            playAudio('button_click');
        });
    }

    // Volume Slider Logic
    const musicVolumeSlider = document.getElementById('music-volume-slider');
    const musicControlWrapper = document.querySelector('.music-control-wrapper');
    let sliderHideTimeout = null;
    if (musicVolumeSlider && musicControlWrapper) {
        // Set slider to current volume on load
        musicVolumeSlider.value = bgMusic.volume;
        // Update volume in real time
        musicVolumeSlider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            bgMusic.volume = vol;
        });
        // Show slider on mouseenter
        musicControlWrapper.addEventListener('mouseenter', () => {
            if (sliderHideTimeout) clearTimeout(sliderHideTimeout);
            musicControlWrapper.classList.add('show-slider');
            musicControlWrapper.classList.remove('hiding-slider');
        });
        // Hide slider after delay on mouseleave
        musicControlWrapper.addEventListener('mouseleave', () => {
            sliderHideTimeout = setTimeout(() => {
                musicControlWrapper.classList.remove('show-slider');
                musicControlWrapper.classList.add('hiding-slider');
                setTimeout(() => {
                    musicControlWrapper.classList.remove('hiding-slider');
                }, 250); // match the CSS transition duration
            }, 1000); // 1 second delay
        });
        // If mouse enters slider directly, cancel hide
        musicVolumeSlider.addEventListener('mouseenter', () => {
            if (sliderHideTimeout) clearTimeout(sliderHideTimeout);
            musicControlWrapper.classList.add('show-slider');
            musicControlWrapper.classList.remove('hiding-slider');
        });
        // If mouse leaves slider, start hide timer
        musicVolumeSlider.addEventListener('mouseleave', () => {
            sliderHideTimeout = setTimeout(() => {
                musicControlWrapper.classList.remove('show-slider');
                musicControlWrapper.classList.add('hiding-slider');
                setTimeout(() => {
                    musicControlWrapper.classList.remove('hiding-slider');
                }, 250);
            }, 1000);
        });
    }

    // 4. Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            playAudio('nav_hover');
        });
    });

    // 5. Scroll-based Animations
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (!state.isMobile) {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
        } else {
        // On mobile, just make them visible without the animation
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('is-visible');
        });
    }

    // 6. Game Showcase Logic
    const modelViewerCanvas = document.getElementById('modelViewer');
    if (modelViewerCanvas) {
        // Basic placeholder logic. For a full implementation, a 3D library like Three.js is needed.
        const modelControls = document.querySelectorAll('.model-control-btn');
        modelControls.forEach(btn => {
            btn.addEventListener('click', () => {
                const modelName = btn.dataset.model;
                console.log(`Switching to model: ${modelName}`);
                // Add your 3D model switching logic here
                modelControls.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    const playDemoBtn = document.querySelector('.play-demo-btn');
    if (playDemoBtn) {
        playDemoBtn.addEventListener('click', () => {
            const demoOverlay = document.querySelector('.demo-overlay');
            const gameDemo = document.getElementById('gameDemo');
            if (demoOverlay) demoOverlay.classList.add('hidden');
            if (gameDemo) {
                // Replace with your actual game embed URL
                gameDemo.src = 'https://itch.io/embed-upload/your-game-id?dark=true'; 
            }
        });
    }

    // 7. Text Scramble Effect
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => (this.resolve = resolve));
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

        const animatedName = document.getElementById('animated-name');
    if (animatedName && !state.isMobile) {
        const fx = new TextScramble(animatedName);
        const phrases = [
            "Syed Muhammad Abis",
            "Game Developer",
            "Unity Specialist",
            "Creative Coder"
        ];
        let counter = 0;
        const next = () => {
            fx.setText(phrases[counter]).then(() => {
                setTimeout(next, 3000); // Wait 3 seconds before next text
            });
            counter = (counter + 1) % phrases.length;
        };
        setTimeout(next, 1000); // Initial delay
    }

    // 8. Custom Cursor Logic
    function initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (!cursor || !follower) return;

        let mouseX = 0, mouseY = 0;
        let posX = 0, posY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            posX += (mouseX - posX) * 0.2;
            posY += (mouseY - posY) * 0.2;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursor.style.transform = `translate(${posX}px, ${posY}px)`;
            follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            
            requestAnimationFrame(animate);
        };

        animate();

        // Add hover effect for interactive elements
        document.querySelectorAll('a, button, .modern-btn, .info-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.width = '45px';
                follower.style.height = '45px';
                follower.style.backgroundColor = 'rgba(139, 92, 246, 0.4)';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.width = '30px';
                follower.style.height = '30px';
                follower.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
            });
        });
    }

    // 9. 3D Card Tilt Effect
    function initCardTiltEffect() {
        const cards = document.querySelectorAll('.info-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                const tiltX = deltaY * -10; // Max tilt 10 degrees
                const tiltY = deltaX * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
    
    // 10. Background Particle Animation
    function initParticleAnimation(particleCount) {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

            const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
                ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
                ctx.lineWidth = 2;
                    ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        createParticles();
        window.addEventListener('resize', createParticles);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    // --- Modal & Popup Initializers ---
    function initializeModals() {
        // --- Project Modal Logic ---
        const projectData = {
            'pickle-former': {
                title: 'Pickle Former',
                description: `<strong>Genre:</strong> 3D Action-Platformer<br><p>Play as a mad scientist's escaped creation in this quirky adventure. <br><br><strong>Features:</strong> <ul><li>Physics-based puzzles</li><li>Unique transformation mechanics</li><li>Boss battles and secret areas</li></ul><br>Embark on a journey of self-discovery and chaos as you outsmart your creator and the world!</p>`,
                images: [
                    './assets/images/projects/pickle_former_gallery1.jpg',
                    './assets/images/projects/pickle_former_screenshot1.jpg',
                    './assets/images/projects/pickle_former_screenshot2.jpg',
                ],
                gifUrl: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
                videoUrl: 'https://www.youtube.com/embed/Pbc1k6cM2aI',
                youtubeUrl: 'https://youtu.be/Pbc1k6cM2aI?si=qIuXj4V_PXAUNi3o'
            },
            'one-minute-drift': {
                title: 'One Minute Drift',
                description: `<strong>Genre:</strong> Arcade Racing<br><p>A fast-paced arcade drifting game. <br><br><strong>Features:</strong> <ul><li>One-minute time attack</li><li>Global leaderboards</li><li>Stylish low-poly visuals</li></ul><br>Master the art of drifting and climb the ranks in this addictive score-chaser!</p>`,
                images: [
                    './assets/images/projects/one_minute_drift_gallery1.jpg',
                    './assets/images/projects/one_minute_drift_screenshot1.jpg',
                    './assets/images/projects/one_minute_drift_screenshot2.jpg',
                ],
                gifUrl: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
                videoUrl: 'https://www.youtube.com/embed/Pbc1k6cM2aI',
                youtubeUrl: 'https://youtu.be/Pbc1k6cM2aI?si=qIuXj4V_PXAUNi3o'
            },
            'baqra-surfer': {
                title: 'Baqra Surfer',
                description: `<strong>Genre:</strong> Endless Runner<br><p>Help a goat surf through a hazardous river.<br><br><strong>Features:</strong> <ul><li>Procedurally generated obstacles</li><li>Power-ups and upgrades</li><li>Chill synthwave soundtrack</li></ul><br>How far can you surf before the river claims you?</p>`,
                images: [
                    './assets/images/projects/baqra_surfer_gallery1.jpg',
                    './assets/images/projects/baqra_surfer_screenshot1.jpg',
                    './assets/images/projects/baqra_surfer_screenshot2.jpg',
                ],
                gifUrl: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
                videoUrl: 'https://www.youtube.com/embed/Pbc1k6cM2aI',
                youtubeUrl: 'https://youtu.be/Pbc1k6cM2aI?si=qIuXj4V_PXAUNi3o'
            },
            'aesthetic-cube': {
                title: 'Aesthetic Cube',
                description: `<strong>Genre:</strong> Puzzle<br><p>A relaxing puzzle game about manipulating a 3D cube to match patterns.<br><br><strong>Features:</strong> <ul><li>Minimalist visuals</li><li>Soothing sound design</li><li>Hundreds of handcrafted levels</li></ul><br>Unwind and challenge your mind with beautiful, meditative puzzles.</p>`,
                images: [
                    './assets/images/projects/aesthetic_cube_gallery1.jpg',
                    './assets/images/projects/aesthetic_cube_screenshot1.jpg',
                    './assets/images/projects/aesthetic_cube_screenshot2.jpg',
                ],
                gifUrl: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
                videoUrl: 'https://www.youtube.com/embed/Pbc1k6cM2aI',
                youtubeUrl: 'https://youtu.be/Pbc1k6cM2aI?si=qIuXj4V_PXAUNi3o'
            },
            'cartoon-defence': {
                title: 'Cartoon Defence',
                description: `<strong>Genre:</strong> Tower Defense<br><p>A tower defense game with a unique cartoon art style and quirky enemies.<br><br><strong>Features:</strong> <ul><li>Dozens of towers and upgrades</li><li>Challenging boss waves</li><li>Hand-drawn animations</li></ul><br>Defend your base with strategy and style!</p>`,
                images: [
                    './assets/images/projects/cartoon_defence_gallery1.jpg',
                    './assets/images/projects/cartoon_defence_screenshot1.jpg',
                    './assets/images/projects/cartoon_defence_screenshot2.jpg',
                ],
                gifUrl: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
                videoUrl: 'https://www.youtube.com/embed/Pbc1k6cM2aI',
                youtubeUrl: 'https://youtu.be/Pbc1k6cM2aI?si=qIuXj4V_PXAUNi3o'
            },
            'rainbow-rollie': {
                title: 'Rainbow Rollie',
                description: `<strong>Genre:</strong> Physics-Platformer<br><p>Roll your way through colorful levels.<br><br><strong>Features:</strong> <ul><li>Physics-based puzzles</li><li>Vibrant, dynamic environments</li><li>Hidden collectibles</li></ul><br>Test your skills and reflexes in this joyful platformer adventure!</p>`,
                images: [
                    './assets/images/projects/rainbow_rollie_gallery1.jpg',
                    './assets/images/projects/rainbow_rollie_screenshot1.jpg',
                    './assets/images/projects/rainbow_rollie_screenshot2.jpg',
                ],
                gifUrl: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
                videoUrl: 'https://www.youtube.com/embed/Pbc1k6cM2aI',
                youtubeUrl: 'https://youtu.be/Pbc1k6cM2aI?si=qIuXj4V_PXAUNi3o'
            }
        };

        const modal = document.getElementById('project-modal');
        const closeModalBtn = document.getElementById('close-project-modal');
        const modalTitle = document.getElementById('modal-project-title');
        const modalDesc = document.getElementById('modal-project-description');
        const modalImg = document.getElementById('modal-project-img');
        const modalPrev = document.getElementById('modal-prev-img');
        const modalNext = document.getElementById('modal-next-img');
        const modalVideo = document.getElementById('modal-project-video');
        const modalYTLink = document.getElementById('modal-project-ytlink');
        const modalGif = document.getElementById('modal-project-gif');

        let currentProject = null;
        let currentImgIndex = 0;
        let projectImageCache = {};

        function preloadProjectImages(projectId) {
            const data = projectData[projectId];
            if (!data || !data.images) return;
            if (!projectImageCache[projectId]) projectImageCache[projectId] = [];
            data.images.forEach((src, idx) => {
                if (!projectImageCache[projectId][idx]) {
                    const img = new Image();
                    img.src = src;
                    projectImageCache[projectId][idx] = img;
                }
            });
        }

        function openProjectModal(projectId) {
            const data = projectData[projectId];
            if (!data) return;
            currentProject = projectId;
            currentImgIndex = 0;
            preloadProjectImages(projectId);
            modalTitle.textContent = data.title;
            modalDesc.innerHTML = data.description;
            showModalImg(0);
            // Show GIF if present
            if (data.gifUrl) {
                modalGif.innerHTML = `<img src='${data.gifUrl}' alt='Project GIF' style='max-width:100%;border-radius:0.5rem;box-shadow:0 2px 10px rgba(0,0,0,0.15);margin-bottom:1rem;'>`;
            } else {
                modalGif.innerHTML = '';
            }
            // Embed YouTube video
            if (data.videoUrl) {
                modalVideo.innerHTML = `<iframe width='100%' height='240' src='${data.videoUrl}' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>`;
                modalYTLink.href = data.youtubeUrl || data.videoUrl;
                modalYTLink.style.display = 'block';
            } else {
                modalVideo.innerHTML = '';
                modalYTLink.style.display = 'none';
            }
            modal.classList.remove('hidden');
        }

        function closeProjectModal() {
            modal.classList.add('hidden');
        }

        function showModalImg(index) {
            const data = projectData[currentProject];
            if (!data || !data.images) return;
            currentImgIndex = (index + data.images.length) % data.images.length;
            let imgSrc = data.images[currentImgIndex];
            // Try to use .webp if available
            const webpSrc = imgSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            // Check if .webp exists by preloading
            const testImg = new Image();
            testImg.onload = function() {
                modalImg.src = webpSrc;
            };
            testImg.onerror = function() {
                modalImg.src = imgSrc;
            };
            testImg.src = webpSrc;
        }

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', e => {
                playAudio('button_click');
                const projectId = card.getAttribute('data-project-id');
                if (projectId) {
                    openProjectModal(projectId);
                }
        });
    });

        if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
            playAudio('button_click');
            closeProjectModal();
        });
        if (modalPrev) modalPrev.addEventListener('click', () => {
            playAudio('button_click');
            showModalImg(currentImgIndex - 1);
        });
        if (modalNext) modalNext.addEventListener('click', () => {
            playAudio('button_click');
            showModalImg(currentImgIndex + 1);
        });
        if (modal) modal.addEventListener('click', e => {
            if (e.target === modal) closeProjectModal();
        });

        if (modalYTLink) {
            modalYTLink.addEventListener('click', (e) => {
                e.preventDefault();
                playAudio('button_click');
                if (modalYTLink.href) {
                    window.open(modalYTLink.href, '_blank', 'noopener');
                }
            });
        }
    }

    function initializeSkillPopups() {
        const skillData = {
            unity3d: {
                title: 'Unity 3D',
                description: 'Expert in Unity engine for 2D/3D games, rapid prototyping, and cross-platform deployment.'
            },
            csharp: {
                title: 'C#',
                description: 'Advanced C# scripting for gameplay, tools, and editor extensions in Unity.'
            },
            cplusplus: {
                title: 'C++',
                description: 'Performance-focused code for engines, plugins, and game logic.'
            },
            modeling: {
                title: '3D Modeling',
                description: 'Asset creation in Blender/Maya for games, including props, environments, and characters.'
            },
            gamedesign: {
                title: 'Game Design',
                description: 'Level design, mechanics, and player experience balancing.'
            },
            vrar: {
                title: 'VR/AR Development',
                description: 'Immersive experiences for Oculus, SteamVR, and AR platforms.'
            },
            uiux: {
                title: 'UI/UX Design',
                description: 'Intuitive interfaces and user flows for games and apps.'
            },
            git: {
                title: 'Git',
                description: 'Version control, branching, and team collaboration.'
            },
            shader: {
                title: 'Shader Programming',
                description: 'Custom HLSL/GLSL shaders for unique visual effects.'
            },
            ai: {
                title: 'Game AI',
                description: 'Pathfinding, enemy behaviors, and decision systems.'
            },
            optimization: {
                title: 'Optimization',
                description: 'Profiling and performance tuning for smooth gameplay.'
            },
            agile: {
                title: 'Agile/Scrum',
                description: 'Project management, sprints, and iterative development.'
            }
        };

        const skillModal = document.getElementById('skill-modal');
        const closeSkillModalBtn = document.getElementById('close-skill-modal');
        const modalSkillTitle = document.getElementById('modal-skill-title');
        const modalSkillDesc = document.getElementById('modal-skill-description');

        document.querySelectorAll('.skill-item').forEach(card => {
            card.addEventListener('click', () => {
                playAudio('button_click');
                const skillId = card.getAttribute('data-skill-id');
                const data = skillData[skillId];
                if (!data) return;
                modalSkillTitle.textContent = data.title;
                modalSkillDesc.textContent = data.description;
                skillModal.classList.remove('hidden');
            });
        });
        if (closeSkillModalBtn) closeSkillModalBtn.addEventListener('click', () => {
            playAudio('button_click');
            skillModal.classList.add('hidden');
        });
        if (skillModal) skillModal.addEventListener('click', e => {
            if (e.target === skillModal) skillModal.classList.add('hidden');
        });
    }

    // --- Three.js 3D Models Background ---
    function initThreeBackground() {
        const canvas = document.getElementById('three-bg');
        if (!canvas) return;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 8);

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambient);
        const dir = new THREE.DirectionalLight(0xffffff, 0.5);
        dir.position.set(5, 10, 7);
        scene.add(dir);

        // --- Begin: Dynamic base path for GitHub Pages compatibility ---
        // This will detect if the site is running in a subdirectory (e.g., /your-repo/) and prepend it to asset paths
        let basePath = '';
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && pathParts[0] !== '') {
            // Assume first part is the repo name if not running at root
            basePath = '/' + pathParts[0] + '/';
        } else {
            basePath = '/';
        }
        // --- End: Dynamic base path ---

        // Models
        const loader = new THREE.GLTFLoader();
        const modelConfigs = [
            { file: basePath + 'assets/models/xboxone_controller/scene.gltf', position: [5, -1.2, 0.5], scale: 7.5, rotSpeed: 0.003 },
            { file: basePath + 'assets/models/gamepad/scene.gltf', position: [-6, -2, 0], scale: 1.2, rotSpeed: -0.002 },
            { file: basePath + 'assets/models/unity_logo/scene.gltf', position: [0, 1.8, -2], scale: 0.2, rotSpeed: 0.0015 }
        ];
        const loadedModels = [];

        modelConfigs.forEach((cfg, idx) => {
            loader.load(
                cfg.file, 
                gltf => {
                    const model = gltf.scene;
                    model.position.set(...cfg.position);
                    model.scale.set(cfg.scale, cfg.scale, cfg.scale);
                    model.userData.rotSpeed = cfg.rotSpeed;
                    if (idx === 0) {
                        // Xbox controller: face forward and slightly up
                        model.rotation.y = -Math.PI / 2;
                        model.rotation.x = -Math.PI / 10;
                    }
                    if (idx === 1) {
                        // Gamepad: rotate to face forward
                        model.rotation.y = Math.PI;
                    }
                    scene.add(model);
                    loadedModels.push(model);
                },
                undefined, // onProgress callback (optional)
                error => {
                    console.error(`An error happened while loading model: ${cfg.file}`, error);
                }
            );
        });

        // Responsive
            window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            });

            // Animation loop
            function animate() {
            loadedModels.forEach(model => {
                model.rotation.y += model.userData.rotSpeed || 0.002;
                model.rotation.x += (model.userData.rotSpeed || 0.002) * 0.5;
            });
            renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();
    }

    // --- Final Initializations ---
    // Conditionals check if the element exists before trying to initialize

    // Run animations only on non-mobile devices
    if (!state.isMobile) {
        initCustomCursor();
        initCardTiltEffect();
        initThreeBackground();
        initParticleAnimation(150); // Full particle count for desktop
    } else {
        // On mobile, only run lightweight particle animation
        initParticleAnimation(50); // Reduced particle count for mobile
    }
    
    // These initializations are fine for all devices
    initializeModals();
    initializeSkillPopups();

    // Easter Egg: Theme change on typing 'vapour' or 'retro'
    const easterEggPopup = document.getElementById('easterEggPopup');
    let keyBuffer = '';
    const vapourCode = 'vapour';
    const retroCode = 'retro';
    const hackerCode = 'hacker';
    const cyberpunkCode = 'cyberpunk';
    let lastTheme = null;

    document.addEventListener('keydown', (e) => {
        // Ignore if typing in an input, textarea, or contenteditable
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
        // Only allow a-z keys
        if (!/^[a-zA-Z]$/.test(e.key)) return;
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 12) keyBuffer = keyBuffer.slice(-12);
        if (keyBuffer.endsWith(vapourCode) && lastTheme !== 'vapour') {
            document.body.classList.remove('theme-retro', 'theme-hacker', 'theme-cyberpunk');
            document.body.classList.add('theme-vapour');
            lastTheme = 'vapour';
            showEasterEggPopup();
        } else if (keyBuffer.endsWith(retroCode) && lastTheme !== 'retro') {
            document.body.classList.remove('theme-vapour', 'theme-hacker', 'theme-cyberpunk');
            document.body.classList.add('theme-retro');
            lastTheme = 'retro';
            showEasterEggPopup();
        } else if (keyBuffer.endsWith(hackerCode) && lastTheme !== 'hacker') {
            document.body.classList.remove('theme-vapour', 'theme-retro', 'theme-cyberpunk');
            document.body.classList.add('theme-hacker');
            lastTheme = 'hacker';
            showEasterEggPopup();
        } else if (keyBuffer.endsWith(cyberpunkCode) && lastTheme !== 'cyberpunk') {
            document.body.classList.remove('theme-vapour', 'theme-retro', 'theme-hacker');
            document.body.classList.add('theme-cyberpunk');
            lastTheme = 'cyberpunk';
            showEasterEggPopup();
        }
    });

    function showEasterEggPopup() {
        if (!easterEggPopup) return;
        easterEggPopup.classList.add('active');
        setTimeout(() => {
            easterEggPopup.classList.remove('active');
        }, 2500);
    }

    // 10. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            playAudio('button_click', 0.7);
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // Text Scramble for About Me Title (looped)
    const aboutAnimatedTitle = document.getElementById('about-animated-title');
    if (aboutAnimatedTitle && !state.isMobile) {
        const scramble = new TextScramble(aboutAnimatedTitle);
        const phrase = 'About Me';
        function loopScramble() {
            scramble.setText(phrase).then(() => {
                setTimeout(loopScramble, 3000);
            });
        }
        setTimeout(loopScramble, 1000);
    }

    // --- Final Setup ---
    console.log("Refactored script loaded successfully.");
    document.body.classList.add('loaded');
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        // We can just hide it, as the 'loaded' class on the body will handle the fade-out
        loadingScreen.style.display = 'none';
    }
});