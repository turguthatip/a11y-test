/**
 * Vibrant Flower Shop - Interactive behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initQuantitySelector();
  initCheckoutModal();
  initStateCityAutocomplete();
});

function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const openBtn = document.querySelector('.js-add-to-cart');
  const closeTriggers = document.querySelectorAll('.js-checkout-close');
  const continueBtn = document.querySelector('.js-checkout-continue');
  const panelShipping = document.getElementById('checkout-panel-shipping');
  const panelPayment = document.getElementById('checkout-panel-payment');
  const step1El = document.getElementById('checkout-step-1');
  const step2El = document.getElementById('checkout-step-2');

  if (!modal || !openBtn) return;

  const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusables() {
    return Array.from(modal.querySelectorAll(focusableSelector)).filter((el) => {
      const panel = el.closest('[data-checkout-panel]');
      if (panel && panel.hidden) return false;
      return el.offsetParent !== null && !el.hasAttribute('aria-hidden');
    });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusables = getFocusables();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  let previousActiveElement = null;
  let currentStep = 1;

  const requiredShippingIds = ['checkout-first-name', 'checkout-address', 'checkout-zip'];
  const requiredPaymentIds = ['checkout-card-number', 'checkout-cardholder', 'checkout-expiry', 'checkout-cvv'];

  function validateShippingStep() {
    let firstInvalid = null;
    requiredShippingIds.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const isEmpty = !input.value.trim();
      if (isEmpty) {
        input.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = input;
      } else {
        input.removeAttribute('aria-invalid');
      }
    });
    return { valid: !firstInvalid, firstInvalid };
  }

  function canGoToStep2() {
    const { valid, firstInvalid } = validateShippingStep();
    const errorEl = document.getElementById('checkout-shipping-error');
    if (!valid && firstInvalid) {
      if (errorEl) {
        errorEl.textContent = 'Please fill in all required fields: First Name, Address, and Zip Code.';
        errorEl.removeAttribute('hidden');
      }
      firstInvalid.focus();
      return false;
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.setAttribute('hidden', '');
    }
    return true;
  }

  function validatePaymentStep() {
    let firstInvalid = null;
    requiredPaymentIds.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const isEmpty = !input.value.trim();
      if (isEmpty) {
        input.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = input;
      } else {
        input.removeAttribute('aria-invalid');
      }
    });
    return { valid: !firstInvalid, firstInvalid };
  }

  function canCompletePayment() {
    const { valid, firstInvalid } = validatePaymentStep();
    const errorEl = document.getElementById('checkout-payment-error');
    if (!valid && firstInvalid) {
      if (errorEl) {
        errorEl.textContent = 'Please fill in all required fields: Card Number, Cardholder Name, Expiration Date, and Security Code.';
        errorEl.removeAttribute('hidden');
      }
      firstInvalid.focus();
      return false;
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.setAttribute('hidden', '');
    }
    return true;
  }

  function goToStep(step) {
    currentStep = step;
    if (step === 1) {
      if (panelShipping) panelShipping.removeAttribute('hidden');
      if (panelPayment) panelPayment.setAttribute('hidden', '');
      if (step1El) {
        step1El.classList.add('checkout-steps__item--current');
        step1El.classList.remove('checkout-steps__item--completed');
        step1El.setAttribute('aria-current', 'step');
        step2El?.classList.remove('checkout-steps__item--current');
        step2El?.removeAttribute('aria-current');
      }
      if (continueBtn) {
        continueBtn.textContent = continueBtn.dataset.step1Text || 'Continue to payment';
      }
      const step1Trigger = modal.querySelector('.checkout-steps__trigger[data-step="1"]');
      if (step1Trigger) step1Trigger.setAttribute('aria-label', 'Step 1: Shipping (current step)');
      const step2Trigger = modal.querySelector('.checkout-steps__trigger[data-step="2"]');
      if (step2Trigger) step2Trigger.setAttribute('aria-label', 'Go to step 2: Payment');
      const firstInput = modal.querySelector('#checkout-first-name');
      if (firstInput) firstInput.focus();
    } else {
      if (panelShipping) panelShipping.setAttribute('hidden', '');
      if (panelPayment) panelPayment.removeAttribute('hidden');
      if (step2El) {
        step2El.classList.add('checkout-steps__item--current');
        step2El.setAttribute('aria-current', 'step');
        step1El?.classList.remove('checkout-steps__item--current');
        step1El?.removeAttribute('aria-current');
        step1El?.classList.add('checkout-steps__item--completed');
      }
      if (continueBtn) {
        continueBtn.textContent = continueBtn.dataset.step2Text || 'Place order';
      }
      const step1Trigger = modal.querySelector('.checkout-steps__trigger[data-step="1"]');
      if (step1Trigger) step1Trigger.setAttribute('aria-label', 'Go to step 1: Shipping');
      const step2Trigger = modal.querySelector('.checkout-steps__trigger[data-step="2"]');
      if (step2Trigger) step2Trigger.setAttribute('aria-label', 'Step 2: Payment (current step)');
      const firstPaymentInput = modal.querySelector('#checkout-card-number');
      if (firstPaymentInput) firstPaymentInput.focus();
    }
  }

  function openModal() {
    previousActiveElement = document.activeElement;
    goToStep(1);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('#checkout-first-name');
    if (firstInput) firstInput.focus();
    modal.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', trapFocus);
    goToStep(1);
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  openBtn.addEventListener('click', openModal);
  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeModal);
  });
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  continueBtn?.addEventListener('click', () => {
    if (currentStep === 1) {
      if (!canGoToStep2()) return;
      goToStep(2);
    } else {
      if (!canCompletePayment()) return;
      closeModal();
    }
  });

  const stepTriggers = modal.querySelectorAll('.checkout-steps__trigger');
  stepTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      if (step === 2 && currentStep === 1 && !canGoToStep2()) return;
      if (step >= 1 && step <= 2) goToStep(step);
    });
  });

  requiredShippingIds.forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener('input', () => {
      if (input.value.trim()) input.removeAttribute('aria-invalid');
      const err = document.getElementById('checkout-shipping-error');
      if (err && !err.hidden) {
        err.textContent = '';
        err.setAttribute('hidden', '');
      }
    });
  });

  requiredPaymentIds.forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener('input', () => {
      if (input.value.trim()) input.removeAttribute('aria-invalid');
      const err = document.getElementById('checkout-payment-error');
      if (err && !err.hidden) {
        err.textContent = '';
        err.setAttribute('hidden', '');
      }
    });
  });
}

const STATE_OPTIONS = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const CITY_OPTIONS = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
  "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus",
  "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Boston", "Nashville",
  "Detroit", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee",
  "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Atlanta", "Miami",
  "Raleigh", "Omaha", "Minneapolis", "Cleveland", "Tampa", "Orlando", "St. Louis",
  "Pittsburgh", "Cincinnati", "Anchorage", "Honolulu", "New Orleans", "Salt Lake City"
];

function initStateCityAutocomplete() {
  initAutocomplete("checkout-state", "checkout-state-listbox", STATE_OPTIONS);
  initAutocomplete("checkout-city", "checkout-city-listbox", CITY_OPTIONS);
}

function initAutocomplete(inputId, listboxId, options) {
  const input = document.getElementById(inputId);
  const listbox = document.getElementById(listboxId);
  if (!input || !listbox) return;

  let activeIndex = -1;
  let filteredOptions = [];
  let blurTimeout = null;
  let scrollResizeCleanup = null;

  function getOptionId(i) {
    return `${listboxId}-option-${i}`;
  }

  function positionListbox() {
    const rect = input.getBoundingClientRect();
    listbox.style.top = `${rect.bottom + 4}px`;
    listbox.style.left = `${rect.left}px`;
    listbox.style.width = `${rect.width}px`;
  }

  function showList(items) {
    filteredOptions = items;
    activeIndex = -1;
    listbox.innerHTML = "";
    listbox.removeAttribute("hidden");
    input.setAttribute("aria-expanded", "true");
    input.removeAttribute("aria-activedescendant");

    if (items.length === 0) {
      listbox.setAttribute("hidden", "");
      input.setAttribute("aria-expanded", "false");
      return;
    }

    items.forEach((text, i) => {
      const opt = document.createElement("div");
      opt.setAttribute("role", "option");
      opt.id = getOptionId(i);
      opt.className = "autocomplete-listbox__option";
      opt.textContent = text;
      opt.addEventListener("click", (e) => {
        e.preventDefault();
        choose(i);
      });
      listbox.appendChild(opt);
    });

    positionListbox();
    const scrollContainer = input.closest(".modal__content") || document.documentElement;
    const onScrollOrResize = () => positionListbox();
    scrollContainer.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    scrollResizeCleanup = () => {
      scrollContainer.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }

  function hideList() {
    listbox.setAttribute("hidden", "");
    listbox.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
    filteredOptions = [];
    if (scrollResizeCleanup) {
      scrollResizeCleanup();
      scrollResizeCleanup = null;
    }
  }

  function choose(i) {
    if (i >= 0 && i < filteredOptions.length) {
      input.value = filteredOptions[i];
    }
    hideList();
  }

  function filterOptions(value) {
    const q = (value || "").trim().toLowerCase();
    if (!q) return options.slice(0, 10);
    return options.filter((s) => s.toLowerCase().includes(q)).slice(0, 10);
  }

  input.addEventListener("input", () => {
    const value = input.value;
    const items = filterOptions(value);
    showList(items);
  });

  input.addEventListener("focus", () => {
    if (blurTimeout) clearTimeout(blurTimeout);
    const items = filterOptions(input.value);
    showList(items.length ? items : options.slice(0, 10));
  });

  input.addEventListener("blur", () => {
    blurTimeout = setTimeout(hideList, 200);
  });

  input.addEventListener("keydown", (e) => {
    if (listbox.hasAttribute("hidden") || filteredOptions.length === 0) {
      if (e.key === "ArrowDown") {
        const items = filterOptions(input.value);
        showList(items.length ? items : options.slice(0, 10));
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filteredOptions.length - 1);
        updateActiveOption();
        break;
      case "ArrowUp":
        e.preventDefault();
        activeIndex = activeIndex <= 0 ? -1 : activeIndex - 1;
        updateActiveOption();
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) choose(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        hideList();
        break;
      default:
        break;
    }
  });

  function updateActiveOption() {
    listbox.querySelectorAll("[role=option]").forEach((el, i) => {
      const selected = i === activeIndex;
      el.setAttribute("aria-selected", selected);
      if (selected) {
        input.setAttribute("aria-activedescendant", el.id);
        el.scrollIntoView({ block: "nearest" });
      }
    });
    if (activeIndex < 0) {
      input.removeAttribute("aria-activedescendant");
    }
  }
}

function initCarousel() {
  const carousel = document.querySelector('.carousel');
  const thumbnails = document.querySelectorAll('.carousel__thumb');
  const mainImage = document.querySelector('.carousel__image');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');
  const liveEl = document.querySelector('.carousel__live');

  const images = [
    'images/carousel-1.png',
    'images/carousel-2.png',
    'images/carousel-3.png'
  ];

  const total = images.length;
  let currentIndex = 0;

  function setActiveImage(index) {
    currentIndex = (index + images.length) % images.length;
    if (mainImage) {
      mainImage.src = images[currentIndex];
      mainImage.alt = `Rainbow Galaxy bouquet. Image ${currentIndex + 1} of ${total}.`;
    }
    thumbnails.forEach((thumb, i) => {
      const isActive = i === currentIndex;
      thumb.classList.toggle('carousel__thumb--active', isActive);
      thumb.setAttribute('aria-selected', isActive);
    });
    if (liveEl) {
      liveEl.textContent = `Image ${currentIndex + 1} of ${total}`;
    }
  }

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => setActiveImage(index));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => setActiveImage(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => setActiveImage(currentIndex + 1));
  }

  if (carousel) {
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveImage(currentIndex - 1);
        thumbnails[currentIndex]?.focus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveImage(currentIndex + 1);
        thumbnails[currentIndex]?.focus();
      }
    });
  }

  if (liveEl) {
    liveEl.textContent = `Image 1 of ${total}`;
  }
}

function initQuantitySelector() {
  const input = document.querySelector('.quantity-selector__input');
  const decreaseBtn = document.querySelector('.quantity-selector__btn:first-of-type');
  const increaseBtn = document.querySelector('.quantity-selector__btn:last-of-type');

  if (!input || !decreaseBtn || !increaseBtn) return;

  function updateQuantity(delta) {
    let value = parseInt(input.value, 10) || 1;
    value = Math.max(1, Math.min(99, value + delta));
    input.value = value;
  }

  decreaseBtn.addEventListener('click', () => updateQuantity(-1));
  increaseBtn.addEventListener('click', () => updateQuantity(1));

  input.addEventListener('change', () => {
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 1) input.value = 1;
    else if (value > 99) input.value = 99;
  });
}
