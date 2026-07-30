document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const buttons = document.querySelectorAll('.buy-button');
  const dialogOverlay = document.getElementById('contactDialog');
  const contactActions = document.querySelectorAll('.contact-option');
  const closeButton = document.getElementById('contactDialogClose');
  const gateOverlay = document.getElementById('ageGateOverlay');
  const mainContent = document.getElementById('mainContent');
  const ageForm = document.getElementById('ageForm');
  const ageButtons = document.querySelectorAll('.age-confirm-btn');
  const ageMessage = document.getElementById('ageMessage');

  const contactConfig = {
    snapchatUrl: 'https://www.snapchat.com/add/sos_sl243',
    instagramUrl: 'https://www.instagram.com/sos_sl_',
  };

  let selectedProduct = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2200);
  }

  function openDialog(productName) {
    selectedProduct = productName;
    dialogOverlay.classList.add('visible');
    dialogOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeDialog() {
    dialogOverlay.classList.remove('visible');
    dialogOverlay.setAttribute('aria-hidden', 'true');
    selectedProduct = null;
  }

  function isMobileDevice() {
    const userAgent = navigator.userAgent || '';
    const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    return /Android|iPhone|iPad|iPod|Mobile|mobile/i.test(userAgent) || (hasTouch && window.innerWidth <= 768);
  }

  function getContactUrl(method, preferApp = false) {
    if (method === 'instagram') {
      return preferApp && isMobileDevice()
        ? 'instagram://user?username=sos_sl_'
        : contactConfig.instagramUrl;
    }
    if (method === 'snapchat') {
      return preferApp && isMobileDevice()
        ? 'snapchat://add/sos_sl243'
        : contactConfig.snapchatUrl;
    }

    return contactConfig.snapchatUrl;
  }

  const AGE_KEY = 'sos-sl-age-verified';
  const TEST_MODE = true;

  function setGateVisibility(isVisible) {
    if (gateOverlay) {
      gateOverlay.style.display = isVisible ? 'grid' : 'none';
      gateOverlay.setAttribute('aria-hidden', String(!isVisible));
    }

    if (mainContent) {
      mainContent.classList.toggle('hidden', isVisible);
      mainContent.style.display = isVisible ? 'none' : 'block';
      mainContent.setAttribute('aria-hidden', String(isVisible));
    }
  }

  function closeGateWithTransition() {
    if (!gateOverlay) return;
    gateOverlay.style.opacity = '0';
    gateOverlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      setGateVisibility(false);
    }, 280);
  }

  function allowAccess() {
    if (!TEST_MODE) {
      localStorage.setItem(AGE_KEY, 'true');
    }
    closeGateWithTransition();
  }

  if (TEST_MODE) {
    localStorage.removeItem(AGE_KEY);
  }

  setGateVisibility(true);

  if (!TEST_MODE && localStorage.getItem(AGE_KEY) === 'true') {
    allowAccess();
  } else if (gateOverlay && mainContent && ageForm && ageMessage) {
    ageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const choice = button.dataset.ageChoice;

        if (choice === 'over18') {
          ageMessage.textContent = 'Access granted. Welcome.';
          allowAccess();
        } else {
          ageMessage.textContent = 'Access denied. You must be 18 or older.';
        }
      });
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const productName = button.dataset.product || 'votre produit';
      const card = button.closest('.product-card');

      if (card) {
        card.classList.add('added');
        setTimeout(() => card.classList.remove('added'), 1000);
      }

      openDialog(productName);
    });
  });

  contactActions.forEach((option) => {
    option.addEventListener('click', (event) => {
      event.preventDefault();
      const method = option.dataset.method;
      closeDialog();
      showToast(`Redirection vers ${method === 'instagram' ? 'Instagram' : 'Snapchat'}...`);

      if (isMobileDevice()) {
        const appUrl = getContactUrl(method, true);
        const fallbackUrl = getContactUrl(method);

        window.location.href = appUrl;

        setTimeout(() => {
          window.location.href = fallbackUrl;
        }, 1500);
      } else {
        setTimeout(() => {
          window.open(getContactUrl(method), '_blank', 'noopener,noreferrer');
        }, 1200);
      }
    });
  });

  closeButton.addEventListener('click', closeDialog);
  dialogOverlay.addEventListener('click', (event) => {
    if (event.target === dialogOverlay) {
      closeDialog();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialogOverlay.classList.contains('visible')) {
      closeDialog();
    }
  });
});
