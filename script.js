document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky Header ── */
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 70);
  });

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

  /* ── Contact Form → Backend API ── */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg      = document.getElementById('form-success');
      var submitBtn = document.getElementById('form-submit');
      var data = {
        name:    document.getElementById('f-name').value,
        email:   document.getElementById('f-email').value,
        service: document.getElementById('f-service').value,
        message: document.getElementById('f-msg').value
      };

      submitBtn.textContent = 'SENDING…';
      submitBtn.disabled = true;
      msg.textContent = '';
      msg.style.color = '';

      fetch('http://localhost:5000/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success) {
          msg.textContent = '🎉 ' + res.message;
          msg.style.color = '#C61F3E';
          form.reset();
        } else {
          var errText = res.errors ? res.errors.map(function(err){ return err.msg; }).join(', ') : (res.message || 'Something went wrong.');
          msg.textContent = '⚠ ' + errText;
          msg.style.color = '#ff4444';
        }
      })
      .catch(function () {
        msg.textContent = '⚠ Could not reach server. Please email us directly.';
        msg.style.color = '#ff4444';
      })
      .finally(function () {
        submitBtn.textContent = 'SEND MESSAGE 🚀';
        submitBtn.disabled = false;
        setTimeout(function () { msg.textContent = ''; }, 6000);
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
