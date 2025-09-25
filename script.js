// Utilities
const select = (s, ctx = document) => ctx.querySelector(s);
const selectAll = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

// Smooth scrolling for nav links
selectAll('.nav-link').forEach(link => {
	link.addEventListener('click', e => {
		const href = link.getAttribute('href');
		if (href && href.startsWith('#')) {
			e.preventDefault();
			const target = select(href);
			if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			// Close mobile nav
			select('.nav-links')?.classList.remove('open');
			select('.nav-toggle')?.setAttribute('aria-expanded', 'false');
		}
	});
});

// Mobile nav toggle
const toggleBtn = select('.nav-toggle');
if (toggleBtn) {
	toggleBtn.addEventListener('click', () => {
		const nav = select('.nav-links');
		nav.classList.toggle('open');
		const isOpen = nav.classList.contains('open');
		toggleBtn.setAttribute('aria-expanded', String(isOpen));
	});
}

// Active link highlighting on scroll
const sections = selectAll('section[id]');
const navLinks = selectAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			navLinks.forEach(l => l.classList.remove('active'));
			const id = `#${entry.target.id}`;
			const active = navLinks.find(l => l.getAttribute('href') === id);
			active?.classList.add('active');
		}
	});
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 });
sections.forEach(s => sectionObserver.observe(s));

// Reveal animations
const revealTargets = selectAll('.fade-in, .fade-up');
const revealObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('is-visible');
			revealObserver.unobserve(entry.target);
		}
	});
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
revealTargets.forEach(el => revealObserver.observe(el));

// Typing effect
const typingEl = select('#typing');
const typingPhrases = [
	"Frontend Developer",
	"UI/UX Enthusiast",
	"Animation Lover",
	"Performance Focused"
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeSpeed = 70, backSpeed = 40, holdTime = 1200;
function tick() {
	if (!typingEl) return;
	const current = typingPhrases[phraseIdx];
	if (!deleting) {
		charIdx++;
		if (charIdx === current.length) {
			deleting = true;
			return setTimeout(tick, holdTime);
		}
	} else {
		charIdx--;
		if (charIdx === 0) {
			deleting = false;
			phraseIdx = (phraseIdx + 1) % typingPhrases.length;
		}
	}
	typingEl.textContent = current.slice(0, charIdx);
	setTimeout(tick, deleting ? backSpeed : typeSpeed);
}
setTimeout(tick, 600);

// Contact form (demo handler)
const form = select('#contact-form');
const statusEl = select('.form-status');
form?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const btn = select('.submit-btn');
	btn?.classList.add('loading');
	statusEl.textContent = '';
	const data = new FormData(form);
	const payload = Object.fromEntries(data.entries());
	try {
		await new Promise(res => setTimeout(res, 1200));
		statusEl.textContent = 'Thanks! Your message was sent (demo).';
		form.reset();
	} catch (err) {
		statusEl.textContent = 'Something went wrong. Please try again.';
	}
	btn?.classList.remove('loading');
});

// Footer year
const yearEl = select('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Scroll progress bar
const progressEl = select('.scroll-progress');
function updateProgress(){
	if (!progressEl) return;
	const scrollTop = window.scrollY;
	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = docHeight > 0 ? scrollTop / docHeight : 0;
	progressEl.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Three.js hero (lightweight cube)
(function initThree(){
	const canvas = select('#hero-canvas');
	if (!canvas || !window.THREE) return;
	const { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight, Color, Clock, sRGBEncoding } = THREE;
	const scene = new Scene();
	scene.background = new Color(0x0b0d12);
	const camera = new PerspectiveCamera(60, 1, 0.1, 100);
	camera.position.set(2.4, 1.8, 3.2);
	const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.outputEncoding = sRGBEncoding;
	function resize(){
		const rect = canvas.getBoundingClientRect();
		const width = Math.max(300, rect.width);
		const height = Math.max(260, rect.height);
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
	window.addEventListener('resize', resize);
	resize();
	const geo = new BoxGeometry(1.2,1.2,1.2);
	const mat = new MeshStandardMaterial({ color: 0x7c5cff, metalness: 0.3, roughness: 0.35 });
	const cube = new Mesh(geo, mat);
	scene.add(cube);
	const amb = new AmbientLight(0xffffff, .6); scene.add(amb);
	const dir = new DirectionalLight(0xffffff, .9); dir.position.set(2,2,3); scene.add(dir);
	const clock = new Clock();
	// simple parallax on profile image
	const profile = select('.profile-circle');
	function animate(){
		const t = clock.getElapsedTime();
		cube.rotation.x = t * 0.5;
		cube.rotation.y = t * 0.8;
		cube.position.y = Math.sin(t*1.4)*0.08;
		if (profile) {
			const offset = Math.sin(t*0.6) * 6;
			profile.style.transform = `translateY(${offset}px)`;
		}
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
	animate();
})();
