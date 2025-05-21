// Global state for theme and audio
const state = {
    theme: localStorage.getItem('theme') || 'light',
    isMusicPlaying: false,
    audioElements: {},
    isInitialized: false
};

// Add loading state management at the beginning of the file
let loadingState = {
    models: false,
    audio: false,
    images: false,
    timeout: null
};

function checkLoadingComplete() {
    // Remove the timeout check since we want to show the site even if assets are still loading
    if (loadingState.models || loadingState.audio || loadingState.images) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                loadingElement.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500);
        }
    }
}

// Set a timeout to show the site even if assets fail to load
setTimeout(() => {
    loadingState.models = true;
    loadingState.audio = true;
    loadingState.images = true;
    checkLoadingComplete();
}, 3000); // Reduced timeout to 3 seconds

// Utility to play audio with error handling
function playAudio(audioId, volume = 0.5) {
    if (!state.isInitialized) {
        console.warn('Audio system not initialized yet');
        return;
    }
    
    const audio = state.audioElements[audioId];
    if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.error(`Error playing ${audioId}:`, e);
            // Try to recover by reinitializing the audio element
            audio.load();
        });
    } else {
        console.warn(`Audio element ${audioId} not found`);
    }
}

// Initialize audio elements
function initAudio() {
    try {
        const audioElements = document.querySelectorAll('audio');
        let loadedCount = 0;
        const totalAudio = audioElements.length;

        if (totalAudio === 0) {
            console.warn('No audio elements found in the document');
            loadingState.audio = true;
            checkLoadingComplete();
            return;
        }

        audioElements.forEach(audio => {
            // Add error handling for each audio element
            audio.addEventListener('error', (e) => {
                console.error(`Error loading audio ${audio.id}:`, e.target.error);
                loadedCount++;
                if (loadedCount === totalAudio) {
                    loadingState.audio = true;
                    checkLoadingComplete();
                }
            });

            audio.addEventListener('canplaythrough', () => {
                console.log(`Audio loaded: ${audio.id}`);
                loadedCount++;
                if (loadedCount === totalAudio) {
                    console.log('All audio elements loaded successfully');
                    loadingState.audio = true;
                    checkLoadingComplete();
                }
            });
            
            // Store audio element in state
            state.audioElements[audio.id] = audio;
            
            // Set default volume
            audio.volume = 0.5;
        });

        // Set initialization flag
        state.isInitialized = true;
    } catch (error) {
        console.error('Error initializing audio system:', error);
        loadingState.audio = true;
        checkLoadingComplete();
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js loaded');
    initAudio();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (!themeToggle) {
        console.error('Theme toggle button #theme-toggle not found');
    } else {
        function setTheme(theme) {
            try {
                if (theme !== 'light' && theme !== 'dark') {
                    console.error('Invalid theme value:', theme);
                    theme = 'light'; // Default to light theme
                }

                body.setAttribute('data-theme', theme);
                themeToggle.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                state.theme = theme;

                const themeIcon = themeToggle.querySelector('#theme-icon');
                if (!themeIcon) {
                    console.error('Theme icon element not found');
                    return;
                }

                themeIcon.innerHTML = theme === 'light'
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
                
                console.log('Theme set successfully to:', theme);
            } catch (error) {
                console.error('Error setting theme:', error);
            }
        }

        // Add click event listener with error handling
        themeToggle.addEventListener('click', () => {
            try {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                playAudio('buttonClickSound', 0.3);
            } catch (error) {
                console.error('Error in theme toggle click handler:', error);
            }
        });

        // Initialize theme with error handling
        try {
            const savedTheme = localStorage.getItem('theme');
            setTheme(savedTheme || 'light');
        } catch (error) {
            console.error('Error initializing theme:', error);
            setTheme('light'); // Fallback to light theme
        }
    }

    // Music Toggle
    const musicToggle = document.getElementById('music-toggle');
    if (!musicToggle) {
        console.error('Music toggle button #music-toggle not found');
    } else {
        const toggleMusic = async () => {
            try {
                const bgMusic = state.audioElements['bgMusic'];
                if (!bgMusic) {
                    console.error('Background music element not found');
                    return;
                }

                if (state.isMusicPlaying) {
                    bgMusic.pause();
                    musicToggle.setAttribute('data-playing', 'false');
                    musicToggle.querySelector('svg').style.opacity = '0.5';
                    console.log('Background music paused');
                } else {
                    try {
                        await bgMusic.play();
                        musicToggle.setAttribute('data-playing', 'true');
                        musicToggle.querySelector('svg').style.opacity = '1';
                        console.log('Background music started playing');
                    } catch (playError) {
                        console.error('Error playing background music:', playError);
                        // Show user feedback that autoplay might be blocked
                        alert('Please interact with the page first to enable audio playback.');
                        return;
                    }
                }
                
                state.isMusicPlaying = !state.isMusicPlaying;
                localStorage.setItem('musicEnabled', state.isMusicPlaying.toString());
            } catch (error) {
                console.error('Error toggling music:', error);
            }
        };

        musicToggle.addEventListener('click', toggleMusic);

        // Initialize music state from localStorage
        try {
            const savedMusicState = localStorage.getItem('musicEnabled');
            if (savedMusicState === 'true') {
                toggleMusic(); // Try to autoplay if it was enabled before
            }
        } catch (error) {
            console.error('Error initializing music state:', error);
        }
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            anchor.classList.add('clicked');
            setTimeout(() => anchor.classList.remove('clicked'), 500);
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            playAudio('buttonClickSound');
        });
    });

    // Sound Effects
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => playAudio('navHoverSound'));
    });

    document.querySelectorAll('.button-glow').forEach(button => {
        button.addEventListener('click', () => playAudio('buttonClickSound'));
    });

    // Scroll Animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const sections = document.querySelectorAll('.section-animate');
    
    if (animateElements.length === 0) {
        console.warn('No .animate-on-scroll elements found');
    }
    if (sections.length === 0) {
        console.warn('No .section-animate elements found');
    }

    try {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, animations will not work');
            // Show all elements as fallback
            animateElements.forEach(el => el.classList.add('is-visible'));
            sections.forEach(el => el.classList.add('is-visible'));
            return;
        }

        // Debounce function for performance
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Create observer with error handling
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                try {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        
                        // Play sound only for sections and if audio is initialized
                        if (entry.target.classList.contains('section-animate') && state.isInitialized) {
                            playAudio('sectionSound', 0.2);
                        }
                        
                        observer.unobserve(entry.target);
                    }
                } catch (error) {
                    console.error('Error handling intersection entry:', error);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with error handling
        const observeElement = (element) => {
            try {
                observer.observe(element);
            } catch (error) {
                console.error('Error observing element:', error);
                // Add fallback visibility
                element.classList.add('is-visible');
            }
        };

        // Batch observe elements for better performance
        const batchSize = 10;
        const observeInBatches = (elements) => {
            for (let i = 0; i < elements.length; i += batchSize) {
                setTimeout(() => {
                    const batch = Array.from(elements).slice(i, i + batchSize);
                    batch.forEach(observeElement);
                }, 0);
            }
        };

        observeInBatches(animateElements);
        observeInBatches(sections);

        // Cleanup function
        const cleanup = () => {
            try {
                observer.disconnect();
            } catch (error) {
                console.error('Error cleaning up observer:', error);
            }
        };

        // Add cleanup on page unload
        window.addEventListener('unload', cleanup);

    } catch (error) {
        console.error('Error setting up scroll animations:', error);
        // Show all elements as fallback
        animateElements.forEach(el => el.classList.add('is-visible'));
        sections.forEach(el => el.classList.add('is-visible'));
    }

    // Procedural Animation
    const bgCanvas = document.getElementById('bgCanvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D context for #bgCanvas');
        } else {
            let width, height, particles = [], sparks = [], particleCount = 50;
            let mouse = { x: null, y: null };
            let animationFrameId = null;

            function resizeCanvas() {
                width = bgCanvas.width = window.innerWidth;
                height = bgCanvas.height = window.innerHeight;
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.baseSize = Math.random() * 3 + 2;
                    this.size = this.baseSize;
                    this.speedX = Math.random() * 1.5 - 0.75;
                    this.speedY = Math.random() * 1.5 - 0.75;
                    this.glowPhase = Math.random() * Math.PI * 2;
                    this.trail = [];
                    this.trailLength = 5;
                }

                update() {
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = this.x - mouse.x;
                        const dy = this.y - mouse.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 100) {
                            const force = (100 - distance) / 100 * 2;
                            this.speedX += (dx / distance) * force;
                            this.speedY += (dy / distance) * force;
                        }
                    }

                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.x < 0 || this.x > width) this.speedX *= -1;
                    if (this.y < 0 || this.y > height) this.speedY *= -1;

                    this.glowPhase += 0.05;
                    this.size = this.baseSize + Math.sin(this.glowPhase) * 0.5;

                    this.trail.push({ x: this.x, y: this.y, size: this.size });
                    if (this.trail.length > this.trailLength) this.trail.shift();

                    if (Math.random() < 0.01) {
                        for (let i = 0; i < 3; i++) {
                            if (sparks.length < 100) { // Limit number of sparks
                                sparks.push(new Spark(this.x, this.y));
                            }
                        }
                    }
                }

                draw() {
                    const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
                    this.trail.forEach((point, index) => {
                        ctx.fillStyle = particleColor;
                        ctx.globalAlpha = (index / this.trailLength) * 0.5;
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, point.size * (index / this.trailLength), 0, Math.PI * 2);
                        ctx.fill();
                    });
                    ctx.globalAlpha = 1;

                    ctx.fillStyle = particleColor;
                    ctx.shadowColor = particleColor;
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            class Spark {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.size = Math.random() * 2 + 1;
                    this.speedX = (Math.random() - 0.5) * 5;
                    this.speedY = (Math.random() - 0.5) * 5;
                    this.life = 30;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    this.life--;
                    return this.life > 0;
                }

                draw() {
                    const sparkColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                    ctx.fillStyle = sparkColor;
                    ctx.globalAlpha = this.life / 30;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }

            function animateParticles() {
                if (!document.body.classList.contains('loaded')) {
                    animationFrameId = requestAnimationFrame(animateParticles);
                    return;
                }

                ctx.clearRect(0, 0, width, height);

                // Update and draw particles
                particles.forEach(particle => particle.update());
                particles.forEach(particle => particle.draw());

                // Update and draw sparks
                sparks = sparks.filter(spark => spark.update());
                sparks.forEach(spark => spark.draw());

                animationFrameId = requestAnimationFrame(animateParticles);
            }

            // Initialize particles
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            // Start animation
            animateParticles();

            // Clean up on page unload
            window.addEventListener('unload', () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            });
        }
    }

    // Mark initialization as complete
    state.isInitialized = true;

    // Glitch Canvas
    const glitchCanvas = document.getElementById('glitchCanvas');
    if (glitchCanvas) {
        const ctx = glitchCanvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D context for #glitchCanvas');
        } else {
            let width, height;

            function resizeGlitchCanvas() {
                width = glitchCanvas.width = window.innerWidth;
                height = glitchCanvas.height = window.innerHeight;
            }

            window.addEventListener('resize', resizeGlitchCanvas);
            resizeGlitchCanvas();

            function drawScanlines() {
                ctx.clearRect(0, 0, width, height);
                ctx.strokeStyle = state.theme === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(200, 200, 200, 0.15)';
                ctx.lineWidth = 1;

                for (let y = 0; y < height; y += 5 + Math.random() * 5) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y + Math.random() * 2 - 1);
                    ctx.stroke();
                }

                if (Math.random() < 0.1) {
                    ctx.fillStyle = state.theme === 'light' ? 'rgba(255, 0, 0, 0.07)' : 'rgba(0, 255, 255, 0.07)';
                    ctx.fillRect(0, Math.random() * height, width, 10 + Math.random() * 20);
                }
            }

            const nameSection = document.getElementById('name-section');
            if (nameSection) {
                window.addEventListener('scroll', () => {
                    const rect = nameSection.getBoundingClientRect();
                    const opacity = Math.max(0, 1 - window.scrollY / rect.height);
                    glitchCanvas.style.opacity = opacity * 0.3;
                    glitchCanvas.classList.toggle('fade-out', opacity === 0);
                });

                function animateGlitch() {
                    try {
                        drawScanlines();
                        requestAnimationFrame(animateGlitch);
                    } catch (e) {
                        console.error('Glitch animation error:', e);
                    }
                }
                animateGlitch();
            } else {
                console.error('Element #name-section not found');
            }
        }
    } else {
        console.error('Canvas #glitchCanvas not found');
    }

    // Animated Name
    const phrases = [
        "Syed Muhammad Abis",
        "Game Developer",
        "4+ Years Experience",
        "Based in Pakistan"
    ];
    let currentPhraseIndex = 0;
    const animatedName = document.getElementById('animated-name');
    if (animatedName) {
        function updatePhrase() {
            animatedName.innerHTML = `<h1 class="text-4xl sm:text-5xl font-heading font-bold text-primary glitch-text">${phrases[currentPhraseIndex]}</h1>`;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            playAudio('glitchSound');
        }
        updatePhrase();
        setInterval(updatePhrase, 3000);
    } else {
        console.error('Element #animated-name not found');
    }

    // CRT Effect
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length === 0) {
        console.warn('No .project-card elements found');
    } else {
        projectCards.forEach(card => {
            const img = card.querySelector('img');
            const canvas = card.querySelector('.crt-overlay');
            if (!img || !canvas) {
                console.error('Missing img or .crt-overlay in project card:', card);
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Failed to get 2D context for .crt-overlay in card:', card);
                return;
            }

            let width, height;

            function resizeCrtCanvas() {
                width = canvas.width = img.clientWidth;
                height = canvas.height = img.clientHeight;
            }

            resizeCrtCanvas();
            window.addEventListener('resize', resizeCrtCanvas);

            function drawCrtEffect() {
                ctx.clearRect(0, 0, width, height);
                ctx.strokeStyle = state.theme === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(200, 200, 200, 0.1)';
                ctx.lineWidth = 1;
                for (let y = 0; y < height; y += 4) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                if (Math.random() < 0.05) {
                    ctx.fillStyle = state.theme === 'light' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(0, 200, 200, 0.05)';
                    ctx.fillRect(0, Math.random() * height, width, 2);
                }
            }

            card.addEventListener('mouseenter', () => {
                img.classList.add('crt-effect');
                canvas.style.opacity = 0.5;
                drawCrtEffect();
                playAudio('crtSound');
            });

            card.addEventListener('mouseleave', () => {
                img.classList.remove('crt-effect');
                canvas.style.opacity = 0;
            });

            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                window.addEventListener('scroll', () => {
                    const rect = projectsSection.getBoundingClientRect();
                    const opacity = Math.max(0, 1 - Math.abs(rect.top) / rect.height);
                    canvas.style.opacity = opacity * 0.5;
                    canvas.classList.toggle('fade-out', opacity === 0);
                });
            }
        });
    }

    // Three.js 3D Models
    const loader = new THREE.GLTFLoader();
    const models = { controller: null, gamepad: null, unity_logo: null };

    loader.load('./assets/models/controller.gltf', gltf => {
        models.controller = gltf.scene;
        loadingState.models = true;
        checkLoadingComplete();
    }, undefined, error => {
        console.error('Error loading controller model:', error);
        loadingState.models = true; // Set to true even if there's an error
        checkLoadingComplete();
    });

    loader.load('./assets/models/gamepad.gltf', gltf => {
        models.gamepad = gltf.scene;
    }, undefined, error => console.error('Error loading gamepad model:', error));

    loader.load('./assets/models/unity_logo.gltf', gltf => {
        models.unity_logo = gltf.scene;
    }, undefined, error => console.error('Error loading Unity logo model:', error));

    const threeCanvas = document.getElementById('threeCanvas');
    if (threeCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new THREE.AmbientLight(state.theme === 'light' ? 0xffffff : 0xcccccc, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(state.theme === 'light' ? 0xffffff : 0xcccccc, 0.5);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 5;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', e => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const nameSection = document.getElementById('name-section');
        if (nameSection) {
            window.addEventListener('scroll', () => {
                const rect = nameSection.getBoundingClientRect();
                const opacity = Math.max(0, 1 - window.scrollY / rect.height);
                threeCanvas.style.opacity = opacity;
                threeCanvas.classList.toggle('fade-out', opacity === 0);
            });
        }

        function animate3D() {
            requestAnimationFrame(animate3D);
            if (models.controller) {
                models.controller.scale.set(0.5, 0.5, 0.5);
                models.controller.position.set(0, -2, 0);
                models.controller.rotation.y += 0.01;
                models.controller.rotation.x = mouseY * 0.3;
                models.controller.rotation.y += mouseX * 0.3;
                if (!scene.children.includes(models.controller)) {
                    scene.add(models.controller);
                }
            }
            renderer.render(scene, camera);
        }
        animate3D();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    const projectCanvases = document.querySelectorAll('.project-model');
    const skillCanvases = document.querySelectorAll('.skill-model');

    function setupMiniModel(canvas, modelKey) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new THREE.AmbientLight(state.theme === 'light' ? 0xffffff : 0xcccccc, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(state.theme === 'light' ? 0xffffff : 0xcccccc, 0.3);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 2;

        function animateMiniModel() {
            requestAnimationFrame(animateMiniModel);
            if (models[modelKey]) {
                models[modelKey].scale.set(0.2, 0.2, 0.2);
                models[modelKey].position.set(0, 0, 0);
                models[modelKey].rotation.y += 0.02;
                if (!scene.children.includes(models[modelKey])) {
                    scene.add(models[modelKey]);
                }
            }
            renderer.render(scene, camera);
        }
        animateMiniModel();

        window.addEventListener('resize', () => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        });
    }

    projectCanvases.forEach(canvas => setupMiniModel(canvas, 'gamepad'));
    skillCanvases.forEach(canvas => setupMiniModel(canvas, 'unity_logo'));

    // Image Gallery
    const galleryModal = document.getElementById('galleryModal');
    const galleryImage = document.getElementById('galleryImage');
    const closeModal = document.getElementById('closeModal');
    const prevImage = document.getElementById('prevImage');
    const nextImage = document.getElementById('nextImage');

    const galleryImages = {
        pickle_former: [
            './assets/images/projects/pickle_former_screenshot1.jpg',
            './assets/images/projects/pickle_former_screenshot2.jpg',
            './assets/images/projects/pickle_former_gallery1.jpg'
        ],
        rainbow_rollie: [
            './assets/images/projects/rainbow_rollie_screenshot1.jpg',
            './assets/images/projects/rainbow_rollie_screenshot2.jpg',
            './assets/images/projects/rainbow_rollie_gallery1.jpg'
        ],
        aesthetic_cube: [
            './assets/images/projects/aesthetic_cube_screenshot1.jpg',
            './assets/images/projects/aesthetic_cube_screenshot2.jpg',
            './assets/images/projects/aesthetic_cube_gallery1.jpg'
        ],
        baqra_surfer: [
            './assets/images/projects/baqra_surfer_screenshot1.jpg',
            './assets/images/projects/baqra_surfer_screenshot2.jpg',
            './assets/images/projects/baqra_surfer_gallery1.jpg'
        ],
        cartoon_defence: [
            './assets/images/projects/cartoon_defence_screenshot1.jpg',
            './assets/images/projects/cartoon_defence_screenshot2.jpg',
            './assets/images/projects/cartoon_defence_gallery1.jpg'
        ],
        one_minute_drift: [
            './assets/images/projects/one_minute_drift_screenshot1.jpg',
            './assets/images/projects/one_minute_drift_screenshot2.jpg',
            './assets/images/projects/one_minute_drift_gallery1.jpg'
        ]
    };

    let currentProject = null;
    let currentImageIndex = 0;

    document.querySelectorAll('.gallery-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            currentProject = link.getAttribute('data-project-id');
            currentImageIndex = 0;
            galleryImage.src = galleryImages[currentProject][currentImageIndex];
            galleryModal.classList.remove('hidden');
            playAudio('buttonClickSound');
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            galleryModal.classList.add('hidden');
            playAudio('buttonClickSound');
        });
    }

    if (prevImage) {
        prevImage.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages[currentProject].length) % galleryImages[currentProject].length;
            galleryImage.src = galleryImages[currentProject][currentImageIndex];
            playAudio('buttonClickSound');
        });
    }

    if (nextImage) {
        nextImage.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages[currentProject].length;
            galleryImage.src = galleryImages[currentProject][currentImageIndex];
            playAudio('buttonClickSound');
        });
    }

    // Lazy Load Images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    } else {
        document.querySelectorAll('img.lazy').forEach(img => {
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
        });
    }

    // Modern Cursor
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    cursor.classList.add('cursor');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        followerX += (mouseX - followerX) * 0.2;
        followerY += (mouseY - followerY) * 0.2;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add cursor effects to interactive elements
    document.querySelectorAll('a, button, .project-card, .skill-item').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-active');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-active');
        });
    });

    // Parallax Effect
    document.addEventListener('mousemove', e => {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.1;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            element.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });

    // Smooth Scroll with Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--primary);
        width: 0;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Update image loading
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
        loadingState.images = true;
        checkLoadingComplete();
    } else {
        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === totalImages) {
                    loadingState.images = true;
                    checkLoadingComplete();
                }
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        loadingState.images = true;
                        checkLoadingComplete();
                    }
                });
                // Add error handler for images
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        loadingState.images = true;
                        checkLoadingComplete();
                    }
                });
            }
        });
    }
});