// ===== NOTIFICATIONS SYSTEM =====
function showNotification(message, type = 'info') {
  const existingNotifs = document.querySelectorAll('.notification');
  existingNotifs.forEach(notif => notif.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-text">${message}</span>
    </div>
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function getNotificationIcon(type) {
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  return icons[type] || icons.info;
}

// ===== NOTIFICATION STYLES =====
function injectNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: 10px;
      padding: 15px 20px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      z-index: 2500;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .notification.show {
      opacity: 1;
    }

    .notification.notification-success {
      border-color: #10b981;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
    }

    .notification.notification-error {
      border-color: #ef4444;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
    }

    .notification.notification-info {
      border-color: #4da3ff;
      background: linear-gradient(135deg, rgba(77, 163, 255, 0.15) 0%, rgba(77, 163, 255, 0.05) 100%);
    }

    .notification.notification-warning {
      border-color: #f59e0b;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%);
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-weight: 500;
    }

    .notification-icon {
      font-size: 1.3em;
      flex-shrink: 0;
    }

    .notification-text {
      flex: 1;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== MODAL FUNCTIONS =====
function openCheckout(productName, productPrice) {
  const modal = document.getElementById('checkoutModal');
  document.getElementById('productName').textContent = productName;
  document.getElementById('productPrice').textContent = productPrice;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const modal = document.getElementById('checkoutModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  injectNotificationStyles();

  // ===== CHECKOUT FORM HANDLER =====
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const freeFireId = document.getElementById('freeFireId').value.trim();
      const natcashId = document.getElementById('natcashId').value.trim();
      const email = document.getElementById('email').value.trim();

      // Validation
      if (!freeFireId) {
        showNotification('Veuillez entrer votre ID Free Fire', 'error');
        document.getElementById('freeFireId').focus();
        return;
      }

      if (!natcashId) {
        showNotification('Veuillez entrer votre ID NatCash', 'error');
        document.getElementById('natcashId').focus();
        return;
      }

      if (!email) {
        showNotification('Veuillez entrer votre email', 'error');
        document.getElementById('email').focus();
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
      }

      showNotification('Traitement de votre commande...', 'info');

      setTimeout(() => {
        const productName = document.getElementById('productName').textContent;
        const productPrice = document.getElementById('productPrice').textContent;
        
        const message = `Bonjour ShadowHT !%0A%0AJe souhaite acheter: ${productName}%0APrix: ${productPrice}%0A%0AID Free Fire: ${freeFireId}%0AID NatCash: ${natcashId}%0AEmail: ${email}`;
        
        showNotification('Redirection vers WhatsApp...', 'success');

        setTimeout(() => {
          window.open(`https://wa.me/50956246319?text=${message}`, '_blank');
          closeCheckout();
          checkoutForm.reset();
        }, 1500);
      }, 1000);
    });
  }

  // Close modal when clicking X
  const closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCheckout);
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('checkoutModal');
    if (e.target === modal) {
      closeCheckout();
    }
  });

  // ===== FILTER FUNCTIONALITY =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardFilter = card.getAttribute('data-filter');
        
        if (filterValue === 'all' || cardFilter === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.animation = 'fadeInDown 0.5s ease-out';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ===== SMOOTH SCROLL NAVIGATION =====
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          
          // Update active link
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Close mobile menu if open
          const navMenu = document.querySelector('.nav-menu');
          if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
            document.querySelector('.hamburger').classList.remove('active');
          }
        }
      }
    });
  });

  // ===== SCROLL ANIMATION =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInDown 0.8s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .product-card, .testimonial-card, .stat-card, .info-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[type="text"]').value;
      showNotification(`Merci ${name} ! Nous vous répondrons bientôt.`, 'success');
      contactForm.reset();
    });
  }

  // ===== MOBILE MENU =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
      } else {
        navMenu.style.display = 'flex';
        hamburger.classList.add('active');
      }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
      });
    });
  }

  // ===== ACTIVE LINK UPDATE ON SCROLL =====
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ===== FORM FIELD ANIMATIONS =====
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'scale(1)';
    });
  });

  // ===== COUNTER ANIMATION =====
  function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Observe stat cards
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const text = entry.target.textContent;
        const numMatch = text.match(/\d+/);
        if (numMatch) {
          const num = parseInt(numMatch[0]);
          animateCounter(entry.target, num);
          entry.target.classList.add('animated');
        }
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statObserver.observe(stat));

  console.log('✅ ShadowHT Website Initialized Successfully!');
  console.log('🚀 All features are active and ready to use.');
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.animation = 'fadeIn 0.5s ease-out';
});

// ===== PREVENT SCROLL ON MODAL OPEN =====
function preventScroll(e) {
  e.preventDefault();
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Erreur détectée:', e.error);
});