const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal sections gently as they enter the viewport.
const revealItems = document.querySelectorAll('.about-grid, .skill-list > div, .project-card, .contact-grid');
if ('IntersectionObserver' in window) {
  revealItems.forEach(item => { item.style.opacity = '0'; item.style.transform = 'translateY(14px)'; item.style.transition = 'opacity .55s ease, transform .55s ease'; });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
}
