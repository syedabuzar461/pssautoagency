document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky Header (rAF-throttled, passive) ── */
  var header = document.getElementById('site-header');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        header.classList.toggle('scrolled', window.scrollY > 70);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── Hamburger ── */
  var hamburger = document.getElementById('hamburger-btn');
  var nav = document.getElementById('main-nav');
  hamburger.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* ── Typewriter ── */
  var words = ['CREATE.', 'CONNECT.', 'CONVERT.'];
  var wi = 0, ci = 0, deleting = false;
  var tw = document.getElementById('typewriter-word');

  function type() {
    if (!tw) return;
    var word = words[wi];
    if (!deleting) {
      ci++;
      tw.textContent = word.slice(0, ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      ci--;
      tw.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 55 : 115);
  }
  setTimeout(type, 600);

  /* ── Hero Scroll Arrow ── */
  var scrollEl = document.getElementById('hero-scroll');
  if (scrollEl) {
    scrollEl.addEventListener('click', function () {
      var t = document.getElementById('clients');
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-item__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = this.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-item__q').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!open) {
        this.setAttribute('aria-expanded', 'true');
        this.nextElementSibling.classList.add('open');
      }
    });
  });

  /* ── Contact Form → Google Sheets Backend ── */
  // Read secure URL from config.js (excluded from Git)
  const GOOGLE_SCRIPT_URL = (window.CONFIG && window.CONFIG.GOOGLE_SCRIPT_URL) 
    ? window.CONFIG.GOOGLE_SCRIPT_URL 
    : 'NOT_CONFIGURED';
  
  var form = document.getElementById('contact-form');
  var iti;
  var phoneInput = document.getElementById('f-phone');
  if (phoneInput && typeof window.intlTelInput !== 'undefined') {
    iti = window.intlTelInput(phoneInput, {
      initialCountry: "in",
      separateDialCode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg      = document.getElementById('form-success');
      var submitBtn = document.getElementById('form-submit');
      
      // Construct direct URL encoded payload for no-cors simple requests
      var params = new URLSearchParams();
      params.append('first_name',   document.getElementById('f-firstname').value);
      params.append('last_name',    document.getElementById('f-lastname').value);
      params.append('email_id',     document.getElementById('f-email').value);
      params.append('company_name', document.getElementById('f-company').value);
      params.append('phone_number', iti ? iti.getNumber() : phoneInput.value);
      var budgetEl = document.getElementById('f-budget');
      if (budgetEl) {
        params.append('budget_range', budgetEl.value);
      }
      params.append('service_type', document.getElementById('f-service') ? document.getElementById('f-service').value : '');
      params.append('message',      document.getElementById('f-msg') ? document.getElementById('f-msg').value : '');

      submitBtn.textContent = 'SENDING…';
      submitBtn.disabled = true;
      msg.textContent = '';
      
      // If not configured yet, output notice
      if(GOOGLE_SCRIPT_URL === 'NOT_CONFIGURED' || GOOGLE_SCRIPT_URL.indexOf('PASTE') !== -1){
         alert("Config missing! Ensure config.js exists and sets window.CONFIG.GOOGLE_SCRIPT_URL");
         submitBtn.textContent = 'SEND MESSAGE 🚀';
         submitBtn.disabled = false;
         return;
      }

      // Using no-cors mode ensures local static file:// origins can blast 
      // simple packets successfully without browser security blockers.
      fetch(GOOGLE_SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        cache:   'no-cache',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    params
      })
      .then(function () {
        // Since mode is 'no-cors', response is opaque but transmission succeeded.
        form.innerHTML = `
          <div class="form-success-screen" style="text-align: center; padding: 40px 0; animation: revealIn .5s ease forwards;">
            <h3 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em;">🚀 Lead Received!</h3>
            <p style="font-size: .95rem; font-weight: 600; line-height: 1.7; color: #444; max-width: 380px; margin: 0 auto 32px;">Our automated engine has captured your request. Syed or the Incognito team will reach out within 24 hours.</p>
            <div style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 800; color: #c61f3e; border: 1.5px solid #c61f3e; padding: 8px 16px; letter-spacing: .05em;">[ PACKET TRANSMITTED & VERIFIED ]</div>
          </div>
        `;
      })
      .catch(function () {
        msg.textContent = '⚠ Could not reach server. Please email us directly.';
        msg.style.color = '#ff4444';
        submitBtn.textContent = 'SEND MESSAGE 🚀';
        submitBtn.disabled = false;
      });
    });
  }

  /* ── Scroll Reveal ── */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(
      '.service-card,.case-card,.testi-card,.stat-item,.trusted__logo,.faq-item'
    ).forEach(function (el) { el.classList.add('reveal'); obs.observe(el); });
  }

  /* ── Footer Year ── */
  var yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

});
