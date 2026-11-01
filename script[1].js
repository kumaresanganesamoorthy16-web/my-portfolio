// Mark JS as available so reveal styles only apply when scripts run
document.documentElement.classList.add('js');

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Mobile menu ----------
const burger = $('#burger');
const menu = $('#menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---------- Nav border + back-to-top button ----------
const nav = $('#nav');
const topBtn = $('#top');
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 10);
  topBtn.classList.toggle('show', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Scroll reveal ----------
const reveals = $$('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// ---------- Active nav link highlighting ----------
const links = $$('.menu a');
const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// ---------- Contact form validation ----------
const form = $('#form');
const status = $('#status');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  subject: v => v.trim().length >= 3 || 'Enter a subject.',
  message: v => v.trim().length >= 10 || 'Write at least 10 characters.'
};
function check(field) {
  const input = form.elements[field];
  const result = rules[field](input.value);
  const ok = result === true;
  input.classList.toggle('invalid', !ok);
  input.setAttribute('aria-invalid', !ok);
  $('#e-' + field).textContent = ok ? '' : result;
  return ok;
}
Object.keys(rules).forEach(f => form.elements[f].addEventListener('blur', () => check(f)));

form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = '';
  const allOk = Object.keys(rules).map(check).every(Boolean);
  if (!allOk) return;
  // No backend here. To send real email, point this form at Formspree/Netlify Forms,
  // or open the visitor's mail app as below:
  const body = `${form.elements.message.value}\n\nFrom: ${form.elements.name.value} (${form.elements.email.value})`;
  window.location.href = `mailto:kumaresanganesamoorthy16@gmail.com?subject=${encodeURIComponent(form.elements.subject.value)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Your mail app should open with the message ready to send.';
  form.reset();
});

// ---------- Footer year ----------
$('#year').textContent = new Date().getFullYear();
