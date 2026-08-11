/* ==========================================================================
   הסלון של גלית — Interactivity: gallery lightbox, FAQ accordion, footer year
   Vanilla JS, no external libraries.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFooterYear();
  initLightbox();
  initAccordion();
  initScrollReveal();
});

/* ---------- Footer year ---------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------- Gallery lightbox ---------- */
function initLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  if (!galleryItems.length) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const images = galleryItems.map((item) => {
    const img = item.querySelector('img');
    return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
  });

  let currentIndex = 0;
  let lastFocusedElement = null;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('is-open');
    lastFocusedElement = document.activeElement;
    closeBtn.focus();
    document.addEventListener('keydown', handleKeydown);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.removeEventListener('keydown', handleKeydown);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function updateLightboxImage() {
    const { src, alt } = images[currentIndex];
    lightboxImage.setAttribute('src', src);
    lightboxImage.setAttribute('alt', alt);
    lightboxCaption.textContent = alt;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showPrev();
    if (e.key === 'ArrowLeft') showNext();
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

/* ---------- Scroll entrance animation ---------- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const targets = Array.from(document.querySelectorAll(
    '.hero-content, .section-header, .gallery-item, .about-photo, .about-text, .testimonial-card, .faq-item, .contact-wrap'
  ));
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  const staggeredGroups = ['.gallery-item', '.testimonial-card', '.faq-item'];
  staggeredGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((el) => observer.observe(el));
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}
