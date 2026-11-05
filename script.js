const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const cloud = document.querySelector('#point-cloud');
if (cloud && !reducedMotion) {
  const colors = ['#6c5ce7', '#9b65d5', '#93e6cf', '#ffd8c2'];
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 46; index += 1) {
    const point = document.createElement('span');
    const angle = index * 2.39996;
    const radius = 23 + ((index * 37) % 40);
    point.className = 'cloud-point';
    point.style.setProperty('--x', `${50 + Math.cos(angle) * radius}%`);
    point.style.setProperty('--y', `${50 + Math.sin(angle) * radius}%`);
    point.style.setProperty('--size', `${2 + (index % 4)}px`);
    point.style.setProperty('--color', colors[index % colors.length]);
    point.style.setProperty('--opacity', `${0.25 + (index % 5) * 0.12}`);
    point.style.setProperty('--duration', `${3 + (index % 6)}s`);
    point.style.setProperty('--delay', `${-(index % 7)}s`);
    fragment.appendChild(point);
  }
  cloud.appendChild(fragment);
}

const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[data-panel]')];
function activateTab(tab) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== tab.dataset.tab;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

const dialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogClose = dialog.querySelector('.dialog-close');
document.querySelectorAll('.image-zoom').forEach((button) => {
  button.addEventListener('click', () => {
    const sourceImage = button.querySelector('img');
    dialogImage.src = button.dataset.image;
    dialogImage.alt = sourceImage.alt;
    dialog.showModal();
  });
});
dialogClose.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  dialogImage.src = '';
  dialogImage.alt = '';
});
