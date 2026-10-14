/**
 * BrandX — Official Website Core Logic & Configuration
 * Vanilla JavaScript (No external framework dependencies)
 */

// ==========================================================================
// 1. Centralized Application Configuration
// Configure live store URLs here. If empty, the website gracefully shows 
// official "Coming Soon" notifications without broken links.
// ==========================================================================
const APP_CONFIG = {
  appName: "BrandX",
  tagline: "Your Business. Everything in One App.",
  // Official Store URLs (Leave empty or set genuine URLs when published)
  googlePlayUrl: "", 
  appStoreUrl: "",
  webAppUrl: "#download",
  supportEmail: "support@brandx.in",
  isPublishedOnStores: false,
  launchYear: 2026
};

// ==========================================================================
// 2. DOM Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initStoreBadges();
  initPricingToggle();
  initModals();
  initToast();
  initYear();
});

// ==========================================================================
// 3. Sticky Navbar with Blur Effect & Active Links
// ==========================================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Spy
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Smooth scroll with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.getElementById('mobileToggle');
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// ==========================================================================
// 4. Mobile Drawer Navigation
// ==========================================================================
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  const toggle = () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      navMenu.classList.add('open');
      toggleBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  };

  toggleBtn.addEventListener('click', toggle);

  // Close when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggle();
    }
  });
}

// ==========================================================================
// 5. Store Badge Click Handlers (Safe Fallback to Coming Soon)
// ==========================================================================
function initStoreBadges() {
  const playStoreTriggers = document.querySelectorAll('.js-playstore-btn');
  const appStoreTriggers = document.querySelectorAll('.js-appstore-btn');

  playStoreTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (APP_CONFIG.googlePlayUrl && APP_CONFIG.googlePlayUrl.startsWith('http')) {
        window.open(APP_CONFIG.googlePlayUrl, '_blank', 'noopener,noreferrer');
      } else {
        showStoreComingSoon('Google Play Store');
      }
    });
  });

  appStoreTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (APP_CONFIG.appStoreUrl && APP_CONFIG.appStoreUrl.startsWith('http')) {
        window.open(APP_CONFIG.appStoreUrl, '_blank', 'noopener,noreferrer');
      } else {
        showStoreComingSoon('Apple App Store');
      }
    });
  });
}

function showStoreComingSoon(platformName) {
  openModal('comingSoonModal', {
    title: `${platformName} Listing Coming Soon`,
    message: `BrandX is getting ready for launch on ${platformName}. We are putting the final touches on the Android and iOS releases to ensure an ultra-fast and secure experience for Indian Vyaparis & MSMEs. Stay tuned!`
  });
}

// ==========================================================================
// 6. Pricing Plan Billing Toggle (Monthly / Annual)
// ==========================================================================
function initPricingToggle() {
  const toggleInput = document.getElementById('pricingToggle');
  const priceAmount = document.getElementById('proPriceAmount');
  const pricePeriod = document.getElementById('proPricePeriod');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelYearly = document.getElementById('labelYearly');

  if (!toggleInput || !priceAmount || !pricePeriod) return;

  const updatePrice = () => {
    const isYearly = toggleInput.checked;
    if (isYearly) {
      priceAmount.textContent = '₹2,999';
      pricePeriod.textContent = '/year';
      if (labelMonthly) labelMonthly.classList.remove('active');
      if (labelYearly) labelYearly.classList.add('active');
    } else {
      priceAmount.textContent = '₹349';
      pricePeriod.textContent = '/month';
      if (labelMonthly) labelMonthly.classList.add('active');
      if (labelYearly) labelYearly.classList.remove('active');
    }
  };

  toggleInput.addEventListener('change', updatePrice);

  if (labelMonthly) {
    labelMonthly.addEventListener('click', () => {
      toggleInput.checked = false;
      updatePrice();
    });
  }

  if (labelYearly) {
    labelYearly.addEventListener('click', () => {
      toggleInput.checked = true;
      updatePrice();
    });
  }
}

// ==========================================================================
// 7. Modals System (Terms, Privacy, Contact, Coming Soon)
// ==========================================================================
function initModals() {
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  modalBackdrops.forEach(backdrop => {
    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(backdrop.id));
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });

  // Modal Open Triggers
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });
}

function openModal(modalId, customData = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (customData) {
    const titleEl = modal.querySelector('.modal-title');
    const msgEl = modal.querySelector('.modal-dynamic-text');
    if (titleEl && customData.title) titleEl.textContent = customData.title;
    if (msgEl && customData.message) msgEl.textContent = customData.message;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// 8. Toast Notification System
// ==========================================================================
let toastTimer = null;
function initToast() {
  // Global helper
  window.showToast = function(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  };
}

// ==========================================================================
// 9. Copyright Year Auto-update
// ==========================================================================
function initYear() {
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) {
    yearEl.textContent = APP_CONFIG.launchYear || new Date().getFullYear();
  }
}
