const cards = [...document.querySelectorAll('.photo-card')];
const filters = [...document.querySelectorAll('.filter')];
const lightbox = document.getElementById('lightbox');
const largeImage = document.getElementById('lightbox-image');
const caption = document.getElementById('lightbox-caption');
let currentIndex = 0;
let visibleCards = cards;

function applyFilter(category) {
  visibleCards = cards.filter(card => category === 'all' || card.dataset.category === category);
  cards.forEach(card => card.classList.toggle('hidden', !visibleCards.includes(card)));
  filters.forEach(button => button.classList.toggle('active', button.dataset.filter === category));
}
function showImage(index) {
  currentIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[currentIndex];
  const img = card.querySelector('img');
  largeImage.src = img.src;
  largeImage.alt = img.alt;
  caption.textContent = card.querySelector('b').textContent;
}
function openLightbox(card) {
  visibleCards = cards.filter(c => !c.classList.contains('hidden'));
  showImage(visibleCards.indexOf(card));
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('close').focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
cards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
document.getElementById('prev').addEventListener('click', () => showImage(currentIndex - 1));
document.getElementById('next').addEventListener('click', () => showImage(currentIndex + 1));
document.getElementById('close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  if (event.key === 'ArrowRight') showImage(currentIndex + 1);
});
