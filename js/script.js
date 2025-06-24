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

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });

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
    if(animatedName){
        const fx = new TextScramble(animatedName);
        const originalText = animatedName.innerText;
        
        setTimeout(() => {
           fx.setText(originalText);
        }, 1000); // Delay start of animation
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
    function initParticleAnimation() {
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
            const particleCount = (canvas.width * canvas.height) / 10000;
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

    initCustomCursor();
    initCardTiltEffect();
    initParticleAnimation();

    // --- Final Setup ---
    console.log("Refactored script loaded successfully.");
    document.body.classList.add('loaded');
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        // We can just hide it, as the 'loaded' class on the body will handle the fade-out
        loadingScreen.style.display = 'none';
    }
}); 