/* ===================================================================
   LILIAN ALHALABI — PORTFOLIO SCRIPT
   Handles: mobile nav, AOS init, reusable certificate modal/lightbox
   =================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* -----------------------------------------------------------
       1. Scroll reveal animations (AOS)
    ----------------------------------------------------------- */
    if (window.AOS) {
        AOS.init({ duration: 700, once: true, offset: 60 });
    }

    /* -----------------------------------------------------------
       2. Mobile navigation toggle
    ----------------------------------------------------------- */
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* -----------------------------------------------------------
       3. Reusable certificate modal / lightbox system
       Any element with data-cert-src + data-cert-title opens the
       same modal. Works for the degree certificate, the Apple
       Foundation certificate, the IT-Ranks experience certificate,
       and every individual certification card.
    ----------------------------------------------------------- */
    var modal = document.getElementById('cert-modal');
    var modalImg = document.getElementById('cert-modal-img');
    var modalTitle = document.getElementById('cert-modal-title');
    var modalBody = document.getElementById('cert-modal-body');
    var modalCloseBtn = document.getElementById('cert-modal-close');
    var lastFocusedEl = null;

    function openCertModal(src, title, alt) {
        if (!modal) return;
        lastFocusedEl = document.activeElement;

        modalTitle.textContent = title || 'Certificate';
        modalImg.src = src;
        modalImg.alt = alt || (title ? title + ' certificate' : 'Certificate image');
        modalBody.classList.remove('img-error');

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Move focus into the dialog for keyboard users
        modalCloseBtn.focus();
    }

    function closeCertModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modalImg.src = '';

        if (lastFocusedEl) lastFocusedEl.focus();
    }

    // Fallback UI if the placeholder image file hasn't been added yet
    if (modalImg) {
        modalImg.addEventListener('error', function () {
            if (modalImg.getAttribute('src')) {
                modalBody.classList.add('img-error');
            }
        });
    }

    document.querySelectorAll('[data-cert-src]').forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            var src = trigger.getAttribute('data-cert-src');
            var title = trigger.getAttribute('data-cert-title');
            var alt = trigger.getAttribute('data-cert-alt');
            openCertModal(src, title, alt);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeCertModal);
    }

    if (modal) {
        // Click outside the modal box closes it
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeCertModal();
        });
    }

    // ESC key closes the modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
            closeCertModal();
        }

        // Basic focus trap while modal is open
        if (e.key === 'Tab' && modal && modal.classList.contains('is-open')) {
            var focusable = modal.querySelectorAll('button, [href], img[tabindex]');
            if (!focusable.length) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    /* -----------------------------------------------------------
       4. Terminal-style hero text — typewriter effect
    ----------------------------------------------------------- */
    var typedEl = document.getElementById('hero-typed');
    if (typedEl) {
        var fullText = typedEl.getAttribute('data-text') || '';
        var prefersReducedMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            typedEl.textContent = fullText;
        } else {
            typedEl.textContent = '';
            var charIndex = 0;
            var typeSpeed = 16; // ms per character

            (function typeNextChar() {
                if (charIndex <= fullText.length) {
                    typedEl.textContent = fullText.slice(0, charIndex);
                    charIndex++;
                    setTimeout(typeNextChar, typeSpeed);
                }
            })();
        }
    }

});
